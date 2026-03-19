import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BellRing, Camera, MapPinned, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import IssueCard from "@/components/IssueCard";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { useCivicData } from "@/contexts/CivicDataContext";

const highlights = [
  {
    icon: Camera,
    title: "Image evidence",
    description: "Citizens can upload issue photos directly from mobile or desktop.",
  },
  {
    icon: MapPinned,
    title: "GPS tagging",
    description: "Every report captures area context so departments reach the exact location.",
  },
  {
    icon: Route,
    title: "Auto routing",
    description: "Issues are automatically assigned to the right municipal department.",
  },
  {
    icon: BellRing,
    title: "Status alerts",
    description: "Citizens get live notifications when reports move across workflow stages.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Admins track volume, resolution performance, and location hotspots.",
  },
];

export default function Landing() {
  const { issues, analytics } = useCivicData();
  const recentIssues = issues.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(170_55%_92%),_transparent_30%),linear-gradient(180deg,hsl(150_10%_98%),hsl(150_10%_96%))]" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex rounded-full border bg-white/80 px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
              Crowdsourced Civic Issue Reporting and Resolution System
            </div>
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Report civic issues. Route them faster. Resolve them transparently.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Citizens can submit potholes, broken streetlights, garbage overflow,
              water leaks, and other city problems with image evidence and GPS. Municipal
              teams get analytics, routing, filters, and status workflows in one platform.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Start as citizen
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Admin login
                </Button>
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-4">
            <Card className="p-5 shadow-card">
              <p className="text-sm text-muted-foreground">Issues reported</p>
              <p className="mt-2 text-3xl font-bold">{analytics.totalIssues}</p>
            </Card>
            <Card className="p-5 shadow-card">
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{analytics.resolvedIssues}</p>
            </Card>
            <Card className="p-5 shadow-card">
              <p className="text-sm text-muted-foreground">Avg resolution time</p>
              <p className="mt-2 text-3xl font-bold">
                {analytics.averageResolutionHours.toFixed(1)}h
              </p>
            </Card>
            <Card className="p-5 shadow-card">
              <p className="text-sm text-muted-foreground">Most common issue</p>
              <p className="mt-2 text-2xl font-bold capitalize">{analytics.topCategory}</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {highlights.map((item) => (
            <Card key={item.title} className="p-5 shadow-card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Recent civic reports</h2>
              <p className="text-sm text-muted-foreground">
                Latest issues submitted by citizens across the city.
              </p>
            </div>
            <Link to="/map">
              <Button variant="outline" className="gap-2">
                Explore issue map
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {recentIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
