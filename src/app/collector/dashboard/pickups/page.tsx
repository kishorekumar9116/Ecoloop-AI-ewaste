import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Calendar, Truck, Clock } from "lucide-react";
import Link from "next/link";

export default async function CollectorPickupsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "COLLECTOR") redirect("/login");

  const assignments = await prisma.pickupAssignment.findMany({
    where: { collectorId: session.user.id },
    include: {
      pickupRequest: {
        include: {
          items: {
            include: { category: true }
          }
        }
      }
    },
    orderBy: { assignedAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Pickups</h1>
        <p className="text-muted-foreground">Manage your accepted collections and schedule them.</p>
      </div>

      {assignments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Truck className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No active pickups</h3>
            <p className="text-slate-500 mb-6">You haven't accepted any pickup requests yet.</p>
            <Link href="/collector/dashboard/available">
              <Button className="bg-orange-600 hover:bg-orange-700">Find Available Pickups</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments.map(({ pickupRequest: pickup, status }) => (
            <Card key={pickup.id} className="overflow-hidden border-orange-100 dark:border-orange-900/50">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:w-1/3 bg-orange-50/30 dark:bg-orange-900/10 border-r border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Pickup ID</p>
                      <p className="font-mono font-medium text-orange-900 dark:text-orange-200">{pickup.pickupId}</p>
                    </div>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800/50">
                      {pickup.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mt-6">
                    <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                      <span>{pickup.address}, {pickup.city} {pickup.pincode}</span>
                    </div>
                    
                    {pickup.scheduledDate ? (
                      <div className="flex items-center text-sm font-medium text-slate-900 dark:text-white">
                        <Clock className="h-4 w-4 mr-2 text-orange-600" />
                        <span>{new Date(pickup.scheduledDate).toLocaleDateString()} {pickup.scheduledTime}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-amber-600 dark:text-amber-500 font-medium bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md border border-amber-100 dark:border-amber-800/30">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Needs Scheduling</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium mb-3">Collection Details</h4>
                    <ul className="space-y-2 mb-6">
                      {pickup.items.map(item => (
                        <li key={item.id} className="flex justify-between text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                          <span className="font-medium">{item.category.name}</span>
                          <span className="text-slate-600">Qty: {item.quantity} | {item.estimatedWeight} kg</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap justify-end gap-3 mt-4">
                    {!pickup.scheduledDate && (
                      <Link href={`/collector/dashboard/pickups/${pickup.id}/schedule`}>
                        <Button className="bg-orange-600 hover:bg-orange-700">Schedule Collection</Button>
                      </Link>
                    )}
                    {pickup.scheduledDate && pickup.status === "PICKUP_SCHEDULED" && (
                      <form action="/api/collector/start" method="POST">
                        <input type="hidden" name="pickupId" value={pickup.id} />
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Start Pickup</Button>
                      </form>
                    )}
                    {pickup.status === "COLLECTOR_ON_THE_WAY" && (
                      <form action="/api/collector/arrive" method="POST">
                        <input type="hidden" name="pickupId" value={pickup.id} />
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Mark Arrived</Button>
                      </form>
                    )}
                    {pickup.status === "COLLECTOR_ARRIVED" && (
                      <Link href={`/collector/dashboard/pickups/${pickup.id}/verify`}>
                        <Button className="bg-green-600 hover:bg-green-700">Confirm & Verify Collection</Button>
                      </Link>
                    )}
                    <Link href={`/collector/dashboard/pickups/${pickup.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
