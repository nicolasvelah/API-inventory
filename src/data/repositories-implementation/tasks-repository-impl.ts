import { DocumentDefinition, Types } from 'mongoose';
import Task from '../../domain/models/task';
import TasksRepository from '../../domain/repositories/tasks-repository';
import Tasks from '../db/schemas/tasks';
import User from '../../domain/models/user';

export default class TasksRepositoryImpl implements TasksRepository {
  async getGroupByUser(): Promise<User[]> {
    /*
    [
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
    ]
    */
    const id = Types.ObjectId('609afe7b0e9ab02e3ea0ee73');

    const result = await Tasks.aggregate([
      {
        $match: {
          technical: id
        }
      },
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
      /* {
        $project: {
          _id: 0,
          technical: 1,
          tasks: 1
        }
      } */
    ]);
    //console.log('result -->', result);
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
    //console.log('orderData -->', orderData);
    //console.log('orderData lenght -->', orderData.length);
    return orderData;

    //return result;
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
}
