import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, CivicAuthError } from "@/contexts/AuthContext";
import { demoAdminCredentials, demoCitizenCredentials } from "@/lib/civic-data";
import { LOCATION_OPTIONS, type LocationName } from "@/types/civic";

export default function Login() {
  const { currentUser, loginAdmin, loginCitizen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = (location.state as { from?: string } | null)?.from;

  const [citizenEmail, setCitizenEmail] = useState(demoCitizenCredentials.email);
  const [citizenPassword, setCitizenPassword] = useState(demoCitizenCredentials.password);
  const [adminUsername, setAdminUsername] = useState(demoAdminCredentials[0].username);
  const [adminPassword, setAdminPassword] = useState(demoAdminCredentials[0].password);
  const [adminLocation, setAdminLocation] = useState<LocationName>(demoAdminCredentials[0].location);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    navigate(redirectPath || (currentUser.role === "CITIZEN" ? "/dashboard" : "/admin"), {
      replace: true,
    });
  }, [currentUser, navigate, redirectPath]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_hsl(170_55%_94%),_transparent_35%),linear-gradient(160deg,hsl(150_10%_97%),white)] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/70 bg-white/85 p-8 shadow-elevated backdrop-blur">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
            Unified access portal
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">
            Citizen reporting and municipal response in one login flow
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Citizens can track their own reports. Super Admin and Location Admin can
            monitor, assign, update, and resolve issues with analytics and routing.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border bg-background/90 p-4">
              <p className="font-semibold">Citizen demo</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Email: <span className="font-medium text-foreground">{demoCitizenCredentials.email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Password: <span className="font-medium text-foreground">{demoCitizenCredentials.password}</span>
              </p>
            </div>

            {demoAdminCredentials.map((credential) => (
              <div key={credential.username} className="rounded-2xl border bg-background/90 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{credential.username}</p>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {credential.role}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Password: <span className="font-medium text-foreground">{credential.password}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Location: <span className="font-medium text-foreground">{credential.location}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-white/70 bg-white/90 p-8 shadow-elevated backdrop-blur">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Citizens and admins use different credentials but the same secure portal.
          </p>

          <Tabs defaultValue="citizen" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="citizen">Citizen</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="citizen" className="mt-6 space-y-4">
              <div>
                <Label htmlFor="citizen-email">Email</Label>
                <Input
                  id="citizen-email"
                  className="mt-2"
                  value={citizenEmail}
                  onChange={(event) => setCitizenEmail(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="citizen-password">Password</Label>
                <Input
                  id="citizen-password"
                  type="password"
                  className="mt-2"
                  value={citizenPassword}
                  onChange={(event) => setCitizenPassword(event.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={async () => {
                  setError("");
                  try {
                    await loginCitizen({ email: citizenEmail, password: citizenPassword });
                  } catch (loginError) {
                    setError(
                      loginError instanceof CivicAuthError
                        ? loginError.message
                        : "Citizen login failed.",
                    );
                  }
                }}
              >
                Login as citizen
              </Button>
            </TabsContent>

            <TabsContent value="admin" className="mt-6 space-y-4">
              <div>
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  className="mt-2"
                  value={adminUsername}
                  onChange={(event) => setAdminUsername(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  className="mt-2"
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Select value={adminLocation} onValueChange={(value) => setAdminLocation(value as LocationName)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_OPTIONS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={async () => {
                  setError("");
                  try {
                    await loginAdmin({
                      username: adminUsername,
                      password: adminPassword,
                      location: adminLocation,
                    });
                  } catch (loginError) {
                    setError(
                      loginError instanceof CivicAuthError
                        ? loginError.message
                        : "Admin login failed.",
                    );
                  }
                }}
              >
                Login as admin
              </Button>
            </TabsContent>
          </Tabs>

          {error ? (
            <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <p className="mt-6 text-sm text-muted-foreground">
            New citizen?{" "}
            <Link to="/signup" className="font-medium text-primary">
              Create account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
