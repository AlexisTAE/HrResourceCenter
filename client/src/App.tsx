import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import WorkersPage from "@/pages/workers-page";
import OrgChartPage from "@/pages/org-chart-page";
import PermitsPage from "@/pages/permits-page";
import ProofsPage from "@/pages/proofs-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/workers" component={WorkersPage} />
      <ProtectedRoute path="/org-chart" component={OrgChartPage} />
      <ProtectedRoute path="/permits" component={PermitsPage} />
      <ProtectedRoute path="/proofs" component={ProofsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
