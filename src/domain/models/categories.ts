/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';

export default interface Categories extends Document {
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
