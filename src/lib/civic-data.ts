import type {
  AdminLoginInput,
  AppNotification,
  AppSession,
  AppUser,
  CitizenLoginInput,
  CitizenRegistrationInput,
  CivicIssue,
  Department,
  IssueCategory,
  IssuePriority,
  IssueStatus,
  IssueSubmissionInput,
  LocationName,
} from "@/types/civic";

export const USER_STORAGE_KEY = "civic-pulse.users";
export const SESSION_STORAGE_KEY = "civic-pulse.session";
export const ISSUE_STORAGE_KEY = "civic-pulse.issues";
export const NOTIFICATION_STORAGE_KEY = "civic-pulse.notifications";

export const categoryLabels: Record<IssueCategory, string> = {
  pothole: "Pothole",
  streetlight: "Streetlight",
  garbage: "Garbage Overflow",
  water_leak: "Water Leakage",
  sewage: "Sewage Blockage",
  illegal_dumping: "Illegal Dumping",
};

export const categoryIcons: Record<IssueCategory, string> = {
  pothole: "🕳️",
  streetlight: "💡",
  garbage: "🗑️",
  water_leak: "💧",
  sewage: "🚧",
  illegal_dumping: "🚯",
};

export const statusLabels: Record<IssueStatus, string> = {
  submitted: "Submitted",
  acknowledged: "Acknowledged",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export const priorityLabels: Record<IssuePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const departmentByCategory: Record<IssueCategory, Department> = {
  pothole: "Public Works",
  streetlight: "Electricity",
  garbage: "Sanitation",
  water_leak: "Water Department",
  sewage: "Water Department",
  illegal_dumping: "Sanitation",
};

export const priorityByCategory: Record<IssueCategory, IssuePriority> = {
  pothole: "high",
  streetlight: "medium",
  garbage: "medium",
  water_leak: "critical",
  sewage: "high",
  illegal_dumping: "medium",
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

class CivicAuthError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "CivicAuthError";
    this.code = code;
  }
}

export { CivicAuthError };

const seededUsers: AppUser[] = [
  {
    id: "user-citizen-seed",
    name: "Riya Sharma",
    email: "riya@example.com",
    password: "Citizen@123",
    role: "CITIZEN",
    location: "Mirzapur",
    createdAt: "2026-03-19T09:00:00.000Z",
  },
  {
    id: "user-super-admin-seed",
    name: "Super Admin",
    email: "superadmin@civicpulse.in",
    password: "Super@123",
    role: "SUPER_ADMIN",
    location: "Delhi",
    username: "superadmin",
    createdAt: "2026-03-19T09:10:00.000Z",
  },
  {
    id: "user-mirzapur-admin-seed",
    name: "Mirzapur Admin",
    email: "mirzapur.admin@civicpulse.in",
    password: "Mirza@123",
    role: "LOCATION_ADMIN",
    location: "Mirzapur",
    username: "mirzapur.admin",
    createdAt: "2026-03-19T09:20:00.000Z",
  },
  {
    id: "user-delhi-admin-seed",
    name: "Delhi Admin",
    email: "delhi.admin@civicpulse.in",
    password: "Delhi@123",
    role: "LOCATION_ADMIN",
    location: "Delhi",
    username: "delhi.admin",
    createdAt: "2026-03-19T09:30:00.000Z",
  },
];

