import { validate, Joi, schema } from 'express-validation';

export default class ValidateUser {
  static loginValidation() {
    const validationParams: schema = {
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .regex(/[a-zA-Z0-9]{3,30}/)
          .required()
      })
    };
    return validate(validationParams);
  }

  static createValidation() {
    const validationParams: schema = {
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
    return validate(validationParams);
  }

  static recoverValidation() {
    const validationParams: schema = {
      body: Joi.object({
        email: Joi.string().email().required()
      })
    };
    return validate(validationParams);
  }

  static updatePasswordValidation() {
    const validationParams: schema = {
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().email().required(),
        confirmPassword: Joi.string().email().required()
      })
    };
    return validate(validationParams);
  }

  static updateValidation() {
    const validationParams: schema = {
      body: Joi.object({
        phone: Joi.string().regex(/[0-9]{7,30}/),
        role: Joi.string(),
        enabled: Joi.boolean()
      })
    };
    return validate(validationParams);
  }
}
