"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recycle, CheckCircle, Factory, ShieldCheck, Box } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function RecyclerDashboard({ user }: { user: any }) {
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/pickups");
      if (res.ok) {
        const data = await res.json();
        // Show batches currently at the facility (RECYCLING) or COMPLETED
        const active = data.filter((p: any) => ["RECYCLING", "COMPLETED"].includes(p.status));
        setBatches(active);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const processBatch = async (id: string) => {
    try {
      const res = await fetch(`/api/pickups/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "COMPLETED", 
          notes: "E-waste successfully dismantled and processed. Certificate generated. EcoPoints awarded." 
        })
      });
      if (res.ok) {
        toast.success("Batch processed successfully! Points awarded to user.");
        fetchBatches();
      } else {
        toast.error("Failed to process batch");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const activeBatches = batches.filter(b => b.status === "RECYCLING");
  const completedBatches = batches.filter(b => b.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recycling Facility Portal</h1>
          <p className="text-muted-foreground">Process incoming e-waste and issue digital certificates.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incoming Batches</CardTitle>
            <Factory className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBatches.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed Today</CardTitle>
            <Recycle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBatches.length}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">Lifetime total</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Pending Processing Queue</h2>
      
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading batches...</div>
      ) : activeBatches.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border rounded-lg">
          <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Processing Queue Empty</h3>
          <p className="text-sm text-slate-500 mt-1">All incoming batches have been processed.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-1">
          {activeBatches.map(batch => (
            <Card key={batch.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6">
              <div className="space-y-1 mb-4 sm:mb-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{batch.pickupId}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                    Received at Facility
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Box className="h-4 w-4" />
                    {batch.items.length} items
                  </span>
                  <span>
                    Est. Weight: {batch.items.reduce((acc: number, item: any) => acc + item.estimatedWeight, 0)} kg
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => toast.info("Viewing manifest...")}>
                  View Manifest
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 gap-2"
                  onClick={() => processBatch(batch.id)}
                >
                  <Recycle className="h-4 w-4" /> Process & Issue Certificate
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