const seededIssues: CivicIssue[] = [
  {
    id: "issue-seed-1",
    title: "Large pothole near Ghantaghar",
    description: "Deep pothole causing traffic disruption near the main crossing.",
    category: "pothole",
    priority: "high",
    status: "assigned",
    department: "Public Works",
    location: {
      lat: 25.1461,
      lng: 82.5697,
      address: "Ghantaghar Main Road",
      locationName: "Mirzapur",
    },
    citizenId: "user-citizen-seed",
    citizenName: "Riya Sharma",
    citizenEmail: "riya@example.com",
    createdAt: "2026-03-18T08:10:00.000Z",
    updatedAt: "2026-03-18T12:15:00.000Z",
    assignedTeam: "Mirzapur Public Works",
    history: [
      {
        status: "submitted",
        timestamp: "2026-03-18T08:10:00.000Z",
        note: "Citizen submitted issue with location and photo evidence.",
      },
      {
        status: "assigned",
        timestamp: "2026-03-18T12:15:00.000Z",
        note: "Automatically routed to Public Works in Mirzapur.",
      },
    ],
  },
  {
    id: "issue-seed-2",
    title: "Overflowing garbage bin near market",
    description: "Garbage has not been cleared for two days near the local market.",
    category: "garbage",
    priority: "medium",
    status: "in_progress",
    department: "Sanitation",
    location: {
      lat: 28.7041,
      lng: 77.1025,
      address: "Karol Bagh Market",
      locationName: "Delhi",
    },
    citizenId: "user-citizen-seed",
    citizenName: "Riya Sharma",
    citizenEmail: "riya@example.com",
    createdAt: "2026-03-17T09:20:00.000Z",
    updatedAt: "2026-03-18T14:45:00.000Z",
    assignedTeam: "Delhi Sanitation",
    history: [
      {
        status: "submitted",
        timestamp: "2026-03-17T09:20:00.000Z",
        note: "Citizen submitted issue from market area.",
      },
      {
        status: "acknowledged",
        timestamp: "2026-03-17T11:00:00.000Z",
        note: "Municipal control room acknowledged the issue.",
      },
      {
        status: "in_progress",
        timestamp: "2026-03-18T14:45:00.000Z",
        note: "Sanitation team dispatched.",
      },
    ],
  },
];

const seededNotifications: AppNotification[] = [
  {
    id: "notification-seed-1",
    userId: "user-citizen-seed",
    issueId: "issue-seed-1",
    title: "Issue assigned",
    message: "Your pothole report has been assigned to Mirzapur Public Works.",
    createdAt: "2026-03-18T12:15:00.000Z",
    read: false,
  },
  {
    id: "notification-seed-2",
    userId: "user-citizen-seed",
    issueId: "issue-seed-2",
    title: "Work started",
    message: "Sanitation team has started work on your garbage overflow report.",
    createdAt: "2026-03-18T14:45:00.000Z",
    read: false,
  },
];

function getStorage(storage?: StorageLike | null) {
  if (storage) {
    return storage;
  }

  if (typeof window !== "undefined") {
    return window.localStorage;
  }

  return null;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createSession(user: AppUser): AppSession {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    username: user.username,
  };
}

function readJson<T>(key: string, fallback: T, storage?: StorageLike | null) {
  const targetStorage = getStorage(storage);
  if (!targetStorage) {
    return clone(fallback);
  }

  try {
    const raw = targetStorage.getItem(key);
    if (!raw) {
      targetStorage.setItem(key, JSON.stringify(fallback));
      return clone(fallback);
    }
    return JSON.parse(raw) as T;
  } catch {
    targetStorage.setItem(key, JSON.stringify(fallback));
    return clone(fallback);
  }
}

function writeJson<T>(key: string, value: T, storage?: StorageLike | null) {
  const targetStorage = getStorage(storage);
  if (!targetStorage) {
    return;
  }

  targetStorage.setItem(key, JSON.stringify(value));
}

export function loadUsers(storage?: StorageLike | null) {
  return readJson<AppUser[]>(USER_STORAGE_KEY, seededUsers, storage);
}

export function saveUsers(users: AppUser[], storage?: StorageLike | null) {
  writeJson(USER_STORAGE_KEY, users, storage);
}

export function loadSession(storage?: StorageLike | null) {
  return readJson<AppSession | null>(SESSION_STORAGE_KEY, null, storage);
}

export function saveSession(session: AppSession, storage?: StorageLike | null) {
  writeJson(SESSION_STORAGE_KEY, session, storage);
}

export function clearSession(storage?: StorageLike | null) {
  const targetStorage = getStorage(storage);
  if (!targetStorage) {
    return;
  }
  targetStorage.removeItem(SESSION_STORAGE_KEY);
}

export function loadIssues(storage?: StorageLike | null) {
  return readJson<CivicIssue[]>(ISSUE_STORAGE_KEY, seededIssues, storage);
}

export function saveIssues(issues: CivicIssue[], storage?: StorageLike | null) {
  writeJson(ISSUE_STORAGE_KEY, issues, storage);
}

export function loadNotifications(storage?: StorageLike | null) {
  return readJson<AppNotification[]>(
    NOTIFICATION_STORAGE_KEY,
    seededNotifications,
    storage,
  );
}

