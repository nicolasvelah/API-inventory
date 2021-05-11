/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition, Types } from 'mongoose';
import Task from '../models/task';

export interface TasksByUser {
  _id: Types.ObjectId;
  tasks: Task[];
}

export default interface TasksRepository {
  getGroupByUser(): Promise<TasksByUser[]>;
  create(data: DocumentDefinition<Task>): Promise<Task>;
  deleteById(id: string): Promise<boolean>;
  getAll(): Promise<Task[]>;
}
