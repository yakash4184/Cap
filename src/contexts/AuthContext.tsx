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
  CivicAuthError,
  authenticateAdmin,
  authenticateCitizen,
  clearSession,
  loadSession,
  loadUsers,
  registerCitizen,
  saveSession,
  saveUsers,
} from "@/lib/civic-data";
import type {
  AdminLoginInput,
  AppRole,
  AppSession,
  AppUser,
  CitizenLoginInput,
  CitizenRegistrationInput,
} from "@/types/civic";

interface AuthContextType {
  users: AppUser[];
  currentUser: AppSession | null;
  loading: boolean;
  loginCitizen: (input: CitizenLoginInput) => Promise<void>;
  loginAdmin: (input: AdminLoginInput) => Promise<void>;
  registerCitizen: (input: CitizenRegistrationInput) => Promise<void>;
  logout: () => void;
  hasRole: (roles: AppRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AppSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers(loadUsers());
    setCurrentUser(loadSession());
    setLoading(false);
  }, []);

  useEffect(() => {
    function syncFromStorage(event: StorageEvent) {
      if (!event.key) {
        return;
      }

      if (event.key === "civic-pulse.users") {
        setUsers(loadUsers());
      }

      if (event.key === "civic-pulse.session") {
        setCurrentUser(loadSession());
      }
    }

    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  const syncUsers = useCallback((nextUsers: AppUser[]) => {
    setUsers(nextUsers);
    saveUsers(nextUsers);
  }, []);

  const loginCitizenHandler = useCallback(
    async (input: CitizenLoginInput) => {
      const session = authenticateCitizen(users, input);
      setCurrentUser(session);
      saveSession(session);
    },
    [users],
  );

  const loginAdminHandler = useCallback(
    async (input: AdminLoginInput) => {
      const session = authenticateAdmin(users, input);
      setCurrentUser(session);
      saveSession(session);
    },
    [users],
  );

  const registerCitizenHandler = useCallback(
    async (input: CitizenRegistrationInput) => {
      const user = registerCitizen(users, input);
      const nextUsers = [...users, user];
      syncUsers(nextUsers);

      const session: AppSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      };

      setCurrentUser(session);
      saveSession(session);
    },
    [syncUsers, users],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    clearSession();
  }, []);

  const hasRole = useCallback(
    (roles: AppRole[]) => {
      return currentUser ? roles.includes(currentUser.role) : false;
    },
    [currentUser],
  );

  const value = useMemo<AuthContextType>(
    () => ({
      users,
      currentUser,
      loading,
      loginCitizen: loginCitizenHandler,
      loginAdmin: loginAdminHandler,
      registerCitizen: registerCitizenHandler,
      logout,
      hasRole,
    }),
    [
      currentUser,
      hasRole,
      loading,
      loginAdminHandler,
      loginCitizenHandler,
      logout,
      registerCitizenHandler,
      users,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

export { CivicAuthError };
