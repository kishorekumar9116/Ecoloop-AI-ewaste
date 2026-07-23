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

    await prisma.$transaction(async (tx) => {
      await tx.pickupRequest.update({
        where: { id: pickupId },
        data: { status: "COLLECTOR_ON_THE_WAY" }
      });

      await tx.pickupAssignment.update({
        where: { pickupRequestId: pickupId },
        data: { status: "COLLECTOR_ON_THE_WAY" }
      });

      await tx.trackingEvent.create({
        data: {
          pickupRequestId: pickupId,
          status: "COLLECTOR_ON_THE_WAY",
          responsibleRole: "COLLECTOR",
          notes: "Collector is on the way to the location."
        }
      });
    });

    return NextResponse.redirect(new URL("/collector/dashboard/pickups", req.url), 303);
    
  } catch (error) {
    console.error("Start pickup error:", error);
    return NextResponse.redirect(new URL("/collector/dashboard/pickups?error=start_failed", req.url), 303);
  }
}
