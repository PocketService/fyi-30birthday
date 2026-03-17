#!/bin/sh
set -e

echo "Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma 2>&1 || echo "Migrations skipped or already applied"

echo "Seeding activities..."
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
const fs = require('fs');
const sql = fs.readFileSync('./prisma/seed.sql', 'utf8');
p.\$executeRawUnsafe(sql).then(() => { console.log('Seed done'); p.\$disconnect(); }).catch(e => { console.log('Seed skipped:', e.message); p.\$disconnect(); });
" 2>&1 || echo "Seed skipped"

echo "Starting app as nextjs user..."
exec su-exec nextjs "$@"
