import { useMemo, useState } from "react";
import { BarChart, Bar, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import IssueManageDialog from "@/components/admin/IssueManageDialog";
import IssueMapPanel from "@/components/maps/IssueMapPanel";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { useCivicData } from "@/contexts/CivicDataContext";
import { categoryLabels, priorityLabels, statusLabels } from "@/lib/civic-data";
import type { CivicIssue, IssueCategory, IssuePriority, IssueStatus, LocationName } from "@/types/civic";
import { BarChart3, CheckCircle2, Clock3, FolderKanban } from "lucide-react";

const categoryFill = ["#0f766e", "#f59e0b", "#0ea5e9", "#ef4444", "#8b5cf6", "#22c55e"];

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { issues, analytics, updateIssue } = useCivicData();
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>(
    currentUser?.role === "LOCATION_ADMIN" ? currentUser.location : "all",
  );

  const visibleIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (currentUser?.role === "LOCATION_ADMIN" && issue.location.locationName !== currentUser.location) {
        return false;
      }
      if (statusFilter !== "all" && issue.status !== statusFilter) return false;
      if (categoryFilter !== "all" && issue.category !== categoryFilter) return false;
      if (priorityFilter !== "all" && issue.priority !== priorityFilter) return false;
      if (locationFilter !== "all" && issue.location.locationName !== locationFilter) return false;
      return true;
    });
  }, [categoryFilter, currentUser?.location, currentUser?.role, issues, locationFilter, priorityFilter, statusFilter]);

  const chartData = useMemo(
    () =>
      Object.entries(
        visibleIssues.reduce<Record<string, number>>((acc, issue) => {
          acc[issue.category] = (acc[issue.category] || 0) + 1;
          return acc;
        }, {}),
      ).map(([name, value]) => ({
        name: categoryLabels[name as IssueCategory],
        value,
      })),
    [visibleIssues],
  );

  const locationHeatmapData = useMemo(
    () =>
      Object.entries(
        visibleIssues.reduce<Record<string, number>>((acc, issue) => {
          acc[issue.location.locationName] = (acc[issue.location.locationName] || 0) + 1;
          return acc;
        }, {}),
      ).map(([location, value]) => ({ location, value })),
    [visibleIssues],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Municipal admin console</h1>
          <p className="text-muted-foreground">
            Filter reports, assign departments, update statuses, upload proof, and analyze hotspots.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="Total issues" value={visibleIssues.length} icon={FolderKanban} subtitle="Current filtered dataset" />
          <StatCard title="Resolved" value={analytics.resolvedIssues} icon={CheckCircle2} subtitle="Closed reports" />
          <StatCard title="Avg resolution" value={`${analytics.averageResolutionHours.toFixed(1)}h`} icon={Clock3} subtitle="Average across resolved issues" />
          <StatCard title="Top category" value={categoryLabels[analytics.topCategory as IssueCategory] || analytics.topCategory} icon={BarChart3} subtitle="Most reported issue type" />
        </div>

        <Card className="mt-8 p-5 shadow-card">
          <div className="grid gap-4 md:grid-cols-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {["Mirzapur", "Delhi", "Lucknow"].map((value) => (
                  <SelectItem key={value} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <IssueMapPanel
            issues={visibleIssues}
            title="Issue marker map"
            description="Marker-based overview for filtered civic reports."
          />

          <div className="grid gap-6">
            <Card className="p-5 shadow-card">
              <h3 className="mb-4 text-lg font-semibold">Category distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" innerRadius={55} outerRadius={95}>
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={categoryFill[index % categoryFill.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5 shadow-card">
              <h3 className="mb-4 text-lg font-semibold">Issue heatmap by location</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={locationHeatmapData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        <Card className="mt-8 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left">Issue</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleIssues.map((issue) => (
                  <tr key={issue.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{issue.title}</p>
                      <p className="text-xs text-muted-foreground">{issue.citizenName}</p>
                    </td>
                    <td className="px-4 py-3">{categoryLabels[issue.category]}</td>
                    <td className="px-4 py-3">{issue.location.locationName}</td>
                    <td className="px-4 py-3">{priorityLabels[issue.priority]}</td>
                    <td className="px-4 py-3">{statusLabels[issue.status]}</td>
                    <td className="px-4 py-3">{issue.department}</td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" onClick={() => setSelectedIssue(issue)}>
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <IssueManageDialog
        issue={selectedIssue}
        open={Boolean(selectedIssue)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedIssue(null);
          }
        }}
        onSave={(payload) => {
          if (!selectedIssue) return;
          updateIssue(selectedIssue.id, payload);
        }}
      />

      <Footer />
    </div>
  );
}
