import { validate, Joi, schema } from 'express-validation';

export default class ValidateCatalogs {
  static getAllValidation() {
    const validationParams: schema = {
      query: Joi.object({
        type: Joi.string().valid(...['notControlled', 'controlled']),
        categoryId: Joi.string()
      })
    };
    console.log(validate(validationParams));
    return validate(validationParams, { statusCode: 406 });
  }
}
