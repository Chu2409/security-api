import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import { CustomConfigService } from './core/config/config.service'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const configService = app.get(CustomConfigService)
  const port = configService.env.PORT

  // Configurar límites de body para peticiones grandes
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))
  app.use(express.text({ limit: '50mb' }))

  app.enableCors('*')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.setGlobalPrefix('api')

  await app.listen(port)

  Logger.log(`Server running on port ${port}`, 'Bootstrap')
}

void bootstrap()
