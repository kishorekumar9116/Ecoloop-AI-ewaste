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
        where: { id: batchId }
      });
      
      if (!batch) throw new Error("Batch not found");

      await tx.collectionBatch.update({
        where: { id: batchId },
        data: { 
          status: "RECYCLER_RECEIVED",
          receivedDate: new Date()
        }
      });

      await tx.pickupRequest.update({
        where: { id: batch.pickupRequestId },
        data: { status: "RECYCLING_IN_PROGRESS" }
      });

      await tx.trackingEvent.create({
        data: {
          pickupRequestId: batch.pickupRequestId,
          status: "RECYCLER_RECEIVED",
          responsibleRole: "RECYCLER",
          notes: "Batch formally received by the recycling facility."
        }
      });
    });

    return NextResponse.redirect(new URL("/recycler/dashboard/incoming", req.url), 303);
    
  } catch (error) {
    console.error("Receive batch error:", error);
    return NextResponse.redirect(new URL("/recycler/dashboard/incoming?error=receive_failed", req.url), 303);
  }
}
