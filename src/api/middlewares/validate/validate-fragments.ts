import { validate, Joi, schema } from 'express-validation';

export default class ValidateFragments {
  static createValidation() {
    const data = Joi.object().keys({
      boxId: Joi.string().required(),
      userId: Joi.string().required(),
      quantity: Joi.number().required(),
    })
    const validationParams: schema = {
      body: Joi.object({
        data: Joi.array().items(data).required()
      })
    };
    console.log(validate(validationParams));
    return validate(validationParams, { statusCode: 406 });
  }
}
