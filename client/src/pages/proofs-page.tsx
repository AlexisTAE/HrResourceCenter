import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Worker } from "@shared/schema";
import Sidebar from "@/components/layout/sidebar";
import ProofTemplate from "@/components/proof/proof-template";
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
import { Loader2, FileCheck2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProofsPage() {
  const proofRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: workers, isLoading } = useQuery<Worker[]>({
    queryKey: ["/api/workers"],
  });

  const handlePrint = async (worker: Worker) => {
    try {
      // Use browser's print functionality for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Proof of Employment - ${worker.name} ${worker.lastname}</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 800px; margin: 40px auto; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              ${proofRef.current?.innerHTML || ''}
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
      
      toast({
        title: "Proof of Employment",
        description: "Document ready for printing",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate document",
        variant: "destructive",
      });
    }
  };

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
          <h1 className="text-3xl font-bold">Proof of Employment</h1>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers?.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>{worker.name} {worker.lastname}</TableCell>
                  <TableCell>{worker.department}</TableCell>
                  <TableCell>{worker.role}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <FileCheck2 className="h-4 w-4 mr-2" />
                          Generate Proof
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Proof of Employment</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <div ref={proofRef}>
                            <ProofTemplate worker={worker} />
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button onClick={() => handlePrint(worker)}>
                              Generate PDF
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
