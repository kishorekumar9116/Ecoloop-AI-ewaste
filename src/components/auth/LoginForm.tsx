"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Leaf, Loader2, User, Truck, Recycle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type Role = "CUSTOMER" | "COLLECTOR" | "RECYCLER" | "ADMIN";

const ROLES: { id: Role; title: string; description: string; icon: React.ElementType }[] = [
  { id: "CUSTOMER", title: "Customer", description: "Schedule and track your e-waste pickups", icon: User },
  { id: "COLLECTOR", title: "Collector", description: "Manage and complete e-waste collections", icon: Truck },
  { id: "RECYCLER", title: "Recycler", description: "Receive, process and recycle collected e-waste", icon: Recycle },
  { id: "ADMIN", title: "Admin", description: "Manage the EcoLoop AI ecosystem", icon: ShieldCheck },
];

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("CUSTOMER");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        role: selectedRole,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Successfully logged in");
        
        // Auto-redirect based on role is handled by middleware, 
        // but we can also push here for immediate feedback if middleware is bypassed on client transition
        switch(selectedRole) {
          case "CUSTOMER": router.push("/customer/dashboard"); break;
          case "COLLECTOR": router.push("/collector/dashboard"); break;
          case "RECYCLER": router.push("/recycler/dashboard"); break;
          case "ADMIN": router.push("/admin/dashboard"); break;
          default: router.push("/");
        }
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  const roleTitle = ROLES.find(r => r.id === selectedRole)?.title || "Customer";

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="text-center md:text-left mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Welcome to EcoLoop AI</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Smart E-Waste Collection, Tracking & Recycling</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Select Your Role</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ROLES.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ease-in-out hover:shadow-md",
                  selectedRole === role.id 
                    ? "border-green-600 bg-green-50 dark:bg-green-900/20 dark:border-green-500" 
                    : "border-slate-200 bg-white hover:border-green-200 dark:border-slate-800 dark:bg-slate-900/50"
                )}
              >
                <div className="flex flex-col h-full gap-2">
                  <div className={cn(
                    "p-2 rounded-lg w-fit",
                    selectedRole === role.id ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  )}>
                    <role.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={cn("font-semibold", selectedRole === role.id ? "text-green-700 dark:text-green-400" : "text-slate-900 dark:text-white")}>{role.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{role.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-2xl sm:border sm:shadow-lg mt-8 md:mt-0">
        <CardHeader className="space-y-2 text-center pb-8 pt-10">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/50">
              <Leaf className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Login as {roleTitle}</CardTitle>
          <CardDescription className="text-slate-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder={`${selectedRole.toLowerCase()}@ecoloop.demo`} type="email" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 font-medium">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center space-x-2 mt-4">
                <input type="checkbox" id="remember" className="rounded border-gray-300 text-green-600 focus:ring-green-600" />
                <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300">
                  Remember Me
                </label>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white mt-6" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  `Login as ${roleTitle}`
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-green-600 hover:text-green-700 font-semibold dark:text-green-400">
              Sign up as Customer
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
