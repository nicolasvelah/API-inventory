import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import UsersRepository from '../../../domain/repositories/users-repository';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';
import FirebaseRepository from '../../../domain/repositories/firebase-repository';
import PERMISSIONS_USERS from '../../../helpers/permissions-user';

export default class UsersController {
  private usersRepo = Get.find<UsersRepository>(Dependencies.users);

  private firebaseRepo = Get.find<FirebaseRepository>(Dependencies.firebase);

  constructor() {
    autoBind(this);
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password }: { email: string; password: string } = req.body;
      if (!email || !password) {
        throw { code: 400, message: 'missing username or password' };
      }

      const userFoud = await this.usersRepo.findByEmailAndpassword(email, password);

      if (!userFoud) throw { code: 400, message: 'missing username or password' };

      const token = await this.firebaseRepo.createFirebaseToken(userFoud.id);

      res.send({ user: userFoud, token });
    } catch (error) {
      console.log('Error in login:', error.message);
      res.status(401).send({ message: 'Unauthorized' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, dateOfBirth, lastName, phone, email, password, role } = req.body;

      const validateRol = Object.keys(PERMISSIONS_USERS).includes(role);

      if (!validateRol) throw new Error('Invalid role');

      const permissions = PERMISSIONS_USERS[role as 'administrator' | 'coordinator' | 'technical'];

      const user = await this.usersRepo.create({
        name,
        dateOfBirth: new Date(dateOfBirth),
        lastName,
        phone,
        email,
        password,
        role,
        permissions,
        enabled: true
      });

      const treatedUser = {
        _id: user._id,
        enabled: user.enabled,
        permissions: user.permissions,
        dateOfBirth: user.dateOfBirth,
        name,
        lastName,
        phone,
        email,
        password,
        role
      };

      const token = await this.firebaseRepo.createFirebaseToken(user.id);

      res.send({ user: treatedUser, token });
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

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      console.log((req as any).session);
      const users = await this.usersRepo.getAll();
      res.send({ users });
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
