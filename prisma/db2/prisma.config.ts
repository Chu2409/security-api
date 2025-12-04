import { defineConfig, env } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  schema: 'prisma/db2/schema.prisma',
  migrations: {
    path: 'prisma/db2/migrations',
  },
  datasource: {
    url: env('DATABASE_URL_SQLSERVER'),
  },
})
