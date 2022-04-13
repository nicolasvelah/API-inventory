/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { Dependencies } from '../../../dependency-injection';
import TasksRepository from '../../../domain/repositories/tasks-repository';
import InventoriesRepository from '../../../domain/repositories/inventories-repository';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';

export default class TasksController {
  private tasksRepo = Get.find<TasksRepository>(Dependencies.tasks);

  private inventoriesRepo = Get.find<InventoriesRepository>(Dependencies.inventories);

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
        catalogToInstall
      } = req.body;

      if ((type === 'installation') && !(Array.isArray(catalogToInstall) && catalogToInstall.length)) throw { code: 406, message: 'For instalations need catalogToInstall' };
      const task = await this.tasksRepo.create({
        technical: idTechnical,
        coordinator: idCoordinator,
        place: idPlace,
        scheduledDate: new Date(scheduledDate),
        type,
        description,
        catalogToInstall
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
        inventory,
      } = req.body;

      const inventoryUpdated = [];
      if (inventory) {
        const { idUser } = res.locals.session;
        //const idUser = '6214416bc341eaa648916b15'
        for (let i = 0; i < inventory.length; i++) {
          const item = inventory[i]
          const { id, place, spentMaterial, inRemplaceId, photos } = item;

          const curInventory = await this.inventoriesRepo.update(
            id,
            {
              place,
              task: req.params.id,
              spentMaterial,
              inRemplaceId,
              photos
            },
            idUser
          );
          inventoryUpdated.push(curInventory)
        }
      }

      const data:any = {
        technical: idTechnical ?? null,
        coordinator: idCoordinator ?? null,
        place: idPlace ?? null,
        arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
        arrivalLatLong: arrivalLatLong ? {
          type: 'Point',
          coordinates: arrivalLatLong
        } : null,
        arrivalPhoto: arrivalPhoto ?? null,
        closedDate: closedDate ? new Date(closedDate) : null,
        closedLatLong: closedLatLong ? {
          type: 'Point',
          coordinates: closedLatLong
        } : null,
        closedPhoto: closedPhoto ?? null,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        type: type ?? null,
        description: description ?? null
      }

      const task = await this.tasksRepo.update(req.params.id, data);
      if (!task) throw { code: 406, message: 'Task id dont found' };
      res.send({ task, inventory: inventoryUpdated });
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
      const { limit, page, from, to } = req.query;
      const tasks = await this.tasksRepo.getAll(new Date(Number(from)), new Date(Number(to)), Number(page), Number(limit));
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
      //const { idUser } = res.locals.session;
      const { limit, page } = req.query;
      const idUser = '6214416bc341eaa648916b15'
      const tasks:any = await this.tasksRepo.getAllByIdUser(idUser, status, Number(page), Number(limit));
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
