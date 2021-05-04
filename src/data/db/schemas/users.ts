import { Schema, model } from 'mongoose';
import User from '../../../domain/models/user';

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: {
    type: String,
    enum: ['admin', 'tecnico'],
    default: 'tecnico',
  },
  enabled: { type: Boolean, default: true },
});

const Users = model<User>('user', schema);
export default Users;
