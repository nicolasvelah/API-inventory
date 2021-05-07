import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import UsersRepository from '../../../domain/repositories/users-repository';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';
import FirebaseRepository from '../../../domain/repositories/firebase-repository';
import PERMISSIONS_USERS from '../../../helpers/permissions-user';
import Crypt from '../../../helpers/crypt';
import EmailManager from '../../../helpers/email-manager';

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
        throw { code: 400, message: 'Missing username or password' };
      }

      const user = await this.usersRepo.findByEmail(email);
      if (!user) throw { code: 400, message: 'User do not exist' };

      const correctPassword = await Crypt.matchPassword(password, user.password);
      if (!correctPassword) throw { code: 401, message: 'Unauthorized' };

      const token = await this.firebaseRepo.createFirebaseToken(user.id);

      const userWithoutPassword = {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        enabled: user.enabled
      };
      res.send({ user: userWithoutPassword, token });
    } catch (error) {
      console.log('Error in login:', error.message);
      res.status(401).send({ message: 'Unauthorized' });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const {
        name,
        dateOfBirth,
        lastName,
        phone,
        email,
        password,
        confirmPassword,
        role
      } = req.body;

      if (password.length < 4) {
        throw { code: 417, message: 'Passwords must be at least 4 characters' };
      }

      if (password !== confirmPassword) {
        throw { code: 417, message: 'Passwords do not match' };
      }

      const userFoud = await this.usersRepo.findByEmail(email);
      if (userFoud) {
        throw { code: 400, message: 'The Email is already in use' };
      }

      const validateRol = Object.keys(PERMISSIONS_USERS).includes(role);
      if (!validateRol) throw { code: 417, message: 'Invalid role' };

      const encryptPassword = await Crypt.encryptPassword(password);
      if (!encryptPassword) {
        throw { code: 500, message: 'Internal Server Error' };
      }
      const permissions = PERMISSIONS_USERS[role as 'administrator' | 'coordinator' | 'technical'];
      const user = await this.usersRepo.create({
        name,
        dateOfBirth: new Date(dateOfBirth),
        lastName,
        phone,
        email,
        password: encryptPassword,
        role,
        permissions,
        enabled: true
      });

      const token = await this.firebaseRepo.createFirebaseToken(user.id);

      res.send({ token });
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async recoverPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const user = await this.usersRepo.findByEmail(email);
      if (user) {
        const emailManager = EmailManager.getInstance();
        await emailManager.sendEmail({
          //to: email,
          to: 'juanaciolalangui@gmail.com',
          html: `<div>
          Hola
          <a href="http://localhost:3000" target="_blank">
          <button type="button >Reestablecer contraseña</button>
          </a>
          </div>`,
          subject: 'Reestablecer contraseña'
        });
      }
      res.send();
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const { password, confirmPassword, email } = req.body;

      if (password !== confirmPassword) {
        throw { code: 417, message: 'Passwords do not match' };
      }

      const user = await this.usersRepo.findByEmail(email);
      if (!user) throw { code: 400, message: 'User not foud' };

      const encryptPassword = await Crypt.encryptPassword(password);
      if (!encryptPassword) {
        throw { code: 500, message: 'Internal Server Error' };
      }

      user.password = encryptPassword;
      await user.save();

      res.send({ message: 'Password Updated' });
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
