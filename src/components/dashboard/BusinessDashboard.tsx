/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Recycle, Clock, Award, Leaf, Building, Globe } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function BusinessDashboard({ user }: { user: Record<string, any> }) {
  const [pickups, setPickups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPickups = async () => {
    try {
      const res = await fetch("/api/pickups");
      if (res.ok) {
        const data = await res.json();
        setPickups(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPickups();
  }, []);

  const calculateTotalWeight = () => {
    let total = 0;
    pickups.forEach((pickup: any) => {
      pickup.items.forEach((item: any) => {
        total += item.estimatedWeight;
      });
    });
    return total;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Corporate Dashboard</h1>
          <p className="text-muted-foreground">Manage enterprise e-waste and track your ESG impact.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => toast.info("Bulk CSV upload coming soon.")}>
            <Building className="h-4 w-4" /> Bulk Upload
          </Button>
          <Link href="/dashboard/book" passHref>
            <Button className="bg-green-600 hover:bg-green-700 gap-2">
              <Plus className="h-4 w-4" /> Request Corporate Pickup
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">ESG Impact Score</CardTitle>
            <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">A+</div>
            <p className="text-xs text-green-600 dark:text-green-500">Top 5% in your industry</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recycled</CardTitle>
            <Recycle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateTotalWeight()} kg</div>
            <p className="text-xs text-muted-foreground">E-waste processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(calculateTotalWeight() * 1.4).toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">CO₂ emissions prevented</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corporate EcoPoints</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450</div>
            <p className="text-xs text-muted-foreground">Available to redeem</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Enterprise Pickup History</h2>
      
      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading your history...</div>
      ) : pickups.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border rounded-lg shadow-sm">
          <Building className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No corporate pickups yet</h3>
          <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">
            Schedule your first enterprise pickup to safely dispose of IT assets and boost your ESG score.
          </p>
          <Link href="/dashboard/book" passHref>
            <Button className="bg-green-600 hover:bg-green-700">Schedule Pickup</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pickups.map(pickup => (
            <Card key={pickup.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{pickup.pickupId}</CardTitle>
                    <CardDescription>{new Date(pickup.createdAt).toLocaleDateString()}</CardDescription>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    pickup.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                    pickup.status === 'REQUESTED' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {pickup.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-3">
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p>Scheduled: {new Date(pickup.scheduledDate).toLocaleDateString()} at {pickup.scheduledTime}</p>
                  <p>Items: {pickup.items.length} (Approx {pickup.items.reduce((acc: number, item: any) => acc + item.estimatedWeight, 0)} kg)</p>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/track?id=${pickup.pickupId}`} className="w-full" passHref>
                  <Button variant="outline" className="w-full gap-2 text-blue-600 hover:text-blue-700">
                    <Clock className="h-4 w-4" /> Track Status
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
