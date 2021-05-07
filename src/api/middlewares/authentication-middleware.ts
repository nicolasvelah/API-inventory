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
  /**
   * comprueba la session actual
   * @param req
   * @param res
   * @param next
   */
  static async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const firebaseRepo = Get.find<FirebaseRepository>(Dependencies.firebase);
      const token = req.headers['x-access-token'] as string;
      if (!token) {
        throw { code: 401, message: 'Unauthorized' };
      }
      //console.log('token -->', token.substr(0, 10));
      const idUser = await firebaseRepo.verifyFirebaseToken(token);
      //console.log('idUser -->', idUser);

      if (idUser) {
        /// Esto se lo hace para tener el id del usuario en el request ya que typescript me lo percibe como un error
        (req as any).session = { idUser };
      } else {
        throw { code: 401, message: 'Unauthorized' };
      }
      next();
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
