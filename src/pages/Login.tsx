import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangle, LockKeyhole, MapPinned, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { AdminAuthError, SAMPLE_CREDENTIALS, getDashboardRoute } from "@/lib/admin-auth";
import type { AdminLocation } from "@/types/admin";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
  location: z.string().min(1, "Select a location."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { currentAdmin, loading, locations, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      location: "",
    },
  });

  useEffect(() => {
    if (currentAdmin) {
      navigate(getDashboardRoute(currentAdmin.role), { replace: true });
    }
  }, [currentAdmin, navigate]);

  const handleSubmit = form.handleSubmit(async (values) => {
    form.clearErrors();

    try {
      await login({
        username: values.username,
        password: values.password,
        location: values.location as AdminLocation,
      });

      const nextPath =
        typeof location.state?.from === "string"
          ? location.state.from
          : getDashboardRoute(
              SAMPLE_CREDENTIALS.find(
                (admin) => admin.username.toLowerCase() === values.username.trim().toLowerCase(),
              )?.role ?? "LOCATION_ADMIN",
            );

      navigate(nextPath, { replace: true });
    } catch (error) {
      if (error instanceof AdminAuthError) {
        if (error.code === "USERNAME") {
          form.setError("username", { message: error.message });
        } else if (error.code === "PASSWORD") {
          form.setError("password", { message: error.message });
        } else if (error.code === "LOCATION") {
          form.setError("location", { message: error.message });
        }
        return;
      }

      form.setError("root", {
        message: "Unable to sign in right now. Please retry.",
      });
    }
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_hsl(170_60%_95%),_transparent_35%),linear-gradient(160deg,hsl(150_10%_97%),hsl(0_0%_100%))] px-4 py-10">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/70 bg-white/80 shadow-elevated backdrop-blur">
          <CardHeader className="space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
                Location Based Access
              </p>
              <CardTitle className="max-w-xl text-4xl leading-tight">
                Admin Management System
              </CardTitle>
              <CardDescription className="max-w-xl text-base leading-7">
                Sign in with matching username, password, and assigned location.
                Super Admin can manage location admins. Location Admin only sees
                their restricted dashboard.
              </CardDescription>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-background/80 p-4">
                <MapPinned className="mb-3 h-5 w-5 text-primary" />
                <p className="font-semibold">3 locations</p>
                <p className="text-sm text-muted-foreground">
                  Mirzapur, Delhi, Lucknow
                </p>
              </div>
              <div className="rounded-2xl border bg-background/80 p-4">
                <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
                <p className="font-semibold">2 access roles</p>
                <p className="text-sm text-muted-foreground">
                  Super Admin and Location Admin
                </p>
              </div>
              <div className="rounded-2xl border bg-background/80 p-4">
                <LockKeyhole className="mb-3 h-5 w-5 text-primary" />
                <p className="font-semibold">Local persistence</p>
                <p className="text-sm text-muted-foreground">
                  Admin data and session stored in local storage
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-white/70 bg-white/90 shadow-elevated backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your account details and select the exact assigned location.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="superadmin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Login succeeds only when selected location matches the assigned one.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root?.message ? (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </div>
                ) : null}

                <Button type="submit" className="w-full" disabled={loading || form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Signing in..." : "Login to dashboard"}
                </Button>
              </form>
            </Form>

            <div className="rounded-2xl border bg-secondary/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <AlertTriangle className="h-4 w-4 text-accent-foreground" />
                Demo credentials
              </div>
              <div className="space-y-3">
                {SAMPLE_CREDENTIALS.map((credential) => (
                  <div
                    key={`${credential.role}-${credential.username}`}
                    className="rounded-xl border bg-background/80 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{credential.username}</p>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {credential.role === "SUPER_ADMIN" ? "Super Admin" : "Location Admin"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Password: <span className="font-medium text-foreground">{credential.password}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Location: <span className="font-medium text-foreground">{credential.location}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
