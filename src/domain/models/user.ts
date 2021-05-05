import { Document } from 'mongoose';

export enum userRoles {
  Administrator = 'administrator',
  Coordinator = 'coordinator',
  Technical = 'technical'
}

export default interface User extends Document {
  name: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phone: string;
  password: string;
  role: userRoles.Administrator | userRoles.Coordinator | userRoles.Technical;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
