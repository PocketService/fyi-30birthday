#!/bin/sh
set -e

echo "Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma 2>&1 || echo "Migrations skipped or already applied"

echo "Starting app as nextjs user..."
exec su-exec nextjs "$@"
