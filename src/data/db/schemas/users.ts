import { Schema, model } from 'mongoose';
import User, { USER_ROLES_LIST, defaultRole } from '../../../domain/models/user';

const schema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String },
    permissions: { type: [String], required: false },
    role: {
      type: String,
      enum: USER_ROLES_LIST,
      default: defaultRole
    },
    enabled: { type: Boolean, default: true },
    coordinator: {
      ref: 'user',
      type: Schema.Types.ObjectId
    }
  },
  { timestamps: true }
);

const Users = model<User>('user', schema);
export default Users;
