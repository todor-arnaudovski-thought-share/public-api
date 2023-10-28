import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  CORS_HOST: Joi.string().required(),
  PORT: Joi.number().integer().default(3000),
  DB_URI: Joi.string().required(),
  JWT_AT_SECRET: Joi.string().required(),
  JWT_RT_SECRET: Joi.string().required(),
  JWT_AT_EXPIRE: Joi.string().required(),
  JWT_RT_EXPIRE: Joi.string().required(),
  AT_COOKIE_EXPIRE: Joi.number().integer().required(),
  RT_COOKIE_EXPIRE: Joi.number().integer().required(),
});
