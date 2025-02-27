import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import { Worker, Permit } from "@shared/schema";
import { Loader2, Users, FileText, Clock } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  
  const { data: workers, isLoading: workersLoading } = useQuery<Worker[]>({
    queryKey: ["/api/workers"],
  });

  const { data: permits, isLoading: permitsLoading } = useQuery<Permit[]>({
    queryKey: ["/api/permits"],
  });

  if (workersLoading || permitsLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  const pendingPermits = permits?.filter(p => p.status === "pending") || [];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user?.username}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Total Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{workers?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {new Set(workers?.map(w => w.department)).size}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Permits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingPermits.length}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
