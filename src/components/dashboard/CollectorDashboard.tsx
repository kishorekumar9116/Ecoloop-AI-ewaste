/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, CheckCircle, Package, Box } from "lucide-react";
import Link from "next/link";

export function CollectorDashboard({ user }: { user: Record<string, any> }) {
  const assignments = user.collectorAssignments || [];
  const activePickups = assignments.filter((a: any) => ["PICKUP_ACCEPTED", "PICKUP_SCHEDULED", "COLLECTOR_ON_THE_WAY", "COLLECTOR_ARRIVED"].includes(a.status));
  const completedPickups = assignments.filter((a: any) => ["COLLECTED", "AT_COLLECTION_CENTER"].includes(a.status));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collector Dashboard</h1>
          <p className="text-muted-foreground">Manage your assigned pickups and daily routes.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/collector/dashboard/available">
            <Button variant="outline" className="gap-2">
              <Box className="h-4 w-4" /> Available Pickups
            </Button>
          </Link>
          <Link href="/collector/dashboard/pickups">
            <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
              <Truck className="h-4 w-4" /> My Pickups
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pickups</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePickups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Collections</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPickups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pickups</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Today&apos;s Active Pickups</h2>
      
      {activePickups.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border rounded-lg">
          <Truck className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No active pickups</h3>
          <p className="text-sm text-slate-500 mt-1">You are all caught up! Check available pickups to find more.</p>
          <Link href="/collector/dashboard/available">
            <Button className="mt-4 bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700">Find Pickups</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activePickups.map((assignment: any) => {
            const pickup = assignment.pickupRequest;
            return (
              <Card key={pickup.id} className="flex flex-col border-orange-100 dark:border-orange-900/50">
                <CardHeader className="pb-3 bg-orange-50/50 dark:bg-orange-900/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{pickup.pickupId}</CardTitle>
                      <CardDescription>
                        {pickup.scheduledDate ? new Date(pickup.scheduledDate).toLocaleDateString() : "No date scheduled"}
                      </CardDescription>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
                      {pickup.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 py-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{pickup.address}, {pickup.city}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Link href={`/collector/dashboard/pickups/${pickup.id}`}>
                    <Button size="sm" variant="outline">Manage Pickup</Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
