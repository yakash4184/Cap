import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, CivicAuthError } from "@/contexts/AuthContext";
import { LOCATION_OPTIONS, type LocationName } from "@/types/civic";

export default function Signup() {
  const { registerCitizen } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState<LocationName>("Mirzapur");
  const [error, setError] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md border-white/70 bg-white/90 p-8 shadow-elevated">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Citizen registration</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your account to report civic issues and track resolution updates.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" className="mt-2" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" className="mt-2" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="mt-2" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <div>
            <Label>Default location</Label>
            <Select value={location} onValueChange={(value) => setLocation(value as LocationName)}>
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
                await registerCitizen({ name, email, password, location });
                navigate("/dashboard", { replace: true });
              } catch (signupError) {
                setError(
                  signupError instanceof CivicAuthError
                    ? signupError.message
                    : "Citizen registration failed.",
                );
              }
            }}
          >
            Create citizen account
          </Button>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
