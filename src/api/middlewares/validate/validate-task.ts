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

  static createValidation() {
    const validationParams: schema = {
      body: Joi.object({
        idTechnical: Joi.string().required(),
        idCoordinator: Joi.string().required(),
        idPlace: Joi.string().required(),
        scheduledDate: Joi.date().required(),
        arrivalDate: Joi.date(),
        arrivalLatLong: Joi.array(),
        arrivalPhoto: Joi.string().allow(null),
        closedDate: Joi.date().allow(null),
        closedLatLong: Joi.array().allow(null),
        closedPhoto: Joi.string().allow(null),
        certificatePhoto: Joi.string().allow(null),
        emnployeePhoto: Joi.string().allow(null),
        type: Joi.valid(...['installation', 'service', 'maintenance']).required(),
        description: Joi.string(),
        catalogToInstall: Joi.array()
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
        arrivalPhoto: Joi.string(),
        closedDate: Joi.date(),
        closedLatLong: Joi.array(),
        closedPhoto: Joi.string(),
        certificatePhoto: Joi.string(),
        emnployeePhoto: Joi.string(),
        type: Joi.valid(...['installation', 'service', 'maintenance']),
        description: Joi.string()
      })
    };
    return validate(validationParams, { statusCode: 406 });
  }

  static getAllValidation() {
    const validationParams: schema = {
      query: Joi.object({
        limit: Joi.number().integer().min(10).max(100)
          .required(),
        page: Joi.number().min(1).required(),
        from: Joi.date().required(),
        to: Joi.date().required(),
      })
    };
    return validate(validationParams, { statusCode: 406 });
  }
}
