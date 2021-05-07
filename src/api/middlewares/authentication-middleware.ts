/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-namespace */
import { NextFunction, Request, Response } from 'express';
import { Dependencies } from '../../dependency-injection';
import Get from '../../helpers/get';
import FirebaseRepository from '../../domain/repositories/firebase-repository';
import sendErrorResponse from '../controllers/utils/send-error';

/* interface SessionRequest extends Request {
  session: {
    uid: string;
  };
} */

export default class Middleware {
  private static instance: Middleware;

  // eslint-disable-next-line no-useless-constructor
  constructor() {
    //console.log('Iniciando middleware');
  }

  public static getInstance(): Middleware {
    if (!Middleware.instance) {
      Middleware.instance = new Middleware();
    }
    return Middleware.instance;
  }

  /**
   * comprueba la session actual
   * @param req
   * @param res
   * @param next
   */
  async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const firebaseRepo = Get.find<FirebaseRepository>(Dependencies.firebase);

      const token = req.headers['x-access-token'] as string;
      if (!token) {
        throw { code: 401, message: 'Unauthorized' };
      }
      //console.log('token -->', token.substr(0, 10));

      const idUser = await firebaseRepo.verifyFirebaseToken(token);
      //console.log('idUser -->', idUser);
      if (!idUser) throw { code: 401, message: 'Unauthorized' };
      /// Esto se lo hace para tener el id del usuario en el request ya que typescript me lo percibe como un error
      (req as any).session = { idUser };

      next();
    } catch (e) {
      console.log('Error en verifyToken', e.message);
      sendErrorResponse(e, res);
    }
  }
}
