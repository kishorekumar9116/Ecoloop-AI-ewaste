import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold tracking-tight text-primary">EcoLoop AI</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">How it Works</Link>
          <Link href="#impact" className="transition-colors hover:text-foreground/80 text-foreground/60">Impact</Link>
          <Link href="#rewards" className="transition-colors hover:text-foreground/80 text-foreground/60">Rewards</Link>
          <Link href="/track" className="transition-colors hover:text-foreground/80 text-foreground/60">Track E-Waste</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:flex">Log in</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
