import { Schema, model } from 'mongoose';
import User, { userRoles } from '../../../domain/models/user';

const schema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [userRoles.Administrator, userRoles.Coordinator, userRoles.Technical],
    default: userRoles.Technical,
  },
  enabled: { type: Boolean, default: true },
}, { timestamps: true });

const Users = model<User>('user', schema);
export default Users;
