import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Fi-CMMS Database...');

  // 1. Assets
  const assets = [
    {
      id: 'AST-001',
      name: 'Ventilator - ICU Wing A',
      type: 'Ventilator',
      location: 'ICU - Wing A, Room 102',
      status: 'operational',
      healthScore: 92,
      lastMaintenance: new Date('2026-03-15'),
      nextMaintenance: new Date('2026-06-15'),
      serialNumber: 'VNT-2024-8821',
      manufacturer: 'Medtronic',
      model: 'Puritan Bennett 980',
      installDate: new Date('2024-01-15'),
      sensorData: JSON.stringify([92, 93, 91, 95, 94]),
    },
    {
      id: 'AST-003',
      name: 'Cardiac Monitor - CCU',
      type: 'Cardiac Monitor',
      location: 'CCU - Bed 5',
      status: 'critical',
      healthScore: 58,
      lastMaintenance: new Date('2026-03-01'),
      nextMaintenance: new Date('2026-04-01'),
      serialNumber: 'CM-2024-1122',
      manufacturer: 'Philips',
      model: 'IntelliVue MX800',
      installDate: new Date('2024-02-01'),
      sensorData: JSON.stringify([58, 55, 60, 52, 59]),
    }
  ];

  for (const asset of assets) {
    await prisma.asset.upsert({
      where: { id: asset.id },
      update: {},
      create: asset,
    });
  }

  // 2. Technicians
  const techs = [
    {
      id: 'TECH-001',
      name: 'Sarah Chen',
      email: 'sarah.chen@hospital.com',
      phone: '+254 712 345 678',
      specialization: 'Ventilators, Cardiac Monitors',
      status: 'available',
      avatar: 'SC',
    }
  ];

  for (const tech of techs) {
    await prisma.technician.upsert({
      where: { id: tech.id },
      update: {},
      create: tech,
    });
  }

  // 3. Inventory
  const inventory = [
    {
      id: 'INV-001',
      name: 'HEPA Filters',
      category: 'Filters',
      quantity: 50,
      minQuantity: 15,
      unit: 'pieces',
      location: 'Store A',
      supplier: 'MedSupply',
      lastRestocked: new Date(),
      cost: 45.5,
    }
  ];

  for (const item of inventory) {
    await prisma.inventoryItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
