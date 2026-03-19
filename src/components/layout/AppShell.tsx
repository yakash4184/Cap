import type { ReactNode } from "react";
import { Building2, LogOut, MapPinned, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface AppShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function AppShell({ title, description, children }: AppShellProps) {
  const { currentAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentAdmin) {
    return null;
  }

  const navItems =
    currentAdmin.role === "SUPER_ADMIN"
      ? [{ to: "/super-admin", label: "Manage Admins" }]
      : [{ to: "/location-admin", label: "Location Dashboard" }];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,hsl(170_45%_12%),hsl(170_32%_16%)_18%,hsl(150_10%_97%)_18%,hsl(150_10%_97%)_100%)]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 text-white lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure admin workspace
            </div>
            <h1 className="text-3xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
              {description}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="bg-white/15 text-white hover:bg-white/15">
                {currentAdmin.role === "SUPER_ADMIN" ? "Super Admin" : "Location Admin"}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white">
                <MapPinned className="mr-1 h-3.5 w-3.5" />
                {currentAdmin.location}
              </Badge>
              <Badge variant="outline" className="border-white/20 text-white">
                <Building2 className="mr-1 h-3.5 w-3.5" />
                {currentAdmin.username}
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  asChild
                  variant={location.pathname === item.to ? "secondary" : "ghost"}
                  className={
                    location.pathname === item.to
                      ? "bg-white text-primary hover:bg-white/90"
                      : "text-white hover:bg-white/15 hover:text-white"
                  }
                >
                  <Link to={item.to}>{item.label}</Link>
                </Button>
              ))}

              <Button
                variant="ghost"
                className="text-white hover:bg-white/15 hover:text-white"
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
