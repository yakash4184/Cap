import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createIssueForCitizen,
  createStatusNotification,
  getAverageResolutionHours,
  loadIssues,
  loadNotifications,
  saveIssues,
  saveNotifications,
} from "@/lib/civic-data";
import { useAuth } from "@/contexts/AuthContext";
import type {
  AppNotification,
  CivicIssue,
  Department,
  IssuePriority,
  IssueStatus,
  IssueSubmissionInput,
} from "@/types/civic";

interface UpdateIssueInput {
  status: IssueStatus;
  department: Department;
  priority: IssuePriority;
  resolutionProofUrl?: string;
  note?: string;
}

interface CivicDataContextType {
  issues: CivicIssue[];
  notifications: AppNotification[];
  loading: boolean;
  submitIssue: (input: IssueSubmissionInput) => void;
  updateIssue: (issueId: string, updates: UpdateIssueInput) => void;
  markNotificationRead: (notificationId: string) => void;
  getCitizenIssues: (citizenId?: string | null) => CivicIssue[];
  getUserNotifications: (userId?: string | null) => AppNotification[];
  analytics: {
    totalIssues: number;
    resolvedIssues: number;
    averageResolutionHours: number;
    topCategory: string;
    issueCountByLocation: Record<string, number>;
  };
}

const CivicDataContext = createContext<CivicDataContextType | undefined>(undefined);

export function CivicDataProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    setIssues(loadIssues());
    setNotifications(loadNotifications());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") {
      return undefined;
    }

    channelRef.current = new BroadcastChannel("civic-pulse-sync");
    channelRef.current.onmessage = () => {
      setIssues(loadIssues());
      setNotifications(loadNotifications());
    };

    return () => {
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    function syncFromStorage(event: StorageEvent) {
      if (!event.key) {
        return;
      }

      if (event.key === "civic-pulse.issues") {
        setIssues(loadIssues());
      }

      if (event.key === "civic-pulse.notifications") {
        setNotifications(loadNotifications());
      }
    }

    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  const broadcastSync = useCallback(() => {
    channelRef.current?.postMessage({ type: "SYNC" });
  }, []);

  const syncIssues = useCallback(
    (nextIssues: CivicIssue[]) => {
      setIssues(nextIssues);
      saveIssues(nextIssues);
      broadcastSync();
    },
    [broadcastSync],
  );

  const syncNotifications = useCallback(
    (nextNotifications: AppNotification[]) => {
      setNotifications(nextNotifications);
      saveNotifications(nextNotifications);
      broadcastSync();
    },
    [broadcastSync],
  );

  const submitIssue = useCallback(
    (input: IssueSubmissionInput) => {
      if (!currentUser || currentUser.role !== "CITIZEN") {
        return;
      }

      const { issue, notification } = createIssueForCitizen(currentUser, input);
      syncIssues([issue, ...issues]);
      syncNotifications([notification, ...notifications]);
    },
    [currentUser, issues, notifications, syncIssues, syncNotifications],
  );

  const updateIssue = useCallback(
    (issueId: string, updates: UpdateIssueInput) => {
      const targetIssue = issues.find((issue) => issue.id === issueId);
      if (!targetIssue) {
        return;
      }

      const timestamp = new Date().toISOString();
      const nextIssue: CivicIssue = {
        ...targetIssue,
        status: updates.status,
        department: updates.department,
        priority: updates.priority,
        resolutionProofUrl: updates.resolutionProofUrl || targetIssue.resolutionProofUrl,
        updatedAt: timestamp,
        assignedTeam: `${targetIssue.location.locationName} ${updates.department}`,
        history: [
          ...targetIssue.history,
          {
            status: updates.status,
            timestamp,
            note:
              updates.note?.trim() ||
              `Issue moved to ${updates.status} by municipal authority.`,
          },
        ],
      };

      syncIssues(issues.map((issue) => (issue.id === issueId ? nextIssue : issue)));

      if (updates.status !== targetIssue.status) {
        const notification = createStatusNotification(nextIssue, updates.status);
        syncNotifications([notification, ...notifications]);
      }
    },
    [issues, notifications, syncIssues, syncNotifications],
  );

  const markNotificationRead = useCallback(
    (notificationId: string) => {
      syncNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      );
    },
    [notifications, syncNotifications],
  );

  const getCitizenIssues = useCallback(
    (citizenId?: string | null) =>
      citizenId ? issues.filter((issue) => issue.citizenId === citizenId) : [],
    [issues],
  );

  const getUserNotifications = useCallback(
    (userId?: string | null) =>
      userId
        ? notifications
            .filter((notification) => notification.userId === userId)
            .sort(
              (left, right) =>
                new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
            )
        : [],
    [notifications],
  );

  const analytics = useMemo(() => {
    const byCategory = issues.reduce<Record<string, number>>((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {});

    const byLocation = issues.reduce<Record<string, number>>((acc, issue) => {
      acc[issue.location.locationName] = (acc[issue.location.locationName] || 0) + 1;
      return acc;
    }, {});

    const topCategoryEntry =
      Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0] ?? null;

    return {
      totalIssues: issues.length,
      resolvedIssues: issues.filter((issue) => issue.status === "resolved").length,
      averageResolutionHours: getAverageResolutionHours(issues),
      topCategory: topCategoryEntry ? topCategoryEntry[0] : "none",
      issueCountByLocation: byLocation,
    };
  }, [issues]);

  const value = useMemo<CivicDataContextType>(
    () => ({
      issues,
      notifications,
      loading,
      submitIssue,
      updateIssue,
      markNotificationRead,
      getCitizenIssues,
      getUserNotifications,
      analytics,
    }),
    [
      analytics,
      getCitizenIssues,
      getUserNotifications,
      issues,
      loading,
      markNotificationRead,
      notifications,
      submitIssue,
      updateIssue,
    ],
  );

  return <CivicDataContext.Provider value={value}>{children}</CivicDataContext.Provider>;
}

export function useCivicData() {
  const context = useContext(CivicDataContext);

  if (!context) {
    throw new Error("useCivicData must be used inside CivicDataProvider.");
  }

  return context;
}
