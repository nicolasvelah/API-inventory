import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import TasksRepository from '../../../domain/repositories/tasks-repository';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';

export default class TasksController {
  private tasksRepo = Get.find<TasksRepository>(Dependencies.tasks);

  constructor() {
    autoBind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const {
        idTechnical,
        idPlace,
        arrivalDate,
        arrivalLatLong,
        arrivalPhoto,
        closedDate,
        closedLatLong,
        closedPhoto,
        scheduledDate,
        type
      } = req.body;

      const task = await this.tasksRepo.create({
        technical: idTechnical,
        place: idPlace,
        arrivalDate: new Date(arrivalDate),
        arrivalLatLong: {
          type: 'Point',
          coordinates: arrivalLatLong
        },
        arrivalPhoto,
        closedDate: new Date(closedDate),
        closedLatLong: {
          type: 'Point',
          coordinates: closedLatLong
        },
        closedPhoto,
        scheduledDate: new Date(scheduledDate),
        type
      });
      res.send(task);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;
      const deleted = await this.tasksRepo.deleteById(id);
      res.send(deleted);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const resp = await this.tasksRepo.getGroupByUser();
      console.log('resp -->', resp[0]);
      const tasks = await this.tasksRepo.getAll();
      res.send(tasks);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async getGroupByUser(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.tasksRepo.getGroupByUser();
      res.send(users);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
