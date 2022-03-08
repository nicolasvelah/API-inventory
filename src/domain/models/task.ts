/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import User from './user';
import Place from './place';
import Point from './point';

enum TaskType {
  installation,
  service,
  maintenance
}
export type taskType = keyof typeof TaskType;
export const TASK_TYPE_LIST = Object.keys(TaskType);

export default interface Task extends Document {
  technical: User;
  coordinator: User;
  place: Place;
  scheduledDate: Date;
  arrivalDate?: Date;
  arrivalLatLong?: Point;
  arrivalPhoto?: string;
  closedDate?: Date;
  closedLatLong?: Point;
  closedPhoto?: string;
  certificatePhoto?: string;
  emnployeePhoto?: string;
  type: taskType;
  description: string;
  inventory?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
