import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Users,
  Network,
  FileText,
  FileCheck2,
  Home,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  const menuItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/workers", label: "Workers", icon: Users },
    { href: "/org-chart", label: "Organization", icon: Network },
    { href: "/permits", label: "Permits", icon: FileText },
    { href: "/proofs", label: "Proofs", icon: FileCheck2 },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">WorkforceHub</h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors",
                  location === item.href && "bg-slate-800"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <Button
          variant="ghost"
          className="w-full text-white hover:bg-slate-800"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
