import { validate, Joi, schema } from 'express-validation';

export default class ValidateBoxes {
  static createValidation() {
    const dataCollected = Joi.object().keys({
      name: Joi.string().required(),
      value: Joi.string().required(),
    })
    const validationParams: schema = {
      body: Joi.object({
        catalogId: Joi.string().required(),
        totalMaterial: Joi.number().required(),
        dataCollected: Joi.array().items(dataCollected).required(),
      })
    };
    console.log(validate(validationParams));
    return validate(validationParams, { statusCode: 406 });
  }
}
