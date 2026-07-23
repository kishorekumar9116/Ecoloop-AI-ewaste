import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function VerifyPickupPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "COLLECTOR") redirect("/login");

  const { id } = await params;

  const pickup = await prisma.pickupRequest.findUnique({
    where: { id: id },
    include: {
      items: {
        include: { category: true }
      }
    }
  });

  if (!pickup || pickup.status !== "COLLECTOR_ARRIVED") {
    redirect("/collector/dashboard/pickups");
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Verify Collection</h1>
        <p className="text-muted-foreground">Ask the customer for their 6-digit verification code to confirm the pickup.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Verification Code</CardTitle>
          <CardDescription>Pickup ID: {pickup.pickupId}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/collector/verify" method="POST" className="space-y-4">
            <input type="hidden" name="pickupId" value={pickup.id} />
            <div className="space-y-2">
              <Label htmlFor="code">6-Digit Code</Label>
              <Input 
                id="code" 
                name="code" 
                type="text" 
                placeholder="e.g. 123456" 
                maxLength={6}
                required
                className="text-2xl text-center tracking-widest h-14"
              />
            </div>
            
            <div className="space-y-2 mt-6">
              <Label htmlFor="actualWeight">Actual Total Weight (kg)</Label>
              <Input 
                id="actualWeight" 
                name="actualWeight" 
                type="number" 
                step="0.1" 
                placeholder="Enter verified weight" 
                required
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 mt-6">
              Verify & Complete Collection
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
