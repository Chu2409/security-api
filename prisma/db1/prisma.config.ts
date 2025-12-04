import { defineConfig, env } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  schema: 'prisma/db1/schema.prisma',
  migrations: {
    path: 'prisma/db1/migrations',
  },
  datasource: {
    url: env('DATABASE_URL_POSTGRES'),
  },
})
