import { Schema, model } from 'mongoose';
import User, { USER_ROLES_LIST, userRolesType } from '../../../domain/models/user';

const defaultRole: userRolesType = 'technical';

const schema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String },
    permissions: { type: [String], required: true },
    role: {
      type: String,
      enum: USER_ROLES_LIST,
      default: defaultRole
    },
    enabled: { type: Boolean, default: true },
    user: {
      ref: 'user',
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const Users = model<User>('user', schema);
export default Users;
