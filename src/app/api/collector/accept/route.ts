import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "COLLECTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const pickupId = formData.get("pickupId") as string;

    if (!pickupId) {
      return NextResponse.json({ error: "Missing pickup ID" }, { status: 400 });
    }

    // Transaction to ensure no double-booking
    await prisma.$transaction(async (tx) => {
      const pickup = await tx.pickupRequest.findUnique({
        where: { id: pickupId },
      });

      if (!pickup || pickup.status !== "PICKUP_REQUESTED") {
        throw new Error("Pickup is no longer available");
      }

      // Update pickup status
      await tx.pickupRequest.update({
        where: { id: pickupId },
        data: { status: "PICKUP_ACCEPTED" }
      });

      // Create assignment
      await tx.pickupAssignment.create({
        data: {
          pickupRequestId: pickupId,
          collectorId: session.user.id,
          status: "PICKUP_ACCEPTED"
        }
      });

      // Log event
      await tx.trackingEvent.create({
        data: {
          pickupRequestId: pickupId,
          status: "PICKUP_ACCEPTED",
          responsibleRole: "COLLECTOR",
          notes: "Collector accepted the pickup request."
        }
      });
    });

    // We can redirect back using Next.js redirect, or return a response for the client to handle.
    // If it's a standard form submission, we can use NextResponse.redirect
    return NextResponse.redirect(new URL("/collector/dashboard/pickups", req.url), 303);
    
  } catch (error: any) {
    console.error("Accept pickup error:", error);
    return NextResponse.redirect(new URL("/collector/dashboard/available?error=unavailable", req.url), 303);
  }
}
