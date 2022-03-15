import { validate, Joi, schema } from 'express-validation';

export default class ValidateTask {
  static byUserGetValidation() {
    const validationParams: schema = {
      params: Joi.object({
        status: Joi.string().valid(...['closed', 'free'])
      }),
      query: Joi.object({
        limit: Joi.required(),
        page: Joi.required()
      })
    };
    return validate(validationParams, { statusCode: 406 });
  }

  static updateValidation() {
    const validationParams: schema = {
      params: Joi.object({
        id: Joi.string().required()
      }),
      body: Joi.object({
        idTechnical: Joi.string(),
        idCoordinator: Joi.string(),
        idPlace: Joi.string(),
        scheduledDate: Joi.date(),
        arrivalDate: Joi.date(),
        arrivalLatLong: Joi.array(),
        arrivalPhoto: Joi.string().allow(null),
        closedDate: Joi.date(),
        closedLatLong: Joi.array(),
        closedPhoto: Joi.string().allow(null),
        certificatePhoto: Joi.string().allow(null),
        emnployeePhoto: Joi.string().allow(null),
        type: Joi.valid(...['installation', 'service', 'maintenance']),
        description: Joi.string()
      })
    };
    return validate(validationParams, { statusCode: 406 });
  }
}
