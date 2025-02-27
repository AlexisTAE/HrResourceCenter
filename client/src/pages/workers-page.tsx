import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Worker, InsertWorker } from "@shared/schema";
import Sidebar from "@/components/layout/sidebar";
import WorkerForm from "@/components/worker/worker-form";
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
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function WorkersPage() {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const { toast } = useToast();

  const { data: workers, isLoading } = useQuery<Worker[]>({
    queryKey: ["/api/workers"],
  });

  const createWorkerMutation = useMutation({
    mutationFn: async (worker: InsertWorker) => {
      const res = await apiRequest("POST", "/api/workers", worker);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workers"] });
      toast({ title: "Worker created successfully" });
    },
  });

  const updateWorkerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertWorker> }) => {
      const res = await apiRequest("PUT", `/api/workers/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workers"] });
      toast({ title: "Worker updated successfully" });
    },
  });

  const deleteWorkerMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/workers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workers"] });
      toast({ title: "Worker deleted successfully" });
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
          <h1 className="text-3xl font-bold">Workers</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Worker
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Worker</DialogTitle>
              </DialogHeader>
              <WorkerForm
                onSubmit={createWorkerMutation.mutate}
                supervisors={workers}
                isLoading={createWorkerMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers?.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>{worker.name} {worker.lastname}</TableCell>
                  <TableCell>{worker.department}</TableCell>
                  <TableCell>{worker.role}</TableCell>
                  <TableCell>
                    {workers.find(w => w.id === worker.supervisorId)?.name || "None"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedWorker(worker)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Worker</DialogTitle>
                        </DialogHeader>
                        <WorkerForm
                          onSubmit={(data) =>
                            updateWorkerMutation.mutate({ id: worker.id, data })
                          }
                          defaultValues={worker}
                          supervisors={workers?.filter((w) => w.id !== worker.id)}
                          isLoading={updateWorkerMutation.isPending}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWorkerMutation.mutate(worker.id)}
                      disabled={deleteWorkerMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
