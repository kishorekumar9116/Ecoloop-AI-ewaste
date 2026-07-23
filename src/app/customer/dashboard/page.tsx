import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CustomerDashboard } from "@/components/dashboard/CustomerDashboard";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function CustomerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "CUSTOMER") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      pickupRequests: true,
      ecoPoints: true,
    }
  });

  if (!user) {
    redirect("/login");
  }

  return <CustomerDashboard user={user} />;
}
