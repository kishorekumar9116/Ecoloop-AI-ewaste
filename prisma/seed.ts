import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:dev.db" });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Categories
  const categories = [
    { id: "cat_1", name: "Smartphones", basePoints: 50 },
    { id: "cat_2", name: "Laptops & Computers", basePoints: 150 },
    { id: "cat_3", name: "Televisions", basePoints: 100 },
    { id: "cat_4", name: "Batteries", basePoints: 20 },
  ];

  for (const cat of categories) {
    await prisma.wasteCategory.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        basePoints: cat.basePoints,
        description: `Recycle your ${cat.name.toLowerCase()} here.`
      }
    });
  }

  // 2. Users
  const password = await bcrypt.hash("password123", 12);

  const users = [
    { email: "user@ecoloop.ai", name: "Demo User", role: "INDIVIDUAL" },
    { email: "collector@ecoloop.ai", name: "Green Collect Inc", role: "COLLECTOR" },
    { email: "recycler@ecoloop.ai", name: "Eco Processors", role: "RECYCLER" },
    { email: "admin@ecoloop.ai", name: "System Admin", role: "ADMIN" },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        password: password,
        city: "San Francisco",
        state: "CA",
      }
    });
  }

  const demoUser = await prisma.user.findUnique({ where: { email: "user@ecoloop.ai" }});
  
  if (demoUser) {
    // 3. Pickup Requests
    const pickup = await prisma.pickupRequest.upsert({
      where: { pickupId: "ECO-2026-000001" },
      update: {},
      create: {
        pickupId: "ECO-2026-000001",
        userId: demoUser.id,
        address: "123 Green Avenue, SF, CA",
        scheduledDate: new Date(),
        scheduledTime: "Morning (9 AM - 12 PM)",
        status: "REQUESTED",
        items: {
          create: {
            categoryId: "cat_2",
            quantity: 2,
            estimatedWeight: 4.5,
            images: "demo-image-url"
          }
        },
        events: {
          create: [
            { status: "REQUESTED", notes: "Pickup requested by user." }
          ]
        }
      }
    });

    console.log(`Created pickup ${pickup.pickupId}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
