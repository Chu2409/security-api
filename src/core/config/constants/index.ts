import * as Joi from 'joi'
import { IConfig } from '../types'

export const config = (): { APP: IConfig } => ({
  APP: {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    DATABASE_URL_POSTGRES: process.env.DATABASE_URL_POSTGRES!,
    DATABASE_URL_SQLSERVER: process.env.DATABASE_URL_SQLSERVER!,
    SQLSERVER_USER: process.env.SQLSERVER_USER!,
    SQLSERVER_PASSWORD: process.env.SQLSERVER_PASSWORD!,
    SQLSERVER_DATABASE: process.env.SQLSERVER_DATABASE!,
    SQLSERVER_HOST: process.env.SQLSERVER_HOST!,
    JWT_SECRET: process.env.JWT_SECRET!,
  },
})

export const configValidationSchema = Joi.object<IConfig>({
  PORT: Joi.number().default(3000),
  DATABASE_URL_POSTGRES: Joi.string().required(),
  DATABASE_URL_SQLSERVER: Joi.string().required(),
  SQLSERVER_USER: Joi.string().required(),
  SQLSERVER_PASSWORD: Joi.string().required(),
  SQLSERVER_DATABASE: Joi.string().required(),
  SQLSERVER_HOST: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
})
