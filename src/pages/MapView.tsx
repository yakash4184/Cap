import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import IssueCard from "@/components/IssueCard";
import IssueMapPanel from "@/components/maps/IssueMapPanel";
import { useCivicData } from "@/contexts/CivicDataContext";
import { categoryLabels, statusLabels } from "@/lib/civic-data";

export default function MapView() {
  const { issues } = useCivicData();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const visibleIssues = useMemo(
    () =>
      issues.filter((issue) => {
        if (categoryFilter !== "all" && issue.category !== categoryFilter) return false;
        if (statusFilter !== "all" && issue.status !== statusFilter) return false;
        if (locationFilter !== "all" && issue.location.locationName !== locationFilter) return false;
        return true;
      }),
    [categoryFilter, issues, locationFilter, statusFilter],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Issue map and public view</h1>
            <p className="text-muted-foreground">
              Explore city-wide civic issues with category, location, and workflow filters.
            </p>
          </div>
          <Button variant="outline">Visible issues: {visibleIssues.length}</Button>
        </div>

        <Card className="mb-6 p-5 shadow-card">
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
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

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <IssueMapPanel
            issues={visibleIssues}
            title="Public issue marker map"
            description="Filtered issue markers across Mirzapur, Delhi, and Lucknow."
          />
          <div className="space-y-4">
            {visibleIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
