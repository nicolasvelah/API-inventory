import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import jwt from 'jsonwebtoken';
import { Dependencies } from '../../../dependency-injection';
import UsersRepository from '../../../domain/repositories/users-repository';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';
import FirebaseRepository from '../../../domain/repositories/firebase-repository';
import PERMISSIONS_USERS from '../../../helpers/permissions-user';
import Crypt from '../../../helpers/crypt';
import EmailManager from '../../../helpers/email-manager';
import User, { userRolesType } from '../../../domain/models/user';

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

      const correctPassword = await Crypt.matchPassword(password, user.password ?? '');
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
        enabled: user.enabled,
        coordinator: user.coordinator
      };
      res.send({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(401).send({ message: 'Unauthorized' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const {
        name,
        lastName,
        dateOfBirth,
        email,
        phone,
        enabled,
        role,
        idCoordinator
      }: {
        name: string;
        lastName: string;
        dateOfBirth: string;
        email: string;
        phone: string;
        enabled: boolean;
        role: userRolesType;
        idCoordinator?: string;
      } = req.body;

      const userFoud = await this.usersRepo.findByEmail(email);
      if (userFoud) {
        throw { code: 400, message: 'The Email is already in use' };
      }

      const validateRol = Object.keys(PERMISSIONS_USERS).includes(role);
      if (!validateRol) throw { code: 417, message: 'Invalid role' };

      const permissions = PERMISSIONS_USERS[role];
      const user = await this.usersRepo.create({
        name,
        dateOfBirth: new Date(dateOfBirth),
        lastName,
        phone,
        email,
        role,
        permissions,
        enabled,
        coordinator: idCoordinator as User | undefined // Esto se le hace para poder hacer la relación en mongodb
      });

      if (!user) throw { code: 500, message: 'Interval server error' };

      await this.sendEmailToResetPassword(user.email);

      res.send({ user, message: 'User created' });
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async recoverPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email }: { email: string } = req.body;
      const user = await this.usersRepo.findByEmail(email);
      if (user) {
        await this.sendEmailToResetPassword(user.email);
      }
      res.send({ message: 'Email sent' });
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

  async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.usersRepo.deleteById(id);
      res.send({ deleted });
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      console.log('getAll');
      const users = await this.usersRepo.getAll();
      res.send({ users });
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const {
        phone,
        role,
        enabled
      }: { phone?: string; role?: userRolesType; enabled?: boolean } = req.body;

      const { id }: { id: string } = (req as any).session;

      if (role) {
        const validateRol = Object.keys(PERMISSIONS_USERS).includes(role ?? '');
        if (!validateRol) throw { code: 417, message: 'Invalid role' };
      }

      const user = await this.usersRepo.getById(id);
      if (!user) throw { code: 400, message: 'User not foud' };

      user.phone = phone ?? user.phone;
      user.role = role ?? user.role;
      user.enabled = enabled === undefined ? user.enabled : enabled;
      await user.save();

      res.send({ message: 'User updated' });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  }

  async findByValue(req: Request, res: Response) {
    try {
      console.log('findByValue');
      const { value } = req.params;
      const users = await this.usersRepo.findByValue(value);
      res.send({ users });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('id -->', id);
      const user = await this.usersRepo.getById(id);
      if (!user) throw { code: 404, message: 'User not found' };
      res.send({ user });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  }

  private async sendEmailToResetPassword(email: string) {
    const expiresIn = 60 * 30; // 30 mins in seconds
    const token = jwt.sign({ email, public: true }, process.env.JWT_SECRET!, { expiresIn });
    console.log('token -->', token);

    const emailManager = EmailManager.getInstance();
    await emailManager.sendEmail({
      to: email,
      //to: 'bjuanacio@pas-hq.com',
      html: `<div>
          Hola
          <a href="http://localhost:3000/reset/${token}" target="_blank">
            ir a link
          </a>
          </div>`,
      subject: 'Reestablecer contraseña'
    });
  }
}
