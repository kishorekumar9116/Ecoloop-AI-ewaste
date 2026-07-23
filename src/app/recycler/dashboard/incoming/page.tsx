import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Calendar, Truck, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function RecyclerIncomingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "RECYCLER") redirect("/login");

  const incomingBatches = await prisma.collectionBatch.findMany({
    where: { 
      recyclerId: session.user.id,
      status: "SENT_TO_RECYCLER"
    },
    include: {
      pickupRequest: {
        include: {
          items: {
            include: { category: true }
          }
        }
      }
    },
    orderBy: { dispatchDate: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Incoming E-Waste</h1>
        <p className="text-muted-foreground">Review and accept batches sent by collectors.</p>
      </div>

      {incomingBatches.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Truck className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No incoming batches</h3>
            <p className="text-slate-500 mb-6">There are no batches currently assigned or sent to your facility.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {incomingBatches.map((batch) => (
            <Card key={batch.id} className="flex flex-col border-blue-100 dark:border-blue-900/50">
              <CardHeader className="pb-3 bg-blue-50/50 dark:bg-blue-900/10">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{batch.batchId}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5" /> 
                      Dispatched: {batch.dispatchDate ? new Date(batch.dispatchDate).toLocaleDateString() : "Unknown"}
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400">In Transit</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 py-4">
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="font-medium">Reported Contents</p>
                      <div className="text-slate-600 dark:text-slate-400 space-y-1 mt-1">
                        {batch.pickupRequest.items.map(item => (
                          <div key={item.id} className="flex justify-between w-full gap-4">
                            <span>{item.category.name}</span>
                            <span className="whitespace-nowrap">{item.quantity}x (~{item.estimatedWeight}kg)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {batch.actualWeight && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-800 mt-2">
                      <p className="text-xs text-slate-500 font-medium">Collector Verified Weight</p>
                      <p className="font-semibold">{batch.actualWeight} kg</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <Link href={`/recycler/dashboard/incoming/${batch.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">View Manifest</Button>
                </Link>
                <form action="/api/recycler/receive" method="POST" className="flex-1">
                  <input type="hidden" name="batchId" value={batch.id} />
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Confirm Receipt</Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
