import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Package, Truck, Clock } from "lucide-react";
import Link from "next/link";

export default async function CustomerPickupsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");

  const pickups = await prisma.pickupRequest.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { category: true }
      },
      assignment: {
        include: { collector: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PICKUP_REQUESTED": return "bg-blue-100 text-blue-800";
      case "PICKUP_ACCEPTED": return "bg-yellow-100 text-yellow-800";
      case "PICKUP_SCHEDULED": return "bg-purple-100 text-purple-800";
      case "COLLECTED": 
      case "RECYCLED":
      case "COMPLETED": return "bg-green-100 text-green-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Pickups</h1>
          <p className="text-muted-foreground">Track and manage your e-waste collections.</p>
        </div>
        <Link href="/customer/dashboard/book">
          <Button className="bg-green-600 hover:bg-green-700">Schedule New</Button>
        </Link>
      </div>

      {pickups.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No pickups found</h3>
            <p className="text-slate-500 mb-6">You haven't scheduled any e-waste pickups yet.</p>
            <Link href="/customer/dashboard/book">
              <Button>Schedule your first pickup</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pickups.map((pickup) => (
            <Card key={pickup.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:w-1/3 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Pickup ID</p>
                      <p className="font-mono font-medium">{pickup.pickupId}</p>
                    </div>
                    <Badge className={getStatusColor(pickup.status)} variant="outline">
                      {pickup.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mt-6">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Requested: {new Date(pickup.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {pickup.scheduledDate && (
                      <div className="flex items-center text-sm font-medium text-slate-900 dark:text-white">
                        <Clock className="h-4 w-4 mr-2 text-green-600" />
                        <span>Scheduled: {new Date(pickup.scheduledDate).toLocaleDateString()} {pickup.scheduledTime}</span>
                      </div>
                    )}
                    
                    {pickup.assignment?.collector && (
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <Truck className="h-4 w-4 mr-2" />
                        <span>Collector: {pickup.assignment.collector.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium mb-3">Items</h4>
                    <ul className="space-y-2 mb-6">
                      {pickup.items.map(item => (
                        <li key={item.id} className="flex justify-between text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                          <span className="font-medium">{item.category.name} <span className="text-slate-500 font-normal">({item.deviceType || "General"})</span></span>
                          <span className="text-slate-600">Qty: {item.quantity} | {item.estimatedWeight} kg</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-4">
                    <Link href={`/customer/dashboard/pickups/${pickup.id}`}>
                      <Button variant="outline">View Details & Tracking</Button>
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
