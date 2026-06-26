#!/bin/sh
set -e

echo "▶ Rodando migrations Prisma..."
npx prisma migrate deploy

echo "▶ Gerando Prisma Client..."
npx prisma generate

# Seed apenas se o banco estiver vazio (idempotente)
echo "▶ Verificando seed..."
npx ts-node prisma/seed.ts || echo "Seed já aplicado ou ignorado"

echo "▶ Iniciando servidor FootKits API..."
node dist/main
