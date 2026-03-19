import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, MapPinned, Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCivicData } from "@/contexts/CivicDataContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { getUserNotifications } = useCivicData();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const unreadNotifications = getUserNotifications(currentUser?.id).filter(
    (notification) => !notification.read,
  ).length;

  const links = currentUser?.role === "CITIZEN"
    ? [
        { to: "/", label: "Home" },
        { to: "/report", label: "Report Issue" },
        { to: "/dashboard", label: "My Reports" },
        { to: "/map", label: "Issue Map" },
      ]
    : currentUser
      ? [
          { to: "/", label: "Home" },
          { to: "/admin", label: "Admin Console" },
          { to: "/map", label: "Issue Map" },
        ]
      : [
          { to: "/", label: "Home" },
          { to: "/map", label: "Issue Map" },
          { to: "/login", label: "Login" },
          { to: "/signup", label: "Citizen Signup" },
        ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold">CivicPulse</p>
            <p className="text-xs text-muted-foreground">Crowdsourced civic response</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {currentUser ? (
            <>
              <Badge variant="outline">
                <MapPinned className="mr-1 h-3.5 w-3.5" />
                {currentUser.location}
              </Badge>
              <Badge variant={currentUser.role === "CITIZEN" ? "secondary" : "default"}>
                {currentUser.role === "CITIZEN" ? "Citizen" : "Municipal Admin"}
              </Badge>
              <div className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm text-muted-foreground">
                <Bell className="h-4 w-4 text-primary" />
                {unreadNotifications}
              </div>
              <span className="text-sm text-muted-foreground">{currentUser.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Citizen Signup</Button>
              </Link>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="mt-6 flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    location.pathname === link.to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {currentUser ? (
                <Button
                  variant="ghost"
                  className="mt-4 justify-start"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
