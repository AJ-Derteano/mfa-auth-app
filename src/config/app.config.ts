import { ConfigModuleOptions } from '@nestjs/config';

import config, { configJoiSchema } from './env.config';
import { environments } from 'src/const/environments';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  load: [config],
  envFilePath: environments[process.env.NODE_ENV] || '.env.development',
  validationSchema: configJoiSchema,
};
