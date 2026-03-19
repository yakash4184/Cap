import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOCATIONS } from "@/lib/admin-auth";
import type { AdminFormValues, AdminLocation } from "@/types/admin";

const adminFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
  location: z.string().min(1, "Select a location."),
});

type AdminDialogFormValues = z.infer<typeof adminFormSchema>;

interface AdminFormDialogProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: AdminFormValues;
  onSubmit: (values: AdminFormValues) => void | Promise<void>;
}

const defaultValues: AdminDialogFormValues = {
  username: "",
  password: "",
  location: "",
};

export default function AdminFormDialog({
  mode,
  open,
  onOpenChange,
  initialValues,
  onSubmit,
}: AdminFormDialogProps) {
  const form = useForm<AdminDialogFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      form.reset({
        username: initialValues?.username ?? "",
        password: initialValues?.password ?? "",
        location: initialValues?.location ?? "",
      });
    }
  }, [form, initialValues, open]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit({
        username: values.username.trim(),
        password: values.password,
        location: values.location as AdminLocation,
      });
      onOpenChange(false);
      form.reset(defaultValues);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save admin details right now.";

      form.setError("root", { message });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Location Admin" : "Edit Location Admin"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new location admin account with location-restricted access."
              : "Update the username, password, or assigned location for this admin."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="mirzapur.admin" {...field} />
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
                    <Input type="password" placeholder="Enter secure password" {...field} />
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
                  <FormLabel>Assigned Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LOCATIONS.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root?.message ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "create" ? "Create admin" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
