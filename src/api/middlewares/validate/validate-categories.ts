import { validate, Joi, schema } from 'express-validation';

export default class ValidateCategories {
  static createValidation() {
    const validationParams: schema = {
      body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
      })
    };
    return validate(validationParams, { statusCode: 406 });
  }
}
