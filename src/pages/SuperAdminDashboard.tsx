import { useMemo, useState } from "react";
import { Building2, MapPinned, PencilLine, Plus, ShieldCheck, Trash2, Users2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import AdminFormDialog from "@/components/admin/AdminFormDialog";
import AdminTable from "@/components/admin/AdminTable";
import StatCard from "@/components/StatCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import type { AdminFormValues, AdminRecord } from "@/types/admin";

export default function SuperAdminDashboard() {
  const { admins, addLocationAdmin, updateLocationAdmin, deleteLocationAdmin } = useAuth();
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminRecord | null>(null);

  const locationAdmins = useMemo(
    () => admins.filter((admin) => admin.role === "LOCATION_ADMIN"),
    [admins],
  );

  const coveredLocations = useMemo(
    () => new Set(locationAdmins.map((admin) => admin.location)).size,
    [locationAdmins],
  );

  const openCreateDialog = () => {
    setDialogMode("create");
    setSelectedAdmin(null);
    setDialogOpen(true);
  };

  const openEditDialog = (admin: AdminRecord) => {
    setDialogMode("edit");
    setSelectedAdmin(admin);
    setDialogOpen(true);
  };

  const handleDialogSubmit = (values: AdminFormValues) => {
    if (dialogMode === "create") {
      addLocationAdmin(values);
      return;
    }

    if (!selectedAdmin) {
      return;
    }

    updateLocationAdmin(selectedAdmin.id, values);
  };

  return (
    <AppShell
      title="Super Admin Dashboard"
      description="Manage location-specific admin accounts, control access by assigned city, and keep credentials synced in local storage."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Admin Accounts"
          value={admins.length}
          subtitle="Includes the protected Super Admin account"
          icon={Users2}
        />
        <StatCard
          title="Location Admins"
          value={locationAdmins.length}
          subtitle="Accounts with restricted location-only access"
          icon={ShieldCheck}
        />
        <StatCard
          title="Covered Locations"
          value={coveredLocations}
          subtitle="Active location assignments"
          icon={MapPinned}
        />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Control Center</CardTitle>
            <CardDescription>
              Create and maintain location admin accounts from one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Building2 className="h-4 w-4" />
              <AlertTitle>Storage mode</AlertTitle>
              <AlertDescription>
                This system uses local storage as a mock backend. Closing the tab keeps
                the admin list on this browser until storage is cleared.
              </AlertDescription>
            </Alert>

            <div className="rounded-2xl border bg-secondary/40 p-5">
              <p className="text-sm font-semibold text-foreground">What Super Admin can do</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Add new location admins with username, password, and location</li>
                <li>Edit credentials and reassign admin location access</li>
                <li>Delete location admin accounts when access is no longer required</li>
              </ul>
            </div>

            <Button className="w-full" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Add new admin
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Admins</CardTitle>
              <CardDescription>
                Super Admin row is visible for audit purposes but remains protected.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AdminTable
              admins={admins}
              onEdit={openEditDialog}
              onDelete={setDeleteTarget}
            />
          </CardContent>
        </Card>
      </section>

      <AdminFormDialog
        mode={dialogMode}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValues={
          selectedAdmin
            ? {
                username: selectedAdmin.username,
                password: selectedAdmin.password,
                location: selectedAdmin.location,
              }
            : undefined
        }
        onSubmit={handleDialogSubmit}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete admin account?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  Remove <strong>{deleteTarget.username}</strong> from{" "}
                  <strong>{deleteTarget.location}</strong>. This action cannot be undone in
                  the current browser session.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (!deleteTarget) {
                  return;
                }

                deleteLocationAdmin(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
