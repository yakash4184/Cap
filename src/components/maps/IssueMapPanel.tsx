import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryIcons, statusLabels } from "@/lib/civic-data";
import type { CivicIssue } from "@/types/civic";

interface IssueMapPanelProps {
  issues: CivicIssue[];
  title?: string;
  description?: string;
}

export default function IssueMapPanel({
  issues,
  title = "Issue Map",
  description = "Reported civic issues with location markers.",
}: IssueMapPanelProps) {
  const latitudes = issues.map((issue) => issue.location.lat);
  const longitudes = issues.map((issue) => issue.location.lng);
  const minLat = Math.min(...latitudes, 24.9);
  const maxLat = Math.max(...latitudes, 28.8);
  const minLng = Math.min(...longitudes, 77);
  const maxLng = Math.max(...longitudes, 82.9);

  return (
    <Card className="overflow-hidden shadow-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[360px] overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,_hsl(170_55%_92%),_transparent_28%),linear-gradient(160deg,hsl(198_50%_95%),hsl(150_18%_96%))]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(31,41,55,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(31,41,55,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute left-4 top-4 rounded-full border bg-white/90 px-3 py-1 text-xs font-medium text-muted-foreground">
            Simulated live map
          </div>

          {issues.map((issue) => {
            const top =
              ((maxLat - issue.location.lat) / Math.max(maxLat - minLat, 0.01)) * 78 + 10;
            const left =
              ((issue.location.lng - minLng) / Math.max(maxLng - minLng, 0.01)) * 78 + 10;

            return (
              <div
                key={issue.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${top}%`, left: `${left}%` }}
              >
                <div className="group relative">
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-lg">
                    <span className="text-lg">{categoryIcons[issue.category]}</span>
                  </button>

                  <div className="pointer-events-none absolute left-1/2 top-12 z-10 hidden w-56 -translate-x-1/2 rounded-2xl border bg-white p-3 text-left shadow-xl group-hover:block">
                    <p className="font-semibold">{issue.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{issue.location.address}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">{issue.location.locationName}</Badge>
                      <Badge variant="secondary">{statusLabels[issue.status]}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 rounded-2xl border bg-white/90 p-3">
            {issues.map((issue) => (
              <div key={issue.id} className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {issue.location.locationName}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
