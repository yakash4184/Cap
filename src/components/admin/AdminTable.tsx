import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminRecord } from "@/types/admin";

interface AdminTableProps {
  admins: AdminRecord[];
  onEdit: (admin: AdminRecord) => void;
  onDelete: (admin: AdminRecord) => void;
}

export default function AdminTable({
  admins,
  onEdit,
  onDelete,
}: AdminTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Password</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins.map((admin) => {
          const isSuperAdmin = admin.role === "SUPER_ADMIN";

          return (
            <TableRow key={admin.id}>
              <TableCell className="font-medium">{admin.username}</TableCell>
              <TableCell>
                <Badge variant={isSuperAdmin ? "default" : "secondary"}>
                  {isSuperAdmin ? "Super Admin" : "Location Admin"}
                </Badge>
              </TableCell>
              <TableCell>{admin.location}</TableCell>
              <TableCell className="font-mono text-xs">{admin.password}</TableCell>
              <TableCell>
                {new Date(admin.updatedAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  {isSuperAdmin ? (
                    <span className="text-sm text-muted-foreground">
                      Protected account
                    </span>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => onEdit(admin)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(admin)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
