import { DocumentDefinition } from 'mongoose';
import User from '../../domain/models/user';
import UsersRepository from '../../domain/repositories/users-repository';
import Users from '../db/schemas/users';

export default class UsersRepositoryImpl implements UsersRepository {
  async getAll(): Promise<User[]> {
    const users = await Users.find({});
    return users;
  }

  create(data: DocumentDefinition<User>): Promise<User> {
    return Users.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Users.deleteOne({ _id: id });
    return (result.deletedCount ?? 0) > 0;
  }
}
