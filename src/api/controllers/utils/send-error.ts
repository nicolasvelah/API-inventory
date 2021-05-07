import { Response } from 'express';

const sendErrorResponse = (e: any, res: Response) => {
  //console.log('Send Error', e);
  res.status(e.code ?? 500).send({ message: e.message ?? 'unknown error' });
};

export default sendErrorResponse;
