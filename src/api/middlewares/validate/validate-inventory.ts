import { validate, Joi, schema } from 'express-validation';

export default class ValidateInventory {
  static updateValidation() {
    const validationParams: schema = {
      body: Joi.object({
        place: Joi.string().required(),
        task: Joi.string().required(),
        spentMaterial: Joi.number(),
        inRemplaceId: Joi.string(),
        photos: Joi.array().allow(null)
      })
    };
    console.log(validate(validationParams));
    return validate(validationParams, { statusCode: 406 });
  }

  static getByUserValidation() {
    const validationParams: schema = {
      query: Joi.object({
        state: Joi.string().valid(...['closed', 'free']).required()
      })
    };
    console.log(validate(validationParams));
    return validate(validationParams, { statusCode: 406 });
  }
}
