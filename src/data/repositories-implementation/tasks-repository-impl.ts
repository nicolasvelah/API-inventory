import { DocumentDefinition } from 'mongoose';
import Task from '../../domain/models/task';
import TasksRepository from '../../domain/repositories/tasks-repository';
import Tasks from '../db/schemas/tasks';

export default class TasksRepositoryImpl implements TasksRepository {
  async getAll(): Promise<Task[]> {
    const tasks = await Tasks.find({}).populate('user').populate('place');
    return tasks;
  }

  create(data: DocumentDefinition<Task>): Promise<Task> {
    return Tasks.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Tasks.deleteOne({ id });

    return (result.deletedCount ?? 0) > 0;
  }
}
