import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    const { trackingId } = await params;
    const pickupId = trackingId.toUpperCase();

    const request = await prisma.pickupRequest.findUnique({
      where: {
        pickupId: pickupId
      },
      select: {
        pickupId: true,
        status: true,
        scheduledDate: true,
        events: {
          orderBy: {
            timestamp: 'asc'
          }
        },
        items: {
          include: {
            category: true
          }
        }
      }
    });

    if (!request) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // Do not return user personal info in public track API!

    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
