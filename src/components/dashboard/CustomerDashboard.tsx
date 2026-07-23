/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Recycle, Clock, Award, Leaf, Truck } from "lucide-react";
import Link from "next/link";

export function CustomerDashboard({ user }: { user: Record<string, any> }) {
  const totalPickups = user.pickupRequests?.length || 0;
  const completedPickups = user.pickupRequests?.filter((p: any) => p.status === "COMPLETED" || p.status === "RECYCLING").length || 0;
  const upcomingPickups = totalPickups - completedPickups;
  
  const totalEcoPoints = user.ecoPoints?.reduce((acc: number, curr: any) => 
    curr.type === "EARNED" ? acc + curr.points : acc - curr.points, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name?.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">Here is your e-waste recycling summary.</p>
        </div>
        <Link href="/customer/dashboard/book">
          <Button className="bg-green-600 hover:bg-green-700 gap-2">
            <Plus className="h-4 w-4" /> Schedule Pickup
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pickups</CardTitle>
            <Recycle className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPickups}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Pickups</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingPickups}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EcoPoints</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEcoPoints}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest pickup requests and rewards.</CardDescription>
          </CardHeader>
          <CardContent>
            {totalPickups === 0 ? (
              <div className="text-center py-10">
                <Recycle className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No activity yet</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Schedule your first e-waste pickup to start earning EcoPoints and making an impact.
                </p>
                <Link href="/customer/dashboard/book">
                  <Button variant="outline">Schedule Pickup</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {/* We will map over actual events later, this is the layout */}
                {user.pickupRequests.slice(0, 3).map((req: any) => (
                  <div key={req.id} className="flex items-center">
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full mr-4">
                      <Truck className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">Pickup Request #{req.pickupId}</p>
                      <p className="text-sm text-slate-500">Status: {req.status}</p>
                    </div>
                    <div className="text-sm font-medium">{new Date(req.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Environmental Impact</CardTitle>
            <CardDescription>Your contribution to the planet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                <div className="mr-4 bg-green-200 dark:bg-green-800 p-2 rounded-full">
                  <Leaf className="h-5 w-5 text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">CO2 Emissions Saved</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">12.5 kg</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <div className="mr-4 bg-blue-200 dark:bg-blue-800 p-2 rounded-full">
                  <Recycle className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Toxic Waste Diverted</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">4.2 kg</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
