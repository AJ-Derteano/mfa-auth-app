import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { environments } from 'src/const/environments';
import { configJwtModule } from '.';

ConfigModule.forRoot({
  envFilePath: environments[process.env.NODE_ENV] || '.env.development',
  isGlobal: true,
});

const configServices = new ConfigService();

const getMongodbUri = (): string => {
  const conn = configServices.get('MONGO_CONN');
  const host = configServices.get('MONGO_HOST');
  const port = configServices.get('MONGO_PORT');
  const user = configServices.get('MONGO_USER');
  const pass = configServices.get('MONGO_PASS');

  return `${conn}://${user}:${pass}@${host}:${port}/?authMechanism=DEFAULT`;
};

export const DataSourceConfig = MongooseModule.forRootAsync({
  inject: [configJwtModule.KEY],
  useFactory: (configService: ConfigType<typeof configJwtModule>) => {
    return {
      uri: getMongodbUri(),
      dbName: configService.MONGO_DB,
    };
  },
});
