import { Injectable } from '@nestjs/common'
import { PrismaClient } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { CustomConfigService } from '../config/config.service'

@Injectable()
export class Db1Service extends PrismaClient {
  constructor(private readonly configService: CustomConfigService) {
    const adapter = new PrismaPg({
      connectionString: configService.env.DATABASE_URL_POSTGRES,
    })
    super({ adapter })
  }
}
