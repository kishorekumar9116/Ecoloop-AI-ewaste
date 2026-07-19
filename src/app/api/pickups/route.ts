import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { categoryId, quantity, estimatedWeight, address, scheduledDate, scheduledTime, images } = body;

    // Generate unique Pickup ID
    const count = await prisma.pickupRequest.count();
    const pickupId = `ECO-${new Date().getFullYear()}-${(count + 1).toString().padStart(6, '0')}`;

    // For demo purposes, if category doesn't exist, we fallback to a hardcoded one or fail gracefully
    // In a real app we'd seed the DB. Let's just create the category if it doesn't exist for the demo.
    let category = await prisma.wasteCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      category = await prisma.wasteCategory.create({
        data: {
          id: categoryId,
          name: "Electronic Device",
          basePoints: 10
        }
      });
    }

    const request = await prisma.pickupRequest.create({
      data: {
        userId: session.user.id,
        pickupId,
        address,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        status: "REQUESTED",
        items: {
          create: {
            categoryId: category.id,
            quantity,
            estimatedWeight,
            images,
          }
        },
        events: {
          create: {
            status: "REQUESTED",
            notes: "Pickup requested by user."
          }
        }
      }
    });

    return NextResponse.json({ request, message: "Pickup scheduled successfully" }, { status: 201 });
  } catch (error) {
    console.error("Pickup scheduling error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.pickupRequest.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
