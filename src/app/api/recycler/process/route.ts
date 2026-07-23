import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "RECYCLER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const batchId = formData.get("batchId") as string;

    if (!batchId) {
      return NextResponse.json({ error: "Missing batch ID" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const batch = await tx.collectionBatch.findUnique({
        where: { id: batchId },
        include: { pickupRequest: true }
      });
      
      if (!batch) throw new Error("Batch not found");

      const userId = batch.pickupRequest.userId;

      // Update Batch Status
      await tx.collectionBatch.update({
        where: { id: batchId },
        data: { 
          status: "COMPLETED",
          completionDate: new Date()
        }
      });

      // Update Pickup Request Status
      await tx.pickupRequest.update({
        where: { id: batch.pickupRequestId },
        data: { status: "COMPLETED" }
      });

      // Update Assignment Status
      await tx.pickupAssignment.update({
        where: { pickupRequestId: batch.pickupRequestId },
        data: { status: "COMPLETED" }
      });

      // Generate Certificate
      const certId = `ECO-CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      await tx.certificate.create({
        data: {
          batchId: batchId,
          userId: userId,
          certificateId: certId,
          verifiedRecycledWeight: batch.actualWeight || 0,
        }
      });

      // Award EcoPoints (Example: 50 points per kg)
      const pointsToAward = Math.floor((batch.actualWeight || 0) * 50);
      if (pointsToAward > 0) {
        await tx.ecoPointTransaction.create({
          data: {
            userId: userId,
            points: pointsToAward,
            type: "EARNED",
            description: `Recycled ${batch.actualWeight}kg of E-Waste (Cert: ${certId})`
          }
        });
      }

      await tx.trackingEvent.create({
        data: {
          pickupRequestId: batch.pickupRequestId,
          status: "COMPLETED",
          responsibleRole: "RECYCLER",
          notes: "E-waste successfully dismantled and processed. Certificate generated. EcoPoints awarded."
        }
      });
    });

    return NextResponse.redirect(new URL("/recycler/dashboard/processing", req.url), 303);
    
  } catch (error: any) {
    console.error("Process batch error:", error);
    return NextResponse.redirect(new URL("/recycler/dashboard/processing?error=process_failed", req.url), 303);
  }
}
