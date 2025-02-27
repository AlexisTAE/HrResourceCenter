import { useQuery } from "@tanstack/react-query";
import { Worker } from "@shared/schema";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";

interface DepartmentGroup {
  name: string;
  workers: Worker[];
}

export default function OrgChartPage() {
  const { data: workers, isLoading } = useQuery<Worker[]>({
    queryKey: ["/api/workers"],
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const departments = workers?.reduce<DepartmentGroup[]>((acc, worker) => {
    const department = acc.find((d) => d.name === worker.department);
    if (department) {
      department.workers.push(worker);
    } else {
      acc.push({ name: worker.department, workers: [worker] });
    }
    return acc;
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Organization Chart</h1>

        <div className="space-y-8">
          {departments?.map((department) => (
            <Card key={department.name}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5" />
                  <h2 className="text-xl font-bold">{department.name}</h2>
                </div>

                <div className="space-y-4">
                  {department.workers.map((worker) => {
                    const supervisor = workers?.find(
                      (w) => w.id === worker.supervisorId
                    );

                    return (
                      <div
                        key={worker.id}
                        className="pl-4 border-l-2 border-border"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {worker.name} {worker.lastname}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {worker.role}
                          </span>
                          {supervisor && (
                            <span className="text-sm text-muted-foreground">
                              Reports to: {supervisor.name} {supervisor.lastname}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
