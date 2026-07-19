import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IndividualDashboard } from "@/components/dashboard/IndividualDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { CollectorDashboard } from "@/components/dashboard/CollectorDashboard";
import { RecyclerDashboard } from "@/components/dashboard/RecyclerDashboard";
import { BusinessDashboard } from "@/components/dashboard/BusinessDashboard";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch real user data
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

  switch (user.role) {
    case "ADMIN":
      return <AdminDashboard user={user} />;
    case "COLLECTOR":
      return <CollectorDashboard user={user} />;
    case "RECYCLER":
      return <RecyclerDashboard user={user} />;
    case "BUSINESS":
      return <BusinessDashboard user={user} />;
    case "INDIVIDUAL":
    default:
      return <IndividualDashboard user={user} />;
  }
}
