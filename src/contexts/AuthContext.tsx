import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AdminAuthError,
  LOCATIONS,
  authenticateAdmin,
  clearAdminSession,
  createLocationAdminRecord,
  loadAdminRecords,
  loadAdminSession,
  saveAdminRecords,
  saveAdminSession,
  usernameExists,
} from "@/lib/admin-auth";
import type {
  AdminFormValues,
  AdminLocation,
  AdminRecord,
  AdminSession,
  LoginCredentials,
} from "@/types/admin";

interface AuthContextType {
  admins: AdminRecord[];
  currentAdmin: AdminSession | null;
  locations: readonly AdminLocation[];
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  addLocationAdmin: (values: AdminFormValues) => void;
  updateLocationAdmin: (adminId: string, values: AdminFormValues) => void;
  deleteLocationAdmin: (adminId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seededAdmins = loadAdminRecords();
    const storedSession = loadAdminSession();
    setAdmins(seededAdmins);
    setCurrentAdmin(storedSession);
    setLoading(false);
  }, []);

  const syncAdmins = useCallback((nextAdmins: AdminRecord[]) => {
    setAdmins(nextAdmins);
    saveAdminRecords(nextAdmins);
  }, []);

  const assertUniqueUsername = useCallback(
    (username: string, excludedId?: string) => {
      if (usernameExists(admins, username, excludedId)) {
        throw new AdminAuthError(
          "DUPLICATE_USERNAME",
          "Username already exists for another admin.",
        );
      }
    },
    [admins],
  );

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const session = authenticateAdmin(admins, credentials);
      setCurrentAdmin(session);
      saveAdminSession(session);
    },
    [admins],
  );

  const logout = useCallback(() => {
    setCurrentAdmin(null);
    clearAdminSession();
  }, []);

  const addLocationAdmin = useCallback(
    (values: AdminFormValues) => {
      assertUniqueUsername(values.username);
      const nextAdmins = [...admins, createLocationAdminRecord(values)];
      syncAdmins(nextAdmins);
    },
    [admins, assertUniqueUsername, syncAdmins],
  );

  const updateLocationAdmin = useCallback(
    (adminId: string, values: AdminFormValues) => {
      const targetAdmin = admins.find((admin) => admin.id === adminId);
      if (!targetAdmin) {
        throw new AdminAuthError("NOT_FOUND", "Selected admin record was not found.");
      }

      if (targetAdmin.role === "SUPER_ADMIN") {
        throw new AdminAuthError(
          "PROTECTED_ADMIN",
          "Super Admin account cannot be edited from this panel.",
        );
      }

      assertUniqueUsername(values.username, adminId);

      const nextAdmins = admins.map((admin) =>
        admin.id === adminId
          ? {
              ...admin,
              username: values.username.trim(),
              password: values.password,
              location: values.location,
              updatedAt: new Date().toISOString(),
            }
          : admin,
      );

      syncAdmins(nextAdmins);
    },
    [admins, assertUniqueUsername, syncAdmins],
  );

  const deleteLocationAdmin = useCallback(
    (adminId: string) => {
      const targetAdmin = admins.find((admin) => admin.id === adminId);
      if (!targetAdmin) {
        throw new AdminAuthError("NOT_FOUND", "Selected admin record was not found.");
      }

      if (targetAdmin.role === "SUPER_ADMIN") {
        throw new AdminAuthError(
          "PROTECTED_ADMIN",
          "Super Admin account cannot be deleted.",
        );
      }

      syncAdmins(admins.filter((admin) => admin.id !== adminId));
    },
    [admins, syncAdmins],
  );

  const value = useMemo<AuthContextType>(
    () => ({
      admins,
      currentAdmin,
      locations: LOCATIONS,
      loading,
      login,
      logout,
      addLocationAdmin,
      updateLocationAdmin,
      deleteLocationAdmin,
    }),
    [
      admins,
      currentAdmin,
      loading,
      login,
      logout,
      addLocationAdmin,
      updateLocationAdmin,
      deleteLocationAdmin,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
