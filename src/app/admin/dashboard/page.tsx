import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  const [totalUsers, totalPickups, completedPickups, ecoPointsData, recentPickups] = await Promise.all([
    prisma.user.count(),
    prisma.pickupRequest.count(),
    prisma.pickupRequest.count({
      where: { status: { in: ["RECYCLED", "COMPLETED"] } }
    }),
    prisma.ecoPointTransaction.aggregate({
      _sum: { points: true },
      where: { type: "EARNED" }
    }),
    prisma.pickupRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ]);

  const stats = {
    totalUsers,
    totalPickups,
    completedPickups,
    totalPointsIssued: ecoPointsData._sum.points || 0,
    recentPickups
  };

  return <AdminDashboard user={user} stats={stats} />;
}
