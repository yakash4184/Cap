export type AdminRole = "SUPER_ADMIN" | "LOCATION_ADMIN";

export type AdminLocation = "Mirzapur" | "Delhi" | "Lucknow";

export interface AdminRecord {
  id: string;
  username: string;
  password: string;
  location: AdminLocation;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  id: string;
  username: string;
  location: AdminLocation;
  role: AdminRole;
  loginAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  location: AdminLocation;
}

export interface AdminFormValues {
  username: string;
  password: string;
  location: AdminLocation;
}