export function saveNotifications(
  notifications: AppNotification[],
  storage?: StorageLike | null,
) {
  writeJson(NOTIFICATION_STORAGE_KEY, notifications, storage);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function registerCitizen(
  users: AppUser[],
  input: CitizenRegistrationInput,
) {
  if (users.some((user) => normalizeEmail(user.email) === normalizeEmail(input.email))) {
    throw new CivicAuthError("EMAIL_EXISTS", "Citizen account already exists for this email.");
  }

  const user: AppUser = {
    id: makeId("citizen"),
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    password: input.password,
    role: "CITIZEN",
    location: input.location,
    createdAt: new Date().toISOString(),
  };

  return user;
}

export function authenticateCitizen(users: AppUser[], input: CitizenLoginInput) {
  const user = users.find(
    (candidate) =>
      candidate.role === "CITIZEN" &&
      normalizeEmail(candidate.email) === normalizeEmail(input.email),
  );

  if (!user) {
    throw new CivicAuthError("EMAIL_NOT_FOUND", "Citizen account not found.");
  }

  if (user.password !== input.password) {
    throw new CivicAuthError("WRONG_PASSWORD", "Wrong password.");
  }

  return createSession(user);
}

export function authenticateAdmin(users: AppUser[], input: AdminLoginInput) {
  const user = users.find(
    (candidate) =>
      candidate.role !== "CITIZEN" &&
      normalizeUsername(candidate.username ?? "") === normalizeUsername(input.username),
  );

  if (!user) {
    throw new CivicAuthError("USERNAME_NOT_FOUND", "Admin username not found.");
  }

  if (user.password !== input.password) {
    throw new CivicAuthError("WRONG_PASSWORD", "Wrong password.");
  }

  if (user.location !== input.location) {
    throw new CivicAuthError(
      "WRONG_LOCATION",
      `${user.name} is assigned to ${user.location}.`,
    );
  }

  return createSession(user);
}

export function routeIssue(category: IssueCategory, location: LocationName) {
  const department = departmentByCategory[category];
  const priority = priorityByCategory[category];
  const assignedTeam = `${location} ${department}`;

  return {
    department,
    priority,
    assignedTeam,
  };
}

export function createIssueForCitizen(
  citizen: AppSession,
  input: IssueSubmissionInput,
) {
  const timestamp = new Date().toISOString();
  const route = routeIssue(input.category, input.locationName);

  const issue: CivicIssue = {
    id: makeId("issue"),
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    priority: route.priority,
    status: "submitted",
    department: route.department,
    assignedTeam: route.assignedTeam,
    location: {
      lat: input.lat,
      lng: input.lng,
      address: input.address.trim(),
      locationName: input.locationName,
    },
    citizenId: citizen.id,
    citizenName: citizen.name,
    citizenEmail: citizen.email,
    imageUrl: input.imageUrl,
    createdAt: timestamp,
    updatedAt: timestamp,
    history: [
      {
        status: "submitted",
        timestamp,
        note: `Issue submitted and auto-routed to ${route.department}.`,
      },
    ],
  };

  const notification: AppNotification = {
    id: makeId("notification"),
    userId: citizen.id,
    issueId: issue.id,
    title: "Issue submitted",
    message: `${issue.title} has been submitted and routed to ${route.department}.`,
    createdAt: timestamp,
    read: false,
  };

  return { issue, notification };
}

export function createStatusNotification(
  issue: CivicIssue,
  status: IssueStatus,
): AppNotification {
  return {
    id: makeId("notification"),
    userId: issue.citizenId,
    issueId: issue.id,
    title: statusLabels[status],
    message: `${issue.title} is now marked as ${statusLabels[status]}.`,
    createdAt: new Date().toISOString(),
    read: false,
  };
}

export function getAverageResolutionHours(issues: CivicIssue[]) {
  const resolved = issues.filter((issue) => issue.status === "resolved");
  if (resolved.length === 0) {
    return 0;
  }

  const totalMs = resolved.reduce((sum, issue) => {
    return sum + (new Date(issue.updatedAt).getTime() - new Date(issue.createdAt).getTime());
  }, 0);

  return totalMs / resolved.length / (1000 * 60 * 60);
}

export const demoCitizenCredentials = {
  email: "riya@example.com",
  password: "Citizen@123",
};

export const demoAdminCredentials = [
  {
    username: "superadmin",
    password: "Super@123",
    location: "Delhi",
    role: "Super Admin",
  },
  {
    username: "mirzapur.admin",
    password: "Mirza@123",
    location: "Mirzapur",
    role: "Location Admin",
  },
] as const;
