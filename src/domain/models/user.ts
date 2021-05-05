/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';

enum UserRoles {
  administrator,
  coordinator,
  technical
}
export type userRolesType = keyof typeof UserRoles;
export const USER_ROLES_LIST = Object.values(UserRoles);

export default interface User extends Document {
  name: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phone: string;
  password: string;
  role: userRolesType;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
