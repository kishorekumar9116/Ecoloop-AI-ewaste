/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Recycle, Award, Activity } from "lucide-react";
import Link from "next/link";

export function AdminDashboard({ user, stats }: { user: Record<string, any>, stats: Record<string, any> }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground">Platform analytics and recent system activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pickups</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPickups}</div>
            <p className="text-xs text-muted-foreground">Requested all time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed E-Waste</CardTitle>
            <Recycle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedPickups} batches</div>
            <p className="text-xs text-muted-foreground">Successfully recycled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EcoPoints Distributed</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPointsIssued.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Points awarded</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentPickups.length === 0 ? (
                <p className="text-sm text-slate-500">No recent activity.</p>
              ) : (
                stats.recentPickups.map((pickup: any) => (
                  <div key={pickup.id} className="flex items-center">
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full mr-4">
                      <Activity className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">Pickup {pickup.pickupId}</p>
                      <p className="text-sm text-muted-foreground">
                        {pickup.user?.name || pickup.user?.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded-full inline-block font-medium ${
                        ['RECYCLED', 'COMPLETED'].includes(pickup.status) ? 'bg-green-100 text-green-700' : 
                        pickup.status === 'PICKUP_REQUESTED' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {pickup.status.replace(/_/g, ' ')}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(pickup.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Connection</span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">AI Vision API (Gemini)</span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authentication</span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Operational</span>
            </div>
            
            <div className="mt-8 pt-4 border-t">
              <Link href="/admin/dashboard/settings" className="text-sm text-blue-600 hover:underline">
                Go to Advanced Settings &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
