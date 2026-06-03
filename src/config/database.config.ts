import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

const DEFAULT_DATABASE_PORT = 5432;

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  logging: boolean;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  database: DatabaseConfig;
  typeOrm: TypeOrmModuleOptions;
}

function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
}

function parsePort(value: string | undefined): number {
  if (!value) {
    return DEFAULT_DATABASE_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`DATABASE_PORT must be a valid TCP port`);
  }

  return port;
}

function parseBoolean(value: string | undefined): boolean {
  return value === 'true';
}

function getDatabaseConfig(): DatabaseConfig {
  return {
    host: readRequiredEnv('DATABASE_HOST'),
    port: parsePort(process.env.DATABASE_PORT),
    username: readRequiredEnv('DATABASE_USER'),
    password: readRequiredEnv('DATABASE_PASSWORD'),
    database: readRequiredEnv('DATABASE_NAME'),
    logging: parseBoolean(process.env.SQL_LOGGING),
  };
}

export function getBaseDataSourceOptions(): DataSourceOptions {
  const database = getDatabaseConfig();

  return {
    type: 'postgres',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.database,
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/../../migrations/*{.ts,.js}`],
    logging: database.logging,
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
  };
}

export function getTypeOrmModuleOptions(): TypeOrmModuleOptions {
  return {
    ...getBaseDataSourceOptions(),
    autoLoadEntities: true,
  };
}

export function configurationFactory(): AppConfig {
  return {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: getDatabaseConfig(),
    typeOrm: getTypeOrmModuleOptions(),
  };
}

export function typeOrmConfigFactory(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const config = configService.get<TypeOrmModuleOptions>('typeOrm');

  if (!config) {
    throw new Error('TypeORM configuration is missing');
  }

  return config;
}
