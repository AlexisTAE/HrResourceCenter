import { useQuery, useMutation } from "@tanstack/react-query";
import { Worker, Permit, InsertPermit } from "@shared/schema";
import Sidebar from "@/components/layout/sidebar";
import PermitForm from "@/components/permit/permit-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function PermitsPage() {
  const { toast } = useToast();

  const { data: workers } = useQuery<Worker[]>({
    queryKey: ["/api/workers"],
  });

  const { data: permits, isLoading } = useQuery<Permit[]>({
    queryKey: ["/api/permits"],
  });

  const createPermitMutation = useMutation({
    mutationFn: async (permit: InsertPermit) => {
      const res = await apiRequest("POST", "/api/permits", permit);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/permits"] });
      toast({ title: "Permit request submitted successfully" });
    },
  });

  const updatePermitMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/permits/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/permits"] });
      toast({ title: "Permit status updated successfully" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Permit Requests</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Permit Request</DialogTitle>
              </DialogHeader>
              <PermitForm
                onSubmit={createPermitMutation.mutate}
                workers={workers || []}
                isLoading={createPermitMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permits?.map((permit) => {
                const worker = workers?.find((w) => w.id === permit.workerId);
                return (
                  <TableRow key={permit.id}>
                    <TableCell>
                      {worker?.name} {worker?.lastname}
                    </TableCell>
                    <TableCell className="capitalize">{permit.permitType}</TableCell>
                    <TableCell>
                      {format(new Date(permit.startDate), "MMM d, yyyy")} -{" "}
                      {format(new Date(permit.endDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {permit.reason}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          permit.status === "approved"
                            ? "success"
                            : permit.status === "rejected"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {permit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        defaultValue={permit.status}
                        onValueChange={(value) =>
                          updatePermitMutation.mutate({
                            id: permit.id,
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approve</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
