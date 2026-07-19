import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, notes } = await req.json();

    const allowedStatuses = ["ASSIGNED", "COLLECTED", "RECYCLING", "COMPLETED", "CANCELLED"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Role checks
    const role = session.user.role;
    if (role === "INDIVIDUAL" && status !== "CANCELLED") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (role === "COLLECTOR" && !["ASSIGNED", "COLLECTED", "RECYCLING"].includes(status)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (role === "RECYCLER" && !["RECYCLING", "COMPLETED"].includes(status)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Get current pickup request
    const pickup = await prisma.pickupRequest.findUnique({
      where: { id },
      include: { items: { include: { category: true } } }
    });

    if (!pickup) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Update status and add tracking event transactionally
    const updated = await prisma.$transaction(async (tx) => {
      const updatedPickup = await tx.pickupRequest.update({
        where: { id },
        data: { status }
      });

      await tx.trackingEvent.create({
        data: {
          pickupRequestId: id,
          status,
          notes: notes || `Status updated to ${status} by ${role}.`,
        }
      });

      // If completed, award points
      if (status === "COMPLETED" && pickup.status !== "COMPLETED") {
        // Calculate points based on categories
        const totalPoints = pickup.items.reduce((acc, item) => {
          return acc + (item.category.basePoints * item.quantity);
        }, 0);

        if (totalPoints > 0) {
          await tx.ecoPointTransaction.create({
            data: {
              userId: pickup.userId,
              points: totalPoints,
              type: "EARNED",
              description: `Points earned for Pickup ${pickup.pickupId}`
            }
          });
        }
      }

      return updatedPickup;
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
