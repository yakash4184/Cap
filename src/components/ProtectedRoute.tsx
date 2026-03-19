import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardRoute } from "@/lib/admin-auth";
import type { AdminRole } from "@/types/admin";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AdminRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { currentAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentAdmin) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(currentAdmin.role)) {
    return <Navigate to={getDashboardRoute(currentAdmin.role)} replace />;
  }

  return <>{children}</>;
}
