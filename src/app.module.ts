import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { HealthController } from './health.controller'

@Module({
  imports: [CoreModule],
  controllers: [HealthController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
