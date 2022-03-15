/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import User from './user';
import Box from './boxes';

export default interface Fragments extends Document {
  owner: User | string;
  box: Box | string;
  remainingFragment: number | null;
  totalFragment: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}
