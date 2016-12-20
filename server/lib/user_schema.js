import Joi from 'joi';

export default {
  username: Joi.string().required(),
  password: Joi.string(),
  roles: Joi.array().items(Joi.string()),
  full_name: Joi.string().allow(null, ''),
  email: Joi.string().allow(null, ''),
  metadata: Joi.object(),
  enabled: Joi.boolean().default(true),
    index: Joi.string(),
    _reserved:  Joi.boolean().default(true)
};
