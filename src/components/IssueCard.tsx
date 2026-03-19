import { formatDistanceToNow } from "date-fns";
import { Clock3, MapPin, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  categoryIcons,
  categoryLabels,
  priorityLabels,
  statusLabels,
} from "@/lib/civic-data";
import type { CivicIssue } from "@/types/civic";

interface IssueCardProps {
  issue: CivicIssue;
  onClick?: () => void;
}

function priorityClass(priority: CivicIssue["priority"]) {
  if (priority === "critical") return "border-red-200 bg-red-50 text-red-700";
  if (priority === "high") return "border-amber-200 bg-amber-50 text-amber-700";
  if (priority === "medium") return "border-sky-200 bg-sky-50 text-sky-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function statusClass(status: CivicIssue["status"]) {
  if (status === "resolved") return "bg-emerald-100 text-emerald-700";
  if (status === "in_progress") return "bg-sky-100 text-sky-700";
  if (status === "assigned") return "bg-amber-100 text-amber-700";
  if (status === "acknowledged") return "bg-violet-100 text-violet-700";
  return "bg-muted text-muted-foreground";
}

export default function IssueCard({ issue, onClick }: IssueCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border border-border shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
      onClick={onClick}
    >
      {issue.imageUrl ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : null}

      <div className="space-y-4 p-4">
        <div className="flex items-start gap-2">
          <div className="text-2xl">{categoryIcons[issue.category]}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold">{issue.title}</p>
              <Badge variant="outline" className={priorityClass(issue.priority)}>
                {priorityLabels[issue.priority]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {categoryLabels[issue.category]}
            </p>
          </div>
        </div>

        <p className="line-clamp-3 text-sm text-muted-foreground">{issue.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={statusClass(issue.status)}>
            {statusLabels[issue.status]}
          </Badge>
          <Badge variant="outline">{issue.department}</Badge>
        </div>

        <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {issue.location.locationName}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
          </span>
          <span className="flex items-center gap-1">
            <Workflow className="h-3.5 w-3.5" />
            {issue.assignedTeam}
          </span>
        </div>
      </div>
    </Card>
  );
}
