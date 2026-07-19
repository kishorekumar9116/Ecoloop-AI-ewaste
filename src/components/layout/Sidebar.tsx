"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  BarChart3, 
  Box, 
  Calendar, 
  Home, 
  Leaf, 
  Settings, 
  Truck, 
  Users,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "INDIVIDUAL";

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["INDIVIDUAL", "BUSINESS", "COLLECTOR", "RECYCLER", "ADMIN"],
    },
    {
      title: "My Pickups",
      href: "/dashboard/pickups",
      icon: Calendar,
      roles: ["INDIVIDUAL", "BUSINESS"],
    },
    {
      title: "Assigned Pickups",
      href: "/dashboard/tasks",
      icon: Truck,
      roles: ["COLLECTOR"],
    },
    {
      title: "Incoming Batches",
      href: "/dashboard/batches",
      icon: Box,
      roles: ["RECYCLER"],
    },
    {
      title: "Rewards",
      href: "/dashboard/rewards",
      icon: Award,
      roles: ["INDIVIDUAL", "BUSINESS"],
    },
    {
      title: "Impact Report",
      href: "/dashboard/impact",
      icon: BarChart3,
      roles: ["BUSINESS", "RECYCLER", "ADMIN"],
    },
    {
      title: "Manage Users",
      href: "/dashboard/users",
      icon: Users,
      roles: ["ADMIN"],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["INDIVIDUAL", "BUSINESS", "COLLECTOR", "RECYCLER", "ADMIN"],
    },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="hidden border-r bg-slate-50/50 dark:bg-slate-900/50 lg:block lg:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <Leaf className="h-6 w-6 text-green-600" />
            <span>EcoLoop AI</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all hover:text-green-600 dark:hover:text-green-400",
                    isActive 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" 
                      : "text-slate-600 dark:text-slate-400"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{session?.user?.name}</span>
              <span className="text-xs text-slate-500 mt-1 capitalize">{role.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
