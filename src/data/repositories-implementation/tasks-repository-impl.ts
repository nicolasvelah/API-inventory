import { DocumentDefinition } from 'mongoose';
import Task from '../../domain/models/task';
import TasksRepository, { TasksByUser } from '../../domain/repositories/tasks-repository';
import Tasks from '../db/schemas/tasks';

export default class TasksRepositoryImpl implements TasksRepository {
  async getGroupByUser(): Promise<TasksByUser[]> {
    const result = await Tasks.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'technical',
          localField: 'technical',
          foreignField: '_id'
        }
      },
      { $unwind: '$technical' },
      {
        $group: {
          _id: '$technical',
          tasks: {
            $push: '$$ROOT'
          }
        }
      },
      {
        $project: {
          _id: 0,
          technical: 1,
          tasks: 1
        }
      }
    ]);
    return result;
  }

  async getAll(): Promise<Task[]> {
    const tasks = await Tasks.find({}).populate('user', '-password').populate('place');
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
