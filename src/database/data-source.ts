import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import { databaseConfig } from '../config/database.config';

export let dataSourceOptions = {
  type: databaseConfig.type,
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
} as DataSourceOptions;

if (process.env.NODE_ENV === 'local') {
  dataSourceOptions = {
    ...dataSourceOptions,
    synchronize: true,
  };
}

export const dataSource = new DataSource(dataSourceOptions);
