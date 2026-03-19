import type {
  AdminFormValues,
  AdminLocation,
  AdminRecord,
  AdminRole,
  AdminSession,
  LoginCredentials,
} from "@/types/admin";

export const LOCATIONS = ["Mirzapur", "Delhi", "Lucknow"] as const;

export const ADMIN_STORAGE_KEY = "location-admin-management.admins";
export const SESSION_STORAGE_KEY = "location-admin-management.session";

export type AuthErrorCode =
  | "USERNAME"
  | "PASSWORD"
  | "LOCATION"
  | "DUPLICATE_USERNAME"
  | "PROTECTED_ADMIN"
  | "NOT_FOUND";

const DEFAULT_ADMINS: AdminRecord[] = [
  {
    id: "super-admin-seed",
    username: "superadmin",
    password: "Super@123",
    location: "Delhi",
    role: "SUPER_ADMIN",
    createdAt: "2026-03-19T09:00:00.000Z",
    updatedAt: "2026-03-19T09:00:00.000Z",
  },
  {
    id: "mirzapur-admin-seed",
    username: "mirzapur.admin",
    password: "Mirza@123",
    location: "Mirzapur",
    role: "LOCATION_ADMIN",
    createdAt: "2026-03-19T09:10:00.000Z",
    updatedAt: "2026-03-19T09:10:00.000Z",
  },
  {
    id: "delhi-admin-seed",
    username: "delhi.admin",
    password: "Delhi@123",
    location: "Delhi",
    role: "LOCATION_ADMIN",
    createdAt: "2026-03-19T09:20:00.000Z",
    updatedAt: "2026-03-19T09:20:00.000Z",
  },
  {
    id: "lucknow-admin-seed",
    username: "lucknow.admin",
    password: "Luck@123",
    location: "Lucknow",
    role: "LOCATION_ADMIN",
    createdAt: "2026-03-19T09:30:00.000Z",
    updatedAt: "2026-03-19T09:30:00.000Z",
  },
];

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export class AdminAuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AdminAuthError";
    this.code = code;
  }
}

function resolveStorage(storage?: StorageLike | null) {
  if (storage) {
    return storage;
  }

  if (typeof window !== "undefined") {
    return window.localStorage;
  }

  return null;
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function isLocation(value: unknown): value is AdminLocation {
  return typeof value === "string" && LOCATIONS.includes(value as AdminLocation);
}

function isRole(value: unknown): value is AdminRole {
  return value === "SUPER_ADMIN" || value === "LOCATION_ADMIN";
}

function isAdminRecord(value: unknown): value is AdminRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AdminRecord>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.username === "string" &&
    typeof candidate.password === "string" &&
    isLocation(candidate.location) &&
    isRole(candidate.role) &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

function isAdminSession(value: unknown): value is AdminSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AdminSession>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.username === "string" &&
    isLocation(candidate.location) &&
    isRole(candidate.role) &&
    typeof candidate.loginAt === "string"
  );
}

function cloneAdmins(admins: AdminRecord[]) {
  return admins.map((admin) => ({ ...admin }));
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `admin-${Math.random().toString(36).slice(2, 10)}`;
}

export function loadAdminRecords(storage?: StorageLike | null) {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) {
    return cloneAdmins(DEFAULT_ADMINS);
  }

  try {
    const raw = targetStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) {
      const seeded = cloneAdmins(DEFAULT_ADMINS);
      targetStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid admin payload");
    }

    const validAdmins = parsed.filter(isAdminRecord);
    if (validAdmins.length === 0) {
      throw new Error("No valid admins");
    }

    return cloneAdmins(validAdmins);
  } catch {
    const fallbackAdmins = cloneAdmins(DEFAULT_ADMINS);
    targetStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(fallbackAdmins));
    return fallbackAdmins;
  }
}

export function saveAdminRecords(
  admins: AdminRecord[],
  storage?: StorageLike | null,
) {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) {
    return;
  }

  targetStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admins));
}

export function loadAdminSession(storage?: StorageLike | null) {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) {
    return null;
  }

  try {
    const raw = targetStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return isAdminSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveAdminSession(
  session: AdminSession,
  storage?: StorageLike | null,
) {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) {
    return;
  }

  targetStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearAdminSession(storage?: StorageLike | null) {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) {
    return;
  }

  targetStorage.removeItem(SESSION_STORAGE_KEY);
}

export function createSessionFromAdmin(admin: AdminRecord): AdminSession {
  return {
    id: admin.id,
    username: admin.username,
    location: admin.location,
    role: admin.role,
    loginAt: new Date().toISOString(),
  };
}

export function authenticateAdmin(
  admins: AdminRecord[],
  credentials: LoginCredentials,
) {
  const matchedAdmin = admins.find(
    (admin) =>
      normalizeUsername(admin.username) === normalizeUsername(credentials.username),
  );

  if (!matchedAdmin) {
    throw new AdminAuthError("USERNAME", "No admin found with this username.");
  }

  if (matchedAdmin.password !== credentials.password) {
    throw new AdminAuthError("PASSWORD", "Wrong password for this admin account.");
  }

  if (matchedAdmin.location !== credentials.location) {
    throw new AdminAuthError(
      "LOCATION",
      `Wrong location. ${matchedAdmin.username} is assigned to ${matchedAdmin.location}.`,
    );
  }

  return createSessionFromAdmin(matchedAdmin);
}

export function usernameExists(
  admins: AdminRecord[],
  username: string,
  excludedId?: string,
) {
  const normalized = normalizeUsername(username);
  return admins.some(
    (admin) =>
      normalizeUsername(admin.username) === normalized && admin.id !== excludedId,
  );
}

export function createLocationAdminRecord(
  values: AdminFormValues,
): AdminRecord {
  const timestamp = new Date().toISOString();

  return {
    id: createId(),
    username: values.username.trim(),
    password: values.password,
    location: values.location,
    role: "LOCATION_ADMIN",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function getDashboardRoute(role: AdminRole) {
  return role === "SUPER_ADMIN" ? "/super-admin" : "/location-admin";
}

export const SAMPLE_CREDENTIALS = DEFAULT_ADMINS.map((admin) => ({
  username: admin.username,
  password: admin.password,
  location: admin.location,
  role: admin.role,
}));
