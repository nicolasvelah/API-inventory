/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition } from 'mongoose';
import User from '../models/user';
import { UpdateUser } from '../models/generic/controllers/user-controller-inputs';

export default interface UsersRepository {
  create(data: DocumentDefinition<User>): Promise<User>;
  getAll(): Promise<User[]>;
  deleteById(id: string): Promise<boolean>;
  findByEmailAndpassword(email: string, password: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updatePasswordByEmail(email: string, password: string): Promise<User | null>;
  getById(id: string): Promise<User | null>;
  findByValue(value: string): Promise<User[]>;
  getCoordinatorsAndTechnicals(): Promise<User[]>;
  update(_id: string, data: UpdateUser): Promise<User | null>;
}
