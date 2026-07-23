import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Calendar } from "lucide-react";
import Link from "next/link";

export default async function AvailablePickupsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "COLLECTOR") redirect("/login");

  // Find pickups that are requested but not yet assigned
  const availablePickups = await prisma.pickupRequest.findMany({
    where: { 
      status: "PICKUP_REQUESTED",
      assignment: null 
    },
    include: {
      items: {
        include: { category: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Available Pickups</h1>
        <p className="text-muted-foreground">Find and accept new e-waste collection requests.</p>
      </div>

      {availablePickups.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No available pickups</h3>
            <p className="text-slate-500 mb-6">There are currently no new pickup requests in your area.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {availablePickups.map((pickup) => (
            <Card key={pickup.id} className="flex flex-col">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{pickup.pickupId}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5" /> 
                      {pickup.customerPrefDate ? new Date(pickup.customerPrefDate).toLocaleDateString() : "Flexible Date"}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">New Request</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 py-4">
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-slate-600 dark:text-slate-400">{pickup.city}, {pickup.state} {pickup.pincode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="font-medium">Items ({pickup.items.length})</p>
                      <div className="text-slate-600 dark:text-slate-400 space-y-1 mt-1">
                        {pickup.items.map(item => (
                          <div key={item.id} className="flex justify-between w-full">
                            <span>{item.category.name}</span>
                            <span>{item.quantity}x (~{item.estimatedWeight}kg)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <Link href={`/collector/dashboard/available/${pickup.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
                <form action="/api/collector/accept" method="POST" className="flex-1">
                  <input type="hidden" name="pickupId" value={pickup.id} />
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Accept Pickup</Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
