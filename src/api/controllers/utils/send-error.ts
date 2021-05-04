import { response, Response } from 'express';

const sendErrorResponse = (e: any, res: Response) => {
  response.status(e.code ?? 500).send(e.message ?? 'unknown error');
};

export default sendErrorResponse;
