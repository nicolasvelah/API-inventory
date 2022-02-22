import { DocumentDefinition } from 'mongoose';
import User, { userRolesType } from '../../domain/models/user';
import UsersRepository from '../../domain/repositories/users-repository';
import Users from '../db/schemas/users';
import { UpdateUser } from '../../domain/models/generic/controllers/user-controller-inputs';

export default class UsersRepositoryImpl implements UsersRepository {
  async findByValue(value: string): Promise<User[]> {
    const searchRgx = this.rgx(value);
    const users = await Users.find({
      $or: [
        { name: { $regex: searchRgx, $options: 'i' } },
        { lastName: { $regex: searchRgx, $options: 'i' } },
        { email: { $regex: searchRgx, $options: 'i' } }
      ]
    }).select('-password');

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

  async getCoordinatorsAndTechnicals(): Promise<User[]> {
    const users = await Users.find({
      $or: [{ role: 'coordinator' }, { role: 'technical' }]
    }).select('-password');
    console.log('users -->', users);
    return users;
  }

  async update(_id: string, data: UpdateUser): Promise<User | null> {
    console.log('data -->', data);
    const user = await Users.findById(_id).select('-password');
    if (!user) return null;

    user.name = data.name ?? user.name;
    user.lastName = data.lastName ?? user.lastName;
    user.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : user.dateOfBirth;
    user.email = data.email ?? user.email;
    user.phone = data.phone ?? user.phone;
    user.role = data.role ? (data.role as userRolesType) : user.role;
    user.coordinator = data.idCoordinator
      ? ((data.idCoordinator as unknown) as User | undefined)
      : user.coordinator;
    await user.save();

    return user;

    //return null;
  }

  private rgx(pattern: string): RegExp {
    return new RegExp(`.*${pattern}.*`);
  }
}
