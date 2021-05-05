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
        user,
        place,
        arrivalDate,
        arrivalLatLong,
        arrivalPhoto,
        closeDate,
        closeLatLong,
        closePhoto,
        scheduledDate,
        type
      } = req.body;

      const task = await this.tasksRepo.create({
        user,
        place,
        arrivalDate: new Date(arrivalDate),
        arrivalLatLong,
        arrivalPhoto,
        closeDate: new Date(closeDate),
        closeLatLong,
        closePhoto,
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
      const tasks = await this.tasksRepo.getAll();
      res.send(tasks);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
