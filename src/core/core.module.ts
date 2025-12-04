import { Global, Module } from '@nestjs/common'
import { CustomConfigService } from './config/config.service'
import { ConfigModule } from '@nestjs/config'
import { config, configValidationSchema } from './config/constants'
import { Db1Service } from './db1/db1.service'
import { Db2Service } from './db2/db2.service'

@Global()
@Module({
  providers: [Db1Service, Db2Service, CustomConfigService],
  exports: [Db1Service, Db2Service, CustomConfigService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: configValidationSchema,
      load: [config],
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
})
export class CoreModule {}
