import { Injectable } from '@nestjs/common'
import { PrismaClient } from './generated/client'
import { PrismaMssql } from '@prisma/adapter-mssql'
import { CustomConfigService } from '../config/config.service'

@Injectable()
export class Db2Service extends PrismaClient {
  constructor(private readonly configService: CustomConfigService) {
    const sqlConfig = {
      user: configService.env.SQLSERVER_USER,
      password: configService.env.SQLSERVER_PASSWORD,
      database: configService.env.SQLSERVER_DATABASE,
      server: configService.env.SQLSERVER_HOST,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: true, // for azure
        trustServerCertificate: false, // change to true for local dev / self-signed certs
      },
    }

    const adapter = new PrismaMssql(sqlConfig)
    super({ adapter })
  }
}
