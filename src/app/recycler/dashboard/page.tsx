import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RecyclerDashboard } from "@/components/dashboard/RecyclerDashboard";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function RecyclerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "RECYCLER") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      batches: true,
    }
  });

  if (!user) {
    redirect("/login");
  }

  return <RecyclerDashboard user={user} />;
}
