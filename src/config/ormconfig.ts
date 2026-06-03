import 'dotenv/config';

import { DataSource } from 'typeorm';

import { getBaseDataSourceOptions } from './database.config';

export default new DataSource(getBaseDataSourceOptions());
