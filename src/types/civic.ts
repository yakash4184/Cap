export const LOCATION_OPTIONS = ["Mirzapur", "Delhi", "Lucknow"] as const;

export type LocationName = (typeof LOCATION_OPTIONS)[number];

export type AppRole = "CITIZEN" | "SUPER_ADMIN" | "LOCATION_ADMIN";

export type IssueCategory =
  | "pothole"
  | "streetlight"
  | "garbage"
  | "water_leak"
  | "sewage"
  | "illegal_dumping";

export type IssuePriority = "low" | "medium" | "high" | "critical";

export type IssueStatus =
  | "submitted"
  | "acknowledged"
  | "assigned"
  | "in_progress"
  | "resolved";

export type Department =
  | "Public Works"
  | "Sanitation"
  | "Electricity"
  | "Water Department"
  | "Municipal Response";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AppRole;
  location: LocationName;
  username?: string;
  createdAt: string;
}

export interface AppSession {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  location: LocationName;
  username?: string;
}

export interface IssueLocation {
  lat: number;
  lng: number;
  address: string;
  locationName: LocationName;
}

export interface IssueHistoryEntry {
  status: IssueStatus;
  timestamp: string;
  note: string;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  department: Department;
  location: IssueLocation;
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  imageUrl?: string;
  resolutionProofUrl?: string;
  createdAt: string;
  updatedAt: string;
  assignedTeam: string;
  history: IssueHistoryEntry[];
}

export interface AppNotification {
  id: string;
  userId: string;
  issueId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface CitizenRegistrationInput {
  name: string;
  email: string;
  password: string;
  location: LocationName;
}

export interface CitizenLoginInput {
  email: string;
  password: string;
}

export interface AdminLoginInput {
  username: string;
  password: string;
  location: LocationName;
}

export interface IssueSubmissionInput {
  title: string;
  description: string;
  category: IssueCategory;
  address: string;
  locationName: LocationName;
  lat: number;
  lng: number;
  imageUrl?: string;
}
