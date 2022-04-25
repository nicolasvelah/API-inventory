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

  static createValidation() {
    const validationParams: schema = {
      body: Joi.object({
        brand: Joi.string().required(),
        type: Joi.valid(...['notControlled', 'controlled']).required(),
        unitOfMeasurement: Joi.valid(...['metros', 'unidades']).allow(null),
        device: Joi.string().required(),
        referenceModel: Joi.string().required(),
        typePlace: Joi.valid(...['ATM', 'sucursal']).required(),
      })
    };
    return validate(validationParams, { statusCode: 406 });
  }
}
