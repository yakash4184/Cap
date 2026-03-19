import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import IssueCard from "@/components/IssueCard";
import IssueMapPanel from "@/components/maps/IssueMapPanel";
import NotificationList from "@/components/notifications/NotificationList";
import { useAuth } from "@/contexts/AuthContext";
import { useCivicData } from "@/contexts/CivicDataContext";
import { statusLabels } from "@/lib/civic-data";
import type { IssueStatus } from "@/types/civic";

const statusTabs: Array<"all" | IssueStatus> = [
  "all",
  "submitted",
  "acknowledged",
  "assigned",
  "in_progress",
  "resolved",
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { getCitizenIssues, getUserNotifications, markNotificationRead } = useCivicData();
  const issues = getCitizenIssues(currentUser?.id);
  const notifications = getUserNotifications(currentUser?.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Citizen dashboard</h1>
            <p className="text-muted-foreground">
              Track your submitted reports, notifications, and map coverage.
            </p>
          </div>
          <Link to="/report">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Report a new issue
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-5 shadow-card">
            <p className="text-sm text-muted-foreground">Total reports</p>
            <p className="mt-2 text-3xl font-bold">{issues.length}</p>
          </Card>
          <Card className="p-5 shadow-card">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {issues.filter((issue) => issue.status === "resolved").length}
            </p>
          </Card>
          <Card className="p-5 shadow-card">
            <p className="text-sm text-muted-foreground">In progress</p>
            <p className="mt-2 text-3xl font-bold text-sky-600">
              {issues.filter((issue) => issue.status === "in_progress").length}
            </p>
          </Card>
          <Card className="p-5 shadow-card">
            <p className="text-sm text-muted-foreground">Unread notifications</p>
            <p className="mt-2 text-3xl font-bold text-primary">
              {notifications.filter((notification) => !notification.read).length}
            </p>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <IssueMapPanel
            issues={issues}
            title="My report map"
            description="Your submitted civic reports with location markers."
          />
          <NotificationList
            notifications={notifications}
            onMarkRead={markNotificationRead}
          />
        </div>

        <Card className="mt-8 p-6 shadow-card">
          <Tabs defaultValue="all">
            <TabsList className="mb-6 flex h-auto flex-wrap gap-2">
              {statusTabs.map((status) => (
                <TabsTrigger key={status} value={status} className="capitalize">
                  {status === "all" ? "All" : statusLabels[status]}
                </TabsTrigger>
              ))}
            </TabsList>

            {statusTabs.map((status) => {
              const filteredIssues =
                status === "all" ? issues : issues.filter((issue) => issue.status === status);

              return (
                <TabsContent key={status} value={status}>
                  {filteredIssues.length === 0 ? (
                    <div className="rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
                      No reports found in this status.
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {filteredIssues.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
