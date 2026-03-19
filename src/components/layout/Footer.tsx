import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold">CivicPulse</p>
            <p className="text-sm text-muted-foreground">
              Crowdsourced Civic Issue Reporting and Resolution System
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/report" className="hover:text-foreground">Report Issue</Link>
          <Link to="/dashboard" className="hover:text-foreground">Citizen Dashboard</Link>
          <Link to="/admin" className="hover:text-foreground">Admin Console</Link>
          <Link to="/map" className="hover:text-foreground">Issue Map</Link>
        </div>
      </div>
    </footer>
  );
}
