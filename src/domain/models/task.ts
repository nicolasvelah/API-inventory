/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import User from './user';
import Place from './place';

enum TaskType {
  installation,
  service,
  maintenance
}
export type taskType = keyof typeof TaskType;
export const TASK_TYPE_LIST = Object.keys(TaskType);

export default interface Task extends Document {
  user: User;
  place: Place;
  scheduledDate: Date;
  arrivalDate: Date;
  arrivalLatLong: [number, number];
  arrivalPhoto: string;
  closeDate: Date;
  closeLatLong: [number, number];
  closePhoto: string;
  type: taskType;
  createdAt?: Date;
  updatedAt?: Date;
}
