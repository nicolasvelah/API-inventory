import { validate, Joi, schema } from 'express-validation';

export default class ValidatePlace {
  static createValidation() {
    const validationParams: schema = {
      body: Joi.object({
        name: Joi.string().required(),
        addressNumber: Joi.string().required(),
        city: Joi.string().required(),
        colony: Joi.string().required(),
        coords: Joi.array().required(),
        mainStreet: Joi.string().required(),
        municipality: Joi.string().required(),
        state: Joi.valid(...['active', 'inactive']).required(),
        type: Joi.valid(...['ATM', 'sucursal']).required(),
        IntalledMaterial: Joi.array()
      })
    };
    return validate(validationParams, { statusCode: 406 });
  }
}
