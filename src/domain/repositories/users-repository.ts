/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition } from 'mongoose';
import User from '../models/user';

export default interface UsersRepository {
  create(data: DocumentDefinition<User>): Promise<User>;
  getAll(): Promise<User[]>;
  deleteById(id: string): Promise<boolean>;
  findByEmailAndpassword(email: string, password: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updatePasswordByEmail(email: string, password: string): Promise<User | null>;
  getById(id: string): Promise<User | null>;
}
