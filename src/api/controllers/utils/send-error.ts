import { Response } from 'express';

const sendErrorResponse = (e: any, res: Response) => {
  res.status(e.code ?? 500).send({ message: e.message ?? 'unknown error' });
};

export default sendErrorResponse;
