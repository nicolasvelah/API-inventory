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
        idCoordinator: Joi.string().allow(null)
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
        name: Joi.string().allow(null),
        lastName: Joi.string().allow(null),
        dateOfBirth: Joi.string().allow(null),
        email: Joi.string().email().allow(null),
        phone: Joi.string()
          .regex(/[0-9]{7,30}/)
          .allow(null),
        role: Joi.string().allow(null),
        enabled: Joi.boolean().allow(null),
        idCoordinator: Joi.string().allow(null)
      })
    };
    return validate(validationParams);
  }
}
