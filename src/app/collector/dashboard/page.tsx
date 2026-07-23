import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CollectorDashboard } from "@/components/dashboard/CollectorDashboard";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function CollectorDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "COLLECTOR") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      collectorAssignments: {
        include: {
          pickupRequest: true
        }
      },
    }
  });

  if (!user) {
    redirect("/login");
  }

  return <CollectorDashboard user={user} />;
}
