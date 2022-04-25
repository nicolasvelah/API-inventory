import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import XLSX from 'xlsx';
import { Dependencies } from '../../../dependency-injection';
import Get from '../../../helpers/get';
import sendErrorResponse from '../utils/send-error';
import InventoriesRepository from '../../../domain/repositories/inventories-repository';
import BoxesRepository from '../../../domain/repositories/boxes-respository';
import FragmentRepository from '../../../domain/repositories/fragment-repository';
import { deleteFile } from '../utils/file-upload'
import { UpdateRequest, UpdateUserRequest } from '../../../domain/models/inventory';

export default class InventoriesController {
  private inventoriesRepo = Get.find<InventoriesRepository>(Dependencies.inventories);

  private boxesRepo = Get.find<BoxesRepository>(Dependencies.boxes);

  private fragmentRepo = Get.find<FragmentRepository>(Dependencies.fragments);

  constructor() {
    autoBind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const {
        catalogId,
        userId,
        photos,
        dataCollected,
        state
      } = req.body;

      const inventory = await this.inventoriesRepo.create({
        user: userId,
        dataCollected,
        device: catalogId,
        state,
        photos
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

  async getByUser(req: Request, res: Response): Promise<void> {
    try {
      const { idUser } = res.locals.session;
      const { state } = req.query;
      const inventory = await this.inventoriesRepo.getByUser(idUser, String(state));
      const fragments = await this.fragmentRepo.getByUser(idUser);
      const response: any = { inventory }
      if (state === 'free') response.fragments = fragments
      res.send(response);
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
      //const { idUser } = res.locals.session;
      const idUser = '6214416bc341eaa648916b15';
      const message:string = await this.addDataToInventory(data, idUser);

      deleteFile(req.file.path);
      if (message !== 'OK') throw { code: 406, message };

      res.status(200).send({ message });
    } catch (error:any) {
      console.log('Error en Excel load-file', error.message);
      deleteFile(req.file.path);
      res.status(406).send({ message: error.message });
    }
  }

  async addDataToInventory(data:any, idUser: string): Promise<string> {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const boxTempIDs = []
      for (let o = 0; o < item.length; o++) {
        const columns = item[o];
        if (!columns.totalMaterial) {
          if (!columns.deviceId && !columns.dataCollected) {
            return 'Incorrect Format, No deviceId and unicDataCollected columns'
          }
          let boxObj:any = null;
          if (columns.boxId && columns.boxId.length < 2) {
            boxObj = boxTempIDs.find((u) => u.docID === columns.boxId);
            columns.fragmentId = boxObj?.fragmentId;
          } else if (columns.boxId && columns.boxId.length > 2) {
            const fragmentDataOne = {
              owner: columns.userId ?? idUser,
              box: columns.boxId,
              remainingFragment: columns.spentMaterial ?? 0,
              totalFragment: columns.spentMaterial ?? 0,
            }
            // eslint-disable-next-line no-await-in-loop
            const fragRespDataOne = await this.fragmentRepo.create(fragmentDataOne);
            columns.fragmentId = fragRespDataOne?._id;
          }
          const material = {
            device: columns.deviceId,
            fragment: columns.fragmentId ?? null,
            place: columns.placeId ?? null,
            user: columns.userId ?? null,
            task: columns.taskId ?? null,
            state: columns.state ?? 'free',
            installationDate: columns.installationDate ?? null,
            spentMaterial: columns.spentMaterial ?? 0,
            photos: columns.photos ?? null,
            dataCollected: JSON.parse(columns.dataCollected)
          }
          if (columns.spentMaterial && columns.boxId) {
            const remainingMaterial = Number(boxObj.total) - Number(columns.spentMaterial);
            // eslint-disable-next-line no-await-in-loop
            await this.boxesRepo.update(columns.boxId, { remainingMaterial });
            for (let z = 0; z < boxTempIDs.length; z++) {
              const u = boxTempIDs[z];
              if (u.dbId === columns.boxId) {
                boxTempIDs[z].total = String(remainingMaterial);
              }
            }
          }
          console.log('material', material)
          this.inventoriesRepo.create(material);
        } else {
          if (!columns.totalMaterial && !columns.deviceId) {
            return 'Incorrect Format, No deviceId and totalMaterial columns for box creation'
          }
          const boxData = {
            device: columns.deviceId,
            remainingMaterial: columns.totalMaterial ?? 0,
            totalMaterial: columns.totalMaterial ?? 0,
          }
          // eslint-disable-next-line no-await-in-loop
          const boxRespData = await this.boxesRepo.create(boxData);

          const fragmentData = {
            owner: columns.userId ?? idUser,
            box: boxRespData._id,
            remainingFragment: columns.spentMaterial ?? 0,
            totalFragment: columns.spentMaterial ?? 0,
          }
          // eslint-disable-next-line no-await-in-loop
          const fragRespData = await this.fragmentRepo.create(fragmentData);

          if (columns.boxId) boxTempIDs.push({ fragmentId: fragRespData._id, dbId: boxRespData._id, docID: columns.boxId, total: columns.totalMaterial })
        }
      }
    }
    return 'OK';
  }

  async update(req: Request, res: Response) {
    try {
      const { idUser } = res.locals.session;
      //const idUser = '6214416bc341eaa648916b15'
      const {
        place,
        task,
        spentMaterial,
        inRemplaceId,
        photos
      }: UpdateRequest = req.body;
      const { id } = req.params;

      const inventory = await this.inventoriesRepo.update(
        id,
        {
          place,
          task,
          spentMaterial,
          inRemplaceId,
          photos
        },
        idUser
      );
      res.send({ inventory });
    } catch (error) {
      console.log(error, res)
      sendErrorResponse(error, res);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { data }: {data:Array<UpdateUserRequest>} = req.body;
      const response = []
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        console.log({ item });
        // eslint-disable-next-line no-await-in-loop
        const inventory = await this.inventoriesRepo.updateUser(item.id, item.userId);
        response.push(inventory);
      }
      res.send({ data: response });
    } catch (error) {
      console.log(error, res)
      sendErrorResponse(error, res);
    }
  }
}
