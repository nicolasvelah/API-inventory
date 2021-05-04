import { Document } from 'mongoose';

export default interface User extends Document {
  email: string;
  password: string;
  type: 'admin' | 'tecnico';
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
