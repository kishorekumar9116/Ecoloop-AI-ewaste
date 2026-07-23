"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { User, Bell, Shield, Paintbrush } from "lucide-react";

export function SettingsForm() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Settings</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg px-4 py-2 flex gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-4 py-2 flex gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg px-4 py-2 flex gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <Paintbrush className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg px-4 py-2 flex gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account&apos;s profile information and email address.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={session?.user?.name || ""} className="rounded-xl border-slate-200 dark:border-slate-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={session?.user?.email || ""} className="rounded-xl border-slate-200 dark:border-slate-800" />
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading} className="rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20 px-6">
                  {isLoading ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                We&apos;ll send notifications to this email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="pickup-updates" className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-semibold text-base">Pickup Status Updates</span>
                  <span className="font-normal text-slate-500 text-sm">Receive alerts when your pickup status changes.</span>
                </Label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="pickup-updates" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                  <label htmlFor="pickup-updates" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing-emails" className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-semibold text-base">Marketing Emails</span>
                  <span className="font-normal text-slate-500 text-sm">Receive emails about new features and EcoPoints rewards.</span>
                </Label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="marketing-emails" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                  <label htmlFor="marketing-emails" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end">
              <Button onClick={() => toast.success("Preferences updated")} className="rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20 px-6">
                Update preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how EcoLoop AI looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex flex-col items-center gap-2 rounded-2xl border-2 border-transparent p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500">
                  <div className="w-full h-24 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    <div className="w-4/5 h-4/5 bg-white rounded shadow-sm flex flex-col gap-2 p-2">
                      <div className="w-full h-2 bg-slate-200 rounded"></div>
                      <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <span className="font-medium text-sm">Light</span>
                </button>
                <button className="flex flex-col items-center gap-2 rounded-2xl border-2 border-green-500 bg-slate-50 dark:bg-slate-800 p-4 transition-colors">
                  <div className="w-full h-24 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
                    <div className="w-4/5 h-4/5 bg-slate-800 rounded shadow-sm flex flex-col gap-2 p-2 border border-slate-700">
                      <div className="w-full h-2 bg-slate-700 rounded"></div>
                      <div className="w-3/4 h-2 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                  <span className="font-medium text-sm text-green-600 dark:text-green-400">Dark (Active)</span>
                </button>
                <button className="flex flex-col items-center gap-2 rounded-2xl border-2 border-transparent p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500">
                  <div className="w-full h-24 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400">System Default</div>
                  </div>
                  <span className="font-medium text-sm">System</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="border-red-200 dark:border-red-900/30 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-red-50/50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20 pb-4">
              <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </CardContent>
            <CardFooter className="bg-red-50/50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-900/20 pt-4 flex justify-start">
              <Button variant="destructive" className="rounded-xl px-6 bg-red-600 hover:bg-red-700">
                Delete Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked {
          right: 0;
          border-color: #22c55e;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #22c55e;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #e2e8f0;
          transition: all 0.3s;
        }
        .toggle-label {
          width: 3rem;
          transition: all 0.3s;
        }
      `}} />
    </div>
  );
}
