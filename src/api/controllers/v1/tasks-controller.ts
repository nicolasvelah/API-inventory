import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import TasksRepository from '../../../domain/repositories/tasks-repository';
import InventoriesRepository from '../../../domain/repositories/inventories-repository';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';

export default class TasksController {
  private tasksRepo = Get.find<TasksRepository>(Dependencies.tasks);

  private inventoryRepo = Get.find<InventoriesRepository>(Dependencies.inventories);

  constructor() {
    autoBind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const {
        idTechnical,
        idCoordinator,
        idPlace,
        scheduledDate,
        type,
        description,
      } = req.body; // como se relaciona con el inventario

      const task = await this.tasksRepo.create({
        technical: idTechnical,
        coordinator: idCoordinator,
        place: idPlace,
        scheduledDate: new Date(scheduledDate),
        type,
        description
      });
      res.send(task);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const {
        idTechnical,
        idCoordinator,
        idPlace,
        scheduledDate,
        arrivalDate,
        arrivalLatLong,
        arrivalPhoto,
        closedDate,
        closedLatLong,
        closedPhoto,
        type,
        description,
      } = req.body;

      const data:any = {
        technical: idTechnical,
        coordinator: idCoordinator,
        place: idPlace,
        arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
        arrivalLatLong: {
          type: 'Point',
          coordinates: arrivalLatLong
        },
        arrivalPhoto,
        closedDate: closedDate ? new Date(closedDate) : null,
        closedLatLong: {
          type: 'Point',
          coordinates: closedLatLong
        },
        closedPhoto: closedPhoto ?? null,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        type,
        description
      }

      const task = await this.tasksRepo.update(req.params.id, data);
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
      /*const resp = await this.tasksRepo.getGroupByUser();
      console.log('resp -->', resp[0]); */
      const tasks = await this.tasksRepo.getAll();
      console.log('tasks -->', tasks);
      res.send({ tasks });
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

  async getAllByIdUser(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const { idUser } = res.locals.session;
      const { limit, page } = req.query;
      const tasks:any = await this.tasksRepo.getAllByIdUser(idUser, status, Number(page), Number(limit));
      for (let i = 0; i < tasks.task.length; i++) {
        const currTask = tasks.task[i]
        // eslint-disable-next-line no-await-in-loop
        const inventory:any = await this.inventoryRepo.getTaskInventory(currTask._id);
        tasks.task[i].inventory = inventory;
        console.log('--------------', tasks)
      }
      res.send(tasks);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async getAllByIdUserAndRangeDates(req: Request, res: Response): Promise<void> {
    try {
      const { userId, startDate, endDate } = req.params;
      console.log('params -->', { userId, startDate, endDate });
      const tasks = await this.tasksRepo.getAllByIdUserAndRangeDates(userId, startDate, endDate);
      res.send({ tasks });
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }
}
