import { DocumentDefinition, Types } from 'mongoose';
import Task from '../../domain/models/task';
import TasksRepository from '../../domain/repositories/tasks-repository';
import Tasks from '../db/schemas/tasks';
import User from '../../domain/models/user';
import { UpdateTask } from '../../domain/models/generic/controllers/task-cotroller-inputs'

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
    const tasks = await Tasks.find({}).populate('technical', '-password').populate('coordinator', '-password').populate('place');
    return tasks;
  }

  create(data: DocumentDefinition<Task>): Promise<Task> {
    return Tasks.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Tasks.deleteOne({ id });

    return (result.deletedCount ?? 0) > 0;
  }

  async getAllByIdUser(userId: string, status:string): Promise<Task[]> {
    const query:any = { 'technical._id': Types.ObjectId(userId) };
    if (status === 'closed') {
      query.closedDate = { $ne: null };
    } else {
      query.closedDate = null;
    }
    const task = await Tasks.aggregate([
      // join users for technical
      {
        $lookup: {
          from: 'users',
          localField: 'technical',
          foreignField: '_id',
          pipeline: [{ $project: { password: 0 } }],
          as: 'technical'
        }
      },
      {
        $unwind: '$technical'
      },
      // filtramos solo los de la variable userId
      {
        $match: query
      },
      // join users for coordinator
      {
        $lookup: {
          from: 'users',
          localField: 'coordinator',
          foreignField: '_id',
          pipeline: [{ $project: { password: 0 } }],
          as: 'coordinator'
        }
      },
      // join place
      {
        $lookup: {
          from: 'places',
          localField: 'place',
          foreignField: '_id',
          as: 'place'
        }
      }
    ])

    return task;
  }

  async getAllByIdUserAndRangeDates(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Task[]> {
    const tasks = await Tasks.find({
      createdAt: { $gte: startDate, $lte: endDate }
    } as any)
      .populate({
        path: 'technical',
        select: '-password',
        populate: {
          path: 'coordinator',
          select: '-password',
          match: { _id: userId }
        }
      })
      .populate('place');

    const filteredTasks = tasks.filter((task) => !!task.technical.coordinator);
    return filteredTasks;
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

  async update(id: string, data: UpdateTask): Promise<Task | null> {
    console.log('data -->', data);
    const task = await Tasks.findById(id);
    if (!task) return null;

    task.technical = data.technical ?? task.technical;
    task.coordinator = data.coordinator ?? task.coordinator;
    task.place = data.place ?? task.place;
    task.scheduledDate = data.scheduledDate ? new Date(data.scheduledDate) : task.scheduledDate;
    task.arrivalDate = data.arrivalDate ? new Date(data.arrivalDate) : task.arrivalDate;
    task.arrivalLatLong = data.arrivalLatLong ?? task.arrivalLatLong;
    task.arrivalPhoto = data.arrivalPhoto ?? task.arrivalPhoto;
    task.closedDate = data.closedDate ? new Date(data.closedDate) : task.closedDate;
    task.closedLatLong = data.closedLatLong ?? task.closedLatLong;
    task.closedPhoto = data.closedPhoto ?? task.closedPhoto;
    task.certificatePhoto = data.certificatePhoto ?? task.certificatePhoto;
    task.emnployeePhoto = data.emnployeePhoto ?? task.emnployeePhoto;
    task.type = data.type ?? task.type;
    task.description = data.description ?? task.description;
    await task.save();

    return task;
  }
}
