# Generar clientes Prisma

pnpm exec prisma generate --schema ./prisma/db1/schema.prisma
pnpm exec prisma generate --schema ./prisma/db2/schema.prisma

# Hacer push de esquemas a las bases de datos

pnpm exec prisma db push --schema ./prisma/db1/schema.prisma --config ./prisma/db1/prisma.config.ts
pnpm exec prisma db push --schema ./prisma/db2/schema.prisma --config ./prisma/db2/prisma.config.ts
