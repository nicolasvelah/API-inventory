import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';

export default (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err) {
    if (err instanceof ValidationError) {
      console.error('Error validate:', err);
      res.status(err.statusCode).json({ message: err.details });
      return;
    }
    res.status(500).json(err);
    return;
  }
  next();
};
