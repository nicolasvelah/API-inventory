/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition } from 'mongoose';
import Task from '../models/task';

export default interface TaskRepository {
  create(data: DocumentDefinition<Task>): Promise<Task>;
  deleteById(id: string): Promise<boolean>;
}
