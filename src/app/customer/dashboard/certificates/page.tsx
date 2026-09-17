import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import Link from "next/link";

export default async function CustomerCertificatesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    include: {
      batch: {
        include: {
          recycler: true,
          pickupRequest: true,
        }
      }
    },
    orderBy: { issueDate: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recycling Certificates</h1>
        <p className="text-muted-foreground">View and download your official e-waste recycling certificates.</p>
      </div>

      {certificates.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No certificates yet</h3>
            <p className="text-slate-500 mb-6">Certificates will appear here once your e-waste has been successfully recycled.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden flex flex-col">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 flex flex-col items-center justify-center border-b border-green-100 dark:border-green-800/30">
                <FileText className="h-12 w-12 text-green-600 dark:text-green-500 mb-2" />
                <h3 className="font-bold text-center text-green-800 dark:text-green-300">Certificate of Recycling</h3>
                <p className="text-xs text-green-600/70 dark:text-green-400/70 font-mono mt-1">{cert.certificateId}</p>
              </div>
              <CardContent className="p-4 flex-1">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date Issued</span>
                    <span className="font-medium">{new Date(cert.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recycled Weight</span>
                    <span className="font-medium">{cert.verifiedRecycledWeight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium">{cert.wasteCategory || "Mixed E-Waste"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recycler</span>
                    <span className="font-medium">{cert.batch?.recycler?.companyName || "E-CoLink Partner"}</span>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <Button variant="outline" className="flex-1">View</Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
