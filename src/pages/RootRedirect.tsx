import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardRoute } from "@/lib/admin-auth";

export default function RootRedirect() {
  const { currentAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardRoute(currentAdmin.role)} replace />;
}
