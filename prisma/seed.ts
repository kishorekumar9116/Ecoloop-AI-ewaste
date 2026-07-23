import prisma from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Seeding database with demo data...')

  // Create waste categories
  const category1 = await prisma.wasteCategory.upsert({
    where: { name: 'Mobile Phones' },
    update: {},
    create: {
      name: 'Mobile Phones',
      description: 'Smartphones and feature phones',
      basePoints: 100,
    },
  })

  const category2 = await prisma.wasteCategory.upsert({
    where: { name: 'Laptops' },
    update: {},
    create: {
      name: 'Laptops',
      description: 'Laptops and notebooks',
      basePoints: 500,
    },
  })

  // Create users
  const passwordHash = await bcrypt.hash('demo123', 10)

  // 1. Customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer@ecoloop.demo' },
    update: { role: 'CUSTOMER' },
    create: {
      email: 'customer@ecoloop.demo',
      name: 'Demo Customer',
      password: passwordHash,
      role: 'CUSTOMER',
      phone: '1234567890',
      city: 'San Francisco',
      state: 'CA'
    },
  })

  // 2. Collector
  const collector = await prisma.user.upsert({
    where: { email: 'collector@ecoloop.demo' },
    update: { role: 'COLLECTOR' },
    create: {
      email: 'collector@ecoloop.demo',
      name: 'Demo Collector',
      password: passwordHash,
      role: 'COLLECTOR',
      phone: '9876543210',
      city: 'San Francisco',
      state: 'CA',
      serviceArea: 'San Francisco Bay Area'
    },
  })

  // 3. Recycler
  const recycler = await prisma.user.upsert({
    where: { email: 'recycler@ecoloop.demo' },
    update: { role: 'RECYCLER' },
    create: {
      email: 'recycler@ecoloop.demo',
      name: 'Demo Recycler',
      password: passwordHash,
      role: 'RECYCLER',
      phone: '5555555555',
      city: 'San Jose',
      state: 'CA',
      companyName: 'GreenTech Recycling Inc.'
    },
  })

  // 4. Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecoloop.demo' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@ecoloop.demo',
      name: 'System Admin',
      password: passwordHash,
      role: 'ADMIN'
    },
  })

  console.log('Seeding complete!')
  console.log({
    customer: customer.email,
    collector: collector.email,
    recycler: recycler.email,
    admin: admin.email
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
