/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition, Types } from 'mongoose';
import Task, { taskResponse } from '../models/task';
import User from '../models/user';
import { UpdateTask } from '../models/generic/controllers/task-cotroller-inputs';

export interface TasksByUser {
  _id: Types.ObjectId;
  tasks: Task[];
}

export default interface TasksRepository {
  getGroupByUser(): Promise<User[]>;
  getGroupByUserAndUserId(userId: string): Promise<User[]>;
  create(data: DocumentDefinition<Task>): Promise<Task>;
  deleteById(id: string): Promise<boolean>;
  getAll(from:Date, to:Date, page:number, limit:number): Promise<taskResponse>;
  getAllByIdUser(userId: string, status: string, page:number, limit:number): Promise<taskResponse>;
  getAllByIdUserAndRangeDates(userId: string, startDate: string, endDate: string): Promise<Task[]>;
  update(id: string, data: UpdateTask): Promise<Task | null>;
}
