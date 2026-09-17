import Link from "next/link";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold tracking-tight text-primary">E-CoLink</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Intelligent e-waste collection, tracking, and recycling platform. Making disposal simple, transparent, and environmentally responsible.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="#impact" className="hover:text-primary transition-colors">Environmental Impact</Link></li>
              <li><Link href="/track" className="hover:text-primary transition-colors">Smart Tracking</Link></li>
              <li><Link href="#rewards" className="hover:text-primary transition-colors">Rewards Program</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Solutions</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/register?type=household" className="hover:text-primary transition-colors">For Households</Link></li>
              <li><Link href="/register?type=business" className="hover:text-primary transition-colors">For Businesses</Link></li>
              <li><Link href="/register?type=collector" className="hover:text-primary transition-colors">For Collectors</Link></li>
              <li><Link href="/register?type=recycler" className="hover:text-primary transition-colors">For Recyclers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} E-CoLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
