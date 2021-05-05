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
      const task = await this.tasksRepo.create({
        arrivalDate: new Date(),
        arrivalLatLong: [0, 0],
        arrivalPhoto: '',
        closeDate: new Date(),
        closeLatLong: [0, 0],
        closePhoto: '',
        scheduledDate: new Date(),
        type: 'maintenance'
      });
      res.send(task);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.tasksRepo.deleteById('ssaskasjasj');
      res.send(deleted);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
