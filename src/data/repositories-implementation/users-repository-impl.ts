import { DocumentDefinition } from 'mongoose';
import User from '../../domain/models/user';
import UsersRepository from '../../domain/repositories/users-repository';
import Users from '../db/schemas/users';

export default class UsersRepositoryImpl implements UsersRepository {
  async updatePasswordByEmail(email: string, password: string): Promise<User | null> {
    const updated = await Users.findOneAndUpdate(
      { email },
      {
        password
      }
    );
    return updated;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await Users.findOne({ email }).populate('user', '-password');
    return user;
  }

  async findByEmailAndpassword(email: string, password: string): Promise<User | null> {
    const user = await Users.findOne({ email, password });
    return user;
  }

  async getAll(): Promise<User[]> {
    const users = await Users.find({}, { password: 0 }).populate('user', '-password');
    return users;
  }

  create(data: DocumentDefinition<User>): Promise<User> {
    return Users.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Users.deleteOne({ _id: id });
    return (result.deletedCount ?? 0) > 0;
  }

  async getById(id: string): Promise<User | null> {
    return Users.findById({ _id: id });
  }
}
