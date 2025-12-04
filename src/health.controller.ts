import { Controller, Get } from '@nestjs/common'
import { Db2Service } from './core/db2/db2.service'
import { Db1Service } from './core/db1/db1.service'

@Controller('health')
export class HealthController {
  constructor(
    private readonly db1Service: Db1Service,
    private readonly db2Service: Db2Service,
  ) {}

  @Get()
  // @Public()
  check() {
    return { status: 'OK', timestamp: new Date().toISOString() }
  }

  @Get('db1')
  // @Public()
  async checkDatabase() {
    // Verificar la conexión a la base de datos
    await this.db1Service.$queryRaw`SELECT 1`

    return {
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString(),
    }
  }

  @Get('db2')
  // @Public()
  async checkDatabase2() {
    // Verificar la conexión a la base de datos
    await this.db2Service.$queryRaw`SELECT 1`

    return {
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString(),
    }
  }
}
