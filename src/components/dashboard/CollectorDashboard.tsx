"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, CheckCircle, Package, ExternalLink, QrCode } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function CollectorDashboard({ user }: { user: any }) {
  const [pickups, setPickups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      const res = await fetch("/api/pickups");
      if (res.ok) {
        const data = await res.json();
        // Since we are mocking assignments, for demo we'll show ALL requested/assigned/collected tasks
        // In reality, we'd filter by collectorId === user.id
        const active = data.filter((p: any) => ["REQUESTED", "ASSIGNED", "COLLECTED"].includes(p.status));
        setPickups(active);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/pickups/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, notes: `Status updated by collector to ${newStatus}` })
      });
      if (res.ok) {
        toast.success(`Pickup marked as ${newStatus}`);
        fetchPickups();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collector Dashboard</h1>
          <p className="text-muted-foreground">Manage your assigned pickups and daily routes.</p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 gap-2">
          <QrCode className="h-4 w-4" /> Scan QR Code
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pickups.filter(p => ["REQUESTED", "ASSIGNED"].includes(p.status)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pickups.filter(p => p.status === "COLLECTED").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Active Routes</h2>
      
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading pickups...</div>
      ) : pickups.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border rounded-lg">
          <Truck className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No active pickups</h3>
          <p className="text-sm text-slate-500 mt-1">You are all caught up for today!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pickups.map(pickup => (
            <Card key={pickup.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{pickup.pickupId}</CardTitle>
                    <CardDescription>
                      {new Date(pickup.scheduledDate).toLocaleDateString()} • {pickup.scheduledTime}
                    </CardDescription>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    pickup.status === 'COLLECTED' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {pickup.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-3">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{pickup.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <Package className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>
                      {pickup.items.length} items ({pickup.items.reduce((acc: number, item: any) => acc + item.estimatedWeight, 0)} kg approx)
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex gap-2">
                {["REQUESTED", "ASSIGNED"].includes(pickup.status) && (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => updateStatus(pickup.id, "COLLECTED")}
                  >
                    Mark as Collected
                  </Button>
                )}
                {pickup.status === "COLLECTED" && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => updateStatus(pickup.id, "RECYCLING")}
                  >
                    Drop-off at Facility
                  </Button>
                )}
                <Link href={`/track?id=${pickup.pickupId}`} passHref>
                  <Button variant="outline" size="icon" title="View Tracking">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
