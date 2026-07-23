/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recycle, CheckCircle, Factory, ShieldCheck, Box, Truck } from "lucide-react";
import Link from "next/link";

export function RecyclerDashboard({ user }: { user: Record<string, any> }) {
  const batches = user.batches || [];
  
  const incomingBatches = batches.filter((b: any) => b.status === "SENT_TO_RECYCLER");
  const processingBatches = batches.filter((b: any) => ["RECYCLER_RECEIVED", "RECYCLING_IN_PROGRESS"].includes(b.status));
  const completedBatches = batches.filter((b: any) => ["RECYCLED", "COMPLETED"].includes(b.status));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recycling Facility Portal</h1>
          <p className="text-muted-foreground">Process incoming e-waste and issue digital certificates.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incoming Batches</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incomingBatches.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting receipt</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Factory className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingBatches.length}</div>
            <p className="text-xs text-muted-foreground">Currently dismantling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBatches.length}</div>
            <p className="text-xs text-muted-foreground">Successfully recycled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBatches.length}</div>
            <p className="text-xs text-muted-foreground">Automatically generated</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-8">
        <Link href="/recycler/dashboard/incoming" className="block">
          <Card className="hover:border-blue-500 transition-colors cursor-pointer h-full border-blue-100 dark:border-blue-900/50">
            <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 pb-4">
              <Truck className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Incoming E-Waste</CardTitle>
              <CardDescription>Receive new batches from collectors.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">View Queue</Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/recycler/dashboard/processing" className="block">
          <Card className="hover:border-orange-500 transition-colors cursor-pointer h-full border-orange-100 dark:border-orange-900/50">
            <CardHeader className="bg-orange-50/50 dark:bg-orange-900/10 pb-4">
              <Factory className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Processing</CardTitle>
              <CardDescription>Manage material recovery and recycling.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50">Start Processing</Button>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/recycler/dashboard/completed" className="block">
          <Card className="hover:border-green-500 transition-colors cursor-pointer h-full border-green-100 dark:border-green-900/50">
            <CardHeader className="bg-green-50/50 dark:bg-green-900/10 pb-4">
              <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Completed</CardTitle>
              <CardDescription>View finished batches and certificates.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Button variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-50">View Records</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
