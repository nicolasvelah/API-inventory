import { validate, Joi, schema } from 'express-validation';

export default class ValidateUser {
  static loginValidation() {
    const loginValidationParams: schema = {
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .regex(/[a-zA-Z0-9]{3,30}/)
          .required()
      })
    };
    return validate(loginValidationParams);
  }

  static createValidation() {
    const loginValidationParams: schema = {
      body: Joi.object({
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        dateOfBirth: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string()
          .regex(/[0-9]{7,30}/)
          .required(),
        role: Joi.string().required(),
        enabled: Joi.boolean().required(),
        idManager: Joi.string()
      })
    };
    return validate(loginValidationParams);
  }
}
