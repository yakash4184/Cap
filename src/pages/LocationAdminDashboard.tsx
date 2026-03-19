import { AlertTriangle, LockKeyhole, MapPinned, ShieldCheck } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import StatCard from "@/components/StatCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function LocationAdminDashboard() {
  const { currentAdmin } = useAuth();

  if (!currentAdmin) {
    return null;
  }

  return (
    <AppShell
      title="Location Admin Dashboard"
      description="This workspace is locked to the assigned location and intentionally restricted from global admin management actions."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Logged-in Admin"
          value={currentAdmin.username}
          subtitle="Authenticated local session"
          icon={ShieldCheck}
        />
        <StatCard
          title="Assigned Location"
          value={currentAdmin.location}
          subtitle="Access is limited to this location"
          icon={MapPinned}
        />
        <StatCard
          title="Access Scope"
          value="Restricted"
          subtitle="No permission to manage other admins"
          icon={LockKeyhole}
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Location Access Summary</CardTitle>
            <CardDescription>
              This dashboard confirms the authenticated admin identity and assigned branch.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border bg-secondary/40 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Active session
              </p>
              <h2 className="mt-3 text-2xl">{currentAdmin.username}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Role: Location Admin
              </p>
              <p className="text-sm text-muted-foreground">
                Location: {currentAdmin.location}
              </p>
            </div>

            <Alert className="border-amber-500/30 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-700">Restricted access</AlertTitle>
              <AlertDescription className="text-amber-700">
                You can review only your assigned location context. Adding, editing,
                or deleting admin accounts is reserved for Super Admin.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Permission Boundaries</CardTitle>
            <CardDescription>
              Current role intentionally excludes platform-wide control.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-xl border bg-background p-4">
              Access is limited to <strong className="text-foreground">{currentAdmin.location}</strong>.
            </div>
            <div className="rounded-xl border bg-background p-4">
              You cannot create or remove admin accounts.
            </div>
            <div className="rounded-xl border bg-background p-4">
              You cannot switch to another location without valid login credentials for that location.
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
