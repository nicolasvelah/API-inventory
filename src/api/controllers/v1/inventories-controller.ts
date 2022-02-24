import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import XLSX from 'xlsx';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';
import InventoriesRepository from '../../../domain/repositories/inventories-repository';
import { deleteFile } from '../utils/file-upload'

export default class InventoriesController {
  private inventoriesRepo = Get.find<InventoriesRepository>(Dependencies.inventories);

  constructor() {
    autoBind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const {
        user,
        task,
        place,
        dataCollected,
        device,
        state
      } = req.body;

      const inventory = await this.inventoriesRepo.create({
        user,
        task,
        place,
        dataCollected,
        device,
        state
      });

      res.send(inventory);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.inventoriesRepo.deleteById('ssaskasjasj');
      res.send(deleted);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const inventories = await this.inventoriesRepo.getAll();
      res.send(inventories);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async getBy(req: Request, res: Response): Promise<void> {
    try {
      const inventories = await this.inventoriesRepo.getBy(req.params.id, req.params.type);
      res.send(inventories);
    } catch (e) {
      sendErrorResponse(e, res);
    }
  }

  async addMaterialToInventory(req: Request, res: Response): Promise<string | undefined> {
    if (!req.file) {
      res.status(406).send({ message: 'No file attached' });
      return;
    }

    try {
      const excel = await XLSX.readFile(req.file.path);
      /// Obtengo las hojas del archivo excel
      const arrayHojas = excel.SheetNames;

      ///Recorro las hojas del excel
      const data:any[] = []
      for (let i = 0; i < arrayHojas.length; i++) {
        const sheetName = arrayHojas[i];
        const dataCovert = XLSX.utils.sheet_to_json(excel.Sheets[sheetName], {
          defval: null,
        });
        data.push(dataCovert);
      }
      console.log('DATA -->', data);

      const message:string = await this.addDataToInventory(data);

      deleteFile(req.file.path);
      if (message !== 'OK') throw { code: 406, message };

      res.status(200).send({ message });
    } catch (error) {
      console.log('Error en Excel load-file', error.message);
      deleteFile(req.file.path);
      res.status(406).send({ message: error.message });
    }
  }

  async addDataToInventory(data:any): Promise<string> {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      for (let o = 0; o < item.length; o++) {
        const columns = item[o];
        console.log('columns', columns)
        if (!columns.deviceId && !columns.dataCollected) {
          return 'Incorrect Format, No deviceId and unicDataCollected columns'
        }
        const material = {
          device: columns.deviceId,
          place: columns.placeId ?? null,
          user: columns.userId ?? null,
          task: columns.taskId ?? null,
          state: columns.state ?? 'free',
          installationDate: columns.installationDate ?? null,
          spentMaterial: columns.spentMaterial ?? 0,
          remainingMaterial: columns.remainingMaterial ?? 0,
          totalMaterial: columns.totalMaterial ?? 0,
          photos: columns.photos ?? null,
          dataCollected: JSON.parse(columns.dataCollected)
        }
        console.log('material', material)
        this.inventoriesRepo.create(material);
      }
    }
    return 'OK';
  }
}
