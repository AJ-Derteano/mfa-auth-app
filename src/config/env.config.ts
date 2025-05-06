import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

// Variables de entorno
export default registerAs('config', () => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    SECRET: process.env.SECRET,
    HAST_SALT: process.env.HAST_SALT,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    APP_PORT: process.env.PORT,
    MONGO_CONN: process.env.MONGO_CONN,
    MONGO_HOST: process.env.MONGO_HOST,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_DB: process.env.MONGO_DB,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASS: process.env.MONGO_PASS,
  };
});

// Validacion del esquema de las variables de entorno
export const configJoiSchema: Joi.ObjectSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod', 'qa').default('dev'),
  PORT: Joi.number().default(3000),
  SECRET: Joi.string().required(),
  HAST_SALT: Joi.number().default(10),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  MONGO_CONN: Joi.string().required(),
  MONGO_HOST: Joi.string(),
  MONGO_PORT: Joi.number().default(27017),
  MONGO_DB: Joi.string().required(),
  MONGO_USER: Joi.string(),
  MONGO_PASS: Joi.string(),
});
