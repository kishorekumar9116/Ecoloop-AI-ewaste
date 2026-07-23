import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, ExternalLink } from "lucide-react";

export default async function RecyclerCompletedPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "RECYCLER") redirect("/login");

  const completedBatches = await prisma.collectionBatch.findMany({
    where: { 
      recyclerId: session.user.id,
      status: "COMPLETED"
    },
    include: {
      certificate: true,
      pickupRequest: {
        include: { user: true }
      }
    },
    orderBy: { completionDate: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Completed Batches</h1>
        <p className="text-muted-foreground">History of processed e-waste and issued certificates.</p>
      </div>

      {completedBatches.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No completed batches</h3>
            <p className="text-slate-500">You haven&apos;t processed any batches yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completedBatches.map((batch) => (
            <Card key={batch.id} className="border-green-100 dark:border-green-900/50 flex flex-col">
              <CardHeader className="pb-3 bg-green-50/50 dark:bg-green-900/10 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{batch.batchId}</CardTitle>
                    <CardDescription className="mt-1">
                      {batch.completionDate ? new Date(batch.completionDate).toLocaleDateString() : "Unknown"}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400">
                    Processed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 py-4">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500">Total Weight Recovered</span>
                    <span className="font-semibold">{batch.actualWeight} kg</span>
                  </div>
                  
                  {batch.certificate && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white mb-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        Certificate Issued
                      </div>
                      <p className="text-xs text-slate-500 font-mono">{batch.certificate.certificateId}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-3.5 w-3.5" /> View Record
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
