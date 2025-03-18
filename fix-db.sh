#!/bin/bash

echo "🔄 Starting database fix..."

# Clean Prisma
rm -rf node_modules/.prisma

# Install dependencies
npm install prisma @prisma/client

# Run the fix
npx prisma migrate reset --force
npx prisma generate
npx prisma db push --accept-data-loss

echo "✅ Done! Database should be fixed."
