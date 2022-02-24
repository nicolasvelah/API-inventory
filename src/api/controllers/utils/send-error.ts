import { Response } from 'express';

const sendErrorResponse = (e: any, res: Response) => {
  console.log('Send Error', e);
  const code = typeof e.code === 'string' ? 400 : 500;
  res.status(code ?? 500).send({ message: e.message ?? 'unknown error' });
};

export default sendErrorResponse;
