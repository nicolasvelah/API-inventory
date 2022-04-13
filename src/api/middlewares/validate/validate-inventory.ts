import { validate, Joi, schema } from 'express-validation';

export default class ValidateInventory {
  static createValidation() {
    const dataCollected = Joi.object().keys({
      name: Joi.string().required(),
      value: Joi.string().required(),
    })
    const validationParams: schema = {
      body: Joi.object({
        catalogId: Joi.string().required(),
        state: Joi.string().required(),
        userId: Joi.string().required(),
        dataCollected: Joi.array().items(dataCollected).required(),
        photos: Joi.array().allow(null)
      })
    };
    console.log(validate(validationParams));
    return validate(validationParams, { statusCode: 406 });
  }

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

  static updateUserValidation() {
    const data = Joi.object().keys({
      id: Joi.string().required(),
      userId: Joi.string().required(),
    })
    const validationParams: schema = {
      body: Joi.object({
        data: Joi.array().items(data).required()
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
