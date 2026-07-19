import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parallel fetch for dashboard stats
    const [
      totalUsers,
      totalPickups,
      completedPickups,
      totalPointsIssued
    ] = await Promise.all([
      prisma.user.count(),
      prisma.pickupRequest.count(),
      prisma.pickupRequest.count({ where: { status: "COMPLETED" } }),
      prisma.ecoPointTransaction.aggregate({
        _sum: { points: true },
        where: { type: "EARNED" }
      })
    ]);

    // Fetch recent pickups
    const recentPickups = await prisma.pickupRequest.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    return NextResponse.json({
      totalUsers,
      totalPickups,
      completedPickups,
      totalPointsIssued: totalPointsIssued._sum.points || 0,
      recentPickups
    });

  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
