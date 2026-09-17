"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-slate-50/50 dark:bg-slate-900/50 px-6">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden" />}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
           {/* Mobile sidebar content can go here */}
           <div className="p-6">
             <Link href="/" className="font-bold text-xl text-primary">E-CoLink</Link>
           </div>
        </SheetContent>
      </Sheet>
      
      <div className="w-full flex-1">
        {/* Optional Search or Breadcrumbs */}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        }>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/dashboard/settings">Profile Settings</Link>}>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
