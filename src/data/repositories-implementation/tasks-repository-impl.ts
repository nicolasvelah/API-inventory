import { DocumentDefinition, Types } from 'mongoose';
import Task, { taskResponse } from '../../domain/models/task';
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

  // hay que refactorizar con getAllByIdUser hay código repetido...
  async getAll(from:Date, to:Date, page:number, limit:number): Promise<taskResponse> {
    console.log({ from, to });
    const Realpage = page - 1;
    const count: number = await Tasks.countDocuments(
      { scheduledDate: {
        $gte: from,
        $lt: to
      } }
    );
    const pages = Math.ceil(count / limit);
    if (count > 0 && Realpage <= pages) {
      const task = await Tasks.find(
        { scheduledDate: {
          $gte: from,
          $lt: to
        } }
      )
        .populate('technical', ['-password', '-createdAt', '-updatedAt', '-__v'])
        .populate('coordinator', ['-password', '-createdAt', '-updatedAt', '-__v'])
        .populate({
          path: 'place',
          populate: {
            path: 'IntalledMaterial',
            select: ['-createdAt', '-updatedAt', '-__v', '-place', '-user', '-task'],
            populate: [
              {
                path: 'device',
                select: ['-createdAt', '-updatedAt', '-__v'],
                populate: [
                  {
                    path: 'categoryId',
                    select: ['-createdAt', '-updatedAt', '-__v'],
                  }
                ]
              },
              {
                path: 'fragment',
                select: ['-createdAt', '-updatedAt', '-__v', '-owner', '-remainingFragment', '-totalFragment'],
                populate: [
                  {
                    path: 'box',
                    select: ['-createdAt', '-updatedAt', '-__v', '-remainingMaterial', '-totalMaterial', '-device'],
                  }
                ]
              }
            ]
          },
          select: ['-__v', '-createdAt', '-updatedAt']
        })
        .populate({
          path: 'catalogToInstall',
          populate: {
            path: 'categoryId',
            select: ['-createdAt', '-updatedAt', '-__v']
          },
          select: ['-__v', '-createdAt', '-updatedAt', '-state']
        })
        .select(['-__v', '-createdAt', '-updatedAt'])
        .skip(limit * Realpage)
        .limit(limit)
        .lean();
      return { total: count, task, itemsPerPage: limit, pages };
    }
    return { total: count, task: null, itemsPerPage: limit, pages };
  }

  create(data: DocumentDefinition<Task>): Promise<Task> {
    return Tasks.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Tasks.deleteOne({ id });

    return (result.deletedCount ?? 0) > 0;
  }

  async getAllByIdUser(userId: string, status:string, page:number, limit:number): Promise<taskResponse> {
    let closedDate = null;
    if (status === 'closed') closedDate = { $ne: null };
    const count: number = await Tasks.countDocuments({ technical: userId, closedDate })
    const pages = Math.ceil(count / limit);
    if (count > 0 && page <= pages) {
      const task = await Tasks.find({ technical: userId, closedDate })
        .populate('technical', ['-password', '-createdAt', '-updatedAt', '-__v'])
        .populate('coordinator', ['-password', '-createdAt', '-updatedAt', '-__v'])
        .populate({
          path: 'place',
          populate: {
            path: 'IntalledMaterial',
            select: ['-createdAt', '-updatedAt', '-__v', '-place', '-user', '-task'],
            populate: [
              {
                path: 'device',
                select: ['-createdAt', '-updatedAt', '-__v'],
                populate: [
                  {
                    path: 'categoryId',
                    select: ['-createdAt', '-updatedAt', '-__v'],
                  }
                ]
              },
              {
                path: 'fragment',
                select: ['-createdAt', '-updatedAt', '-__v', '-owner', '-remainingFragment', '-totalFragment'],
                populate: [
                  {
                    path: 'box',
                    select: ['-createdAt', '-updatedAt', '-__v', '-remainingMaterial', '-totalMaterial', '-device'],
                  }
                ]
              }
            ]
          },
          select: ['-__v', '-createdAt', '-updatedAt']
        })
        .populate({
          path: 'catalogToInstall.id',
          populate: {
            path: 'categoryId',
            select: ['-createdAt', '-updatedAt', '-__v']
          },
          select: ['-__v', '-createdAt', '-updatedAt', '-state']
        })
        .select(['-__v', '-createdAt', '-updatedAt'])
        .skip(limit * page)
        .limit(limit)
        .lean();
      return { total: count, task, itemsPerPage: limit, pages };
    }
    return { total: count, task: null, itemsPerPage: limit, pages };
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

    //const filteredTasks = tasks.filter((task) => !!task.technical.coordinator);
    return tasks;
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
    } catch (error:any) {
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
