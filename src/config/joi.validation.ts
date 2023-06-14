import * as Joi from 'joi';
import { State } from '../common/types/enums';

export const JoiValidationSchema = Joi.object({
  DB_PASSWORD: Joi.string(),
  DB_NAME: Joi.string(),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number(),
  DB_USERNAME: Joi.string(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  PORT: Joi.number().default(3000),
  SECRET: Joi.string(),
  STATE: Joi.string().valid(State.Prod, State.Stg, State.Dev),
  CLOUDINARY_CLOUD_NAME: Joi.string(),
  CLOUDINARY_API_KEY: Joi.string(),
  CLOUDINARY_API_SECRET: Joi.string(),
  CLOUDINARY_SEED_FOLDER: Joi.string(),
  JWT_SECRET: Joi.string(),
  GRAPHQL_INTROSPECTION: Joi.boolean(),
});
