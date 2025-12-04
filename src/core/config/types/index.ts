export interface IConfig {
  PORT: number
  DATABASE_URL_POSTGRES: string
  DATABASE_URL_SQLSERVER: string
  SQLSERVER_USER: string
  SQLSERVER_PASSWORD: string
  SQLSERVER_DATABASE: string
  SQLSERVER_HOST: string
  JWT_SECRET: string
}
