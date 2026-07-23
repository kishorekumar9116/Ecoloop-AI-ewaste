import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Factory, Cog, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function RecyclerProcessingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "RECYCLER") redirect("/login");

  const processingBatches = await prisma.collectionBatch.findMany({
    where: { 
      recyclerId: session.user.id,
      status: { in: ["RECYCLER_RECEIVED", "RECYCLING_IN_PROGRESS"] }
    },
    include: {
      pickupRequest: {
        include: {
          items: {
            include: { category: true }
          },
          user: true
        }
      }
    },
    orderBy: { receivedDate: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Processing Queue</h1>
        <p className="text-muted-foreground">Manage active recycling jobs and issue certificates.</p>
      </div>

      {processingBatches.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Queue is clear</h3>
            <p className="text-slate-500 mb-6">You have no batches currently awaiting processing.</p>
            <Link href="/recycler/dashboard/incoming">
              <Button>Check Incoming</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {processingBatches.map((batch) => (
            <Card key={batch.id} className="border-orange-100 dark:border-orange-900/50 flex flex-col">
              <CardHeader className="pb-3 bg-orange-50/50 dark:bg-orange-900/10 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{batch.batchId}</CardTitle>
                    <CardDescription className="mt-1">
                      Customer: {batch.pickupRequest.user.name || batch.pickupRequest.user.email}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400">
                    {batch.status === "RECYCLER_RECEIVED" ? "Ready for Processing" : "In Progress"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 py-4">
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Cog className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="font-medium">Materials to Recover</p>
                      <div className="text-slate-600 dark:text-slate-400 mt-1">
                        Total {batch.actualWeight} kg to process
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <form action="/api/recycler/process" method="POST">
                  <input type="hidden" name="batchId" value={batch.id} />
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">Complete & Issue Certificate</Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
