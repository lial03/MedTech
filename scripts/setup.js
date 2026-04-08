const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function run(cmd, cwd = root) {
  console.log(`\n> Running: ${cmd} in ${cwd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

try {
  // 1. Root dependencies
  run('npm install');

  // 2. Frontend
  run('npm install', path.join(root, 'frontend'));

  // 3. Backend Services
  const services = [
    'backend/gateway',
    'backend/services/asset-service',
    'backend/services/workorder-service',
    'backend/services/inventory-service'
  ];

  const schemaPath = path.join(root, 'backend/prisma/schema.prisma');
  const dbPath = `file:${path.join(root, 'backend/prisma/dev.db').replace(/\\/g, '/')}`;

  for (const service of services) {
    const servicePath = path.join(root, service);
    run('npm install', servicePath);
    
    // 1. Create .env with absolute DB path
    fs.writeFileSync(path.join(servicePath, '.env'), `DATABASE_URL="${dbPath}"\nPORT=${getPortForService(service)}\n`);

    // 2. Copy schema to service to ensure local client generation
    const localPrismaDir = path.join(servicePath, 'prisma');
    if (!fs.existsSync(localPrismaDir)) fs.mkdirSync(localPrismaDir);
    fs.copyFileSync(schemaPath, path.join(localPrismaDir, 'schema.prisma'));
    
    run('npx prisma generate', servicePath);
  }

  // 4. Database Sync & Seed
  const backendDir = path.join(root, 'backend');
  // Ensure backend also has the .env for push/seed
  fs.writeFileSync(path.join(backendDir, '.env'), `DATABASE_URL="${dbPath}"\n`);
  
  run('npx prisma db push --accept-data-loss', backendDir);
  run(`node "${path.join(root, 'backend/prisma/seed.js')}"`);

  console.log('\n✅ Fi-CMMS: Full System Setup Complete!');
} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  process.exit(1);
}

function getPortForService(service) {
  if (service.includes('gateway')) return 3000;
  if (service.includes('asset')) return 3001;
  if (service.includes('workorder')) return 3002;
  if (service.includes('inventory')) return 3003;
  return 3000;
}
