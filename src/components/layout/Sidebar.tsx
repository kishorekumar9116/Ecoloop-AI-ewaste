"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Home, 
  Leaf, 
  Settings, 
  Truck, 
  Users,
  Award,
  Calendar,
  Box,
  MapPin,
  CheckCircle,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "CUSTOMER";
  const prefix = `/${role.toLowerCase()}/dashboard`;

  const navItems = [
    {
      title: "Dashboard",
      href: prefix,
      icon: Home,
      roles: ["CUSTOMER", "COLLECTOR", "RECYCLER", "ADMIN"],
    },
    // CUSTOMER ITEMS
    {
      title: "Schedule Pickup",
      href: `${prefix}/book`,
      icon: Truck,
      roles: ["CUSTOMER"],
    },
    {
      title: "My Pickups",
      href: `${prefix}/pickups`,
      icon: Calendar,
      roles: ["CUSTOMER"],
    },
    {
      title: "Certificates",
      href: `${prefix}/certificates`,
      icon: FileText,
      roles: ["CUSTOMER"],
    },
    {
      title: "Rewards",
      href: `${prefix}/rewards`,
      icon: Award,
      roles: ["CUSTOMER"],
    },
    
    // COLLECTOR ITEMS
    {
      title: "Available Pickups",
      href: `${prefix}/available`,
      icon: Box,
      roles: ["COLLECTOR"],
    },
    {
      title: "My Pickups",
      href: `${prefix}/pickups`,
      icon: Calendar,
      roles: ["COLLECTOR"],
    },
    {
      title: "Today's Route",
      href: `${prefix}/route`,
      icon: MapPin,
      roles: ["COLLECTOR"],
    },

    // RECYCLER ITEMS
    {
      title: "Incoming E-Waste",
      href: `${prefix}/incoming`,
      icon: Truck,
      roles: ["RECYCLER"],
    },
    {
      title: "Processing",
      href: `${prefix}/processing`,
      icon: Box,
      roles: ["RECYCLER"],
    },
    {
      title: "Completed",
      href: `${prefix}/completed`,
      icon: CheckCircle,
      roles: ["RECYCLER"],
    },

    // ADMIN ITEMS
    {
      title: "Manage Users",
      href: `${prefix}/users`,
      icon: Users,
      roles: ["ADMIN"],
    },
    {
      title: "Manage Pickups",
      href: `${prefix}/pickups`,
      icon: Box,
      roles: ["ADMIN"],
    },

    // COMMON
    {
      title: "Settings",
      href: `${prefix}/settings`,
      icon: Settings,
      roles: ["CUSTOMER", "COLLECTOR", "RECYCLER", "ADMIN"],
    },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="hidden border-r bg-slate-50/50 dark:bg-slate-900/50 lg:block lg:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <Leaf className="h-6 w-6 text-green-600" />
            <span>E-CoLink</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-1">
            {filteredNavItems.map((item) => {
              // Exact match or prefix match for active state
              const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== prefix);
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
              <span className="text-xs text-slate-500 mt-1 uppercase">{role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
