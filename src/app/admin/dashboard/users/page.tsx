import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users as UsersIcon, MapPin, Truck, Factory, ShieldCheck, Mail, Phone } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'ADMIN': return <ShieldCheck className="h-4 w-4 text-purple-600" />;
      case 'COLLECTOR': return <Truck className="h-4 w-4 text-orange-600" />;
      case 'RECYCLER': return <Factory className="h-4 w-4 text-teal-600" />;
      default: return <UsersIcon className="h-4 w-4 text-blue-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'ADMIN': return "bg-purple-100 text-purple-800";
      case 'COLLECTOR': return "bg-orange-100 text-orange-800";
      case 'RECYCLER': return "bg-teal-100 text-teal-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage customers, collectors, and recyclers.</p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800">Add New User</Button>
      </div>

      <div className="grid gap-4">
        {users.map(u => (
          <Card key={u.id}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${getRoleColor(u.role).split(' ')[0]}`}>
                    {getRoleIcon(u.role)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{u.name || u.email}</h3>
                      <Badge variant="outline" className={getRoleColor(u.role)}>
                        {u.role}
                      </Badge>
                      {u.accountStatus !== "ACTIVE" && (
                        <Badge variant="destructive">{u.accountStatus}</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {u.email}
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {u.phone}
                        </div>
                      )}
                      {(u.city || u.state) && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {[u.city, u.state].filter(Boolean).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  {u.accountStatus === "ACTIVE" ? (
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Disable</Button>
                  ) : (
                    <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">Activate</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
