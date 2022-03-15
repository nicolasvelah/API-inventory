import { Response } from 'express';

const sendErrorResponse = (e: any, res: Response) => {
  console.log('Send Error', e);
  //const code = typeof e.code === 'string' ? 400 : 406;
  res.status(e.code ?? 406).send({ message: e.message ?? 'unknown error' });
};

export default sendErrorResponse;
