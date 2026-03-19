import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryLabels, departmentByCategory, priorityLabels, statusLabels } from "@/lib/civic-data";
import type { CivicIssue, Department, IssuePriority, IssueStatus } from "@/types/civic";

interface IssueManageDialogProps {
  issue: CivicIssue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: {
    status: IssueStatus;
    department: Department;
    priority: IssuePriority;
    resolutionProofUrl?: string;
    note?: string;
  }) => void;
}

export default function IssueManageDialog({
  issue,
  open,
  onOpenChange,
  onSave,
}: IssueManageDialogProps) {
  const [status, setStatus] = useState<IssueStatus>("submitted");
  const [department, setDepartment] = useState<Department>("Municipal Response");
  const [priority, setPriority] = useState<IssuePriority>("medium");
  const [note, setNote] = useState("");
  const [resolutionProofUrl, setResolutionProofUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!issue) {
      return;
    }

    setStatus(issue.status);
    setDepartment(issue.department);
    setPriority(issue.priority);
    setNote("");
    setResolutionProofUrl(issue.resolutionProofUrl);
  }, [issue]);

  if (!issue) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage civic issue</DialogTitle>
          <DialogDescription>
            Update status, routing, priority, and upload resolution proof.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-2xl border bg-secondary/40 p-4">
            <p className="font-semibold">{issue.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {categoryLabels[issue.category]} in {issue.location.locationName}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as IssueStatus)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <Select value={department} onValueChange={(value) => setDepartment(value as Department)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Set(Object.values(departmentByCategory).concat("Municipal Response"))).map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as IssuePriority)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Department note</Label>
            <Input
              id="note"
              placeholder="Example: Team assigned and field visit scheduled."
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolution-proof">Resolution proof image</Label>
            <Input
              id="resolution-proof"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => setResolutionProofUrl(reader.result as string);
                reader.readAsDataURL(file);
              }}
            />
            {resolutionProofUrl ? (
              <img
                src={resolutionProofUrl}
                alt="Resolution proof"
                className="max-h-48 rounded-2xl border object-cover"
              />
            ) : null}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave({
                status,
                department,
                priority,
                note,
                resolutionProofUrl,
              });
              onOpenChange(false);
            }}
          >
            Save updates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
