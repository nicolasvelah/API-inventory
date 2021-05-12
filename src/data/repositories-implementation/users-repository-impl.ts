import { DocumentDefinition } from 'mongoose';
import User from '../../domain/models/user';
import UsersRepository from '../../domain/repositories/users-repository';
import Users from '../db/schemas/users';

export default class UsersRepositoryImpl implements UsersRepository {
  async findByValue(value: string): Promise<User[]> {
    const searchRgx = this.rgx(value);
    const users = await Users.find({
      $or: [
        { name: { $regex: searchRgx, $options: 'i' } },
        { lastName: { $regex: searchRgx, $options: 'i' } },
        { email: { $regex: searchRgx, $options: 'i' } }
      ]
    });

    return users;
  }

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
    const users = await Users.find({}, { password: 0 }).populate('coordinator', '-password');
    return users;
  }

  create(data: DocumentDefinition<User>): Promise<User> {
    return Users.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    /*
      No puedo buscar por la referancia para la elimincación en cascada
    */
    // const idUser = Types.ObjectId(id)
    //const user = await Tasks.find({ technical: id });
    //const user = await Tasks.find({ technical: idUser });

    const result = await Users.deleteOne({ _id: id });
    return (result.deletedCount ?? 0) > 0;
  }

  async getById(id: string): Promise<User | null> {
    return Users.findById({ _id: id });
  }

  private rgx(pattern: string): RegExp {
    return new RegExp(`.*${pattern}.*`);
  }
}
