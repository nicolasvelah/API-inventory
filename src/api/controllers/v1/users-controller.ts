import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import UsersRepository from '../../../domain/repositories/users-repository';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';

export default class UsersController {
  private usersRepo = Get.find<UsersRepository>(Dependencies.users);

  constructor() {
    autoBind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const user = await this.usersRepo.create({
        email: '',
        password: '',
        type: 'admin',
        enabled: true,
      });
      res.send(user);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.usersRepo.deleteById('ssaskasjasj');
      res.send(deleted);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
