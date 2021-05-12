import { DocumentDefinition, Types } from 'mongoose';
import Task from '../../domain/models/task';
import TasksRepository from '../../domain/repositories/tasks-repository';
import Tasks from '../db/schemas/tasks';
import User from '../../domain/models/user';

export default class TasksRepositoryImpl implements TasksRepository {
  async getGroupByUserAndUserId(userId: string): Promise<User[]> {
    const id = Types.ObjectId(userId);
    const users = await this.groupByUser({
      technical: id
    });
    return users;
  }

  async getGroupByUser(): Promise<User[]> {
    return this.groupByUser();
  }

  async getAll(): Promise<Task[]> {
    const tasks = await Tasks.find({}).populate('technical', '-password').populate('place');
    return tasks;
  }

  create(data: DocumentDefinition<Task>): Promise<Task> {
    return Tasks.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Tasks.deleteOne({ id });

    return (result.deletedCount ?? 0) > 0;
  }

  private async groupByUser(match?: {
    [key: string]: string | number | Types.ObjectId;
  }): Promise<User[]> {
    try {
      const optionsAggregate: any[] = [
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
        }
      ];
      if (match) {
        optionsAggregate.unshift({
          $match: match
        });
      }

      const result = await Tasks.aggregate(optionsAggregate);
      const orderData = result.map((item: any) => {
        const tasksMap: Task[] = item.tasks.map((task: Task) => {
          const { technical, ...newTask } = task;
          return newTask;
        });
        const user: User = {
          ...item._id,
          tasks: tasksMap
        };
        return user;
      });
      return orderData;
    } catch (error) {
      console.log('Error en groupByUser:', error.message);
      return [];
    }
  }
}
