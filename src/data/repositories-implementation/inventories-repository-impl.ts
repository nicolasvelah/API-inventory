import { DocumentDefinition, LeanDocument } from 'mongoose';
import Inventories from '../db/schemas/inventories';
import Fragments from '../db/schemas/fragments';
import Boxes from '../db/schemas/boxes';
import Places from '../db/schemas/places';
import InventoriesRepository from '../../domain/repositories/inventories-repository';
import Inventory, { UpdateRequest } from '../../domain/models/inventory';

export default class InventoriesRepositoryImpl implements InventoriesRepository {
  create(data: DocumentDefinition<Inventory>): Promise<Inventory> {
    return Inventories.create(data);
  }

  async updateUser(id: string, idUser: string): Promise<Inventory | Object | null> {
    const inv = await Inventories.findById(id);
    if (!inv) throw { code: 406, message: `${id} is not a Inventory id or id dont exist` };
    inv.user = idUser;
    await inv.save();
    return inv;
  }

  async update(id: string, data: UpdateRequest, idUser: string): Promise<Inventory | Object | null> {
    if (data.inRemplaceId) {
      const invOld = await Inventories.findById(data.inRemplaceId);
      if (!invOld) throw { code: 406, message: `${id} is not a Inventory id or id dont exist to be remplace` };
      invOld.state = 'unInstalled'
      await invOld.save();
    }

    if (!data.spentMaterial) {
      const inv = await Inventories.findById(id);
      if (!inv) throw { code: 406, message: `${id} is not a Inventory id or id dont exist` };
      inv.place = data.place ?? inv.place;
      inv.task = data.task ?? inv.task;
      inv.state = 'installed';
      await inv.save();
      await this.placeUpdate(data.place, id, data.inRemplaceId);

      return inv;
    }

    const fragment:any = await Fragments.findOne({ _id: id })
      .populate('box');
    if (!fragment) throw { code: 406, message: `${id} is not a Fragment id or id dont exist` };
    if (fragment.remainingFragment < data.spentMaterial) throw { code: 406, message: `${data.spentMaterial} is to much, we have ${fragment.remainingFragment} in this fragment` };
    fragment.remainingFragment -= data.spentMaterial;
    const box:any = await Boxes.findOne({ _id: fragment.box._id })
    if (box.remainingMaterial < data.spentMaterial) throw { code: 406, message: `${data.spentMaterial} is to much, we have ${box.remainingMaterial} in this Box` };
    box.remainingMaterial -= data.spentMaterial;
    await box.save();
    await fragment.save();
    const newInventory = {
      state: 'installed',
      device: fragment.box.device,
      place: data.place,
      user: idUser,
      task: data.task,
      installationDate: new Date(),
      spentMaterial: data.spentMaterial,
      fragment: id
    }

    const fragmentInv = await Inventories.create(newInventory);
    await this.placeUpdate(data.place, fragmentInv._id, data.inRemplaceId);

    return { fragment: fragmentInv, remainingFragment: fragment.remainingFragment };
  }

  async placeUpdate(placeId: string, idToAdd:string, inRemplaceId?:string | null): Promise<boolean | null> {
    const place:any = await Places.findById({ _id: placeId })
    const { IntalledMaterial } = place;

    if (!place) return null;
    if (inRemplaceId && IntalledMaterial) {
      for (let i = 0; i < IntalledMaterial.length; i++) {
        const placeMaterial = IntalledMaterial[i]
        if (String(placeMaterial) === inRemplaceId) {
          place.IntalledMaterial.splice(i, 1);
        }
      }
    }
    if (!IntalledMaterial) place.IntalledMaterial = [];
    if (!IntalledMaterial.includes(idToAdd)) place.IntalledMaterial.push(idToAdd);
    await place.save();
    return true
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Inventories.deleteOne({ _id: id });
    return (result.deletedCount ?? 0) > 0;
  }

  async getAll(): Promise<LeanDocument<Inventory>[]> {
    const material = await Inventories.find({})
      .populate({
        path: 'device',
        populate: {
          path: 'categoryId',
          select: ['-createdAt', '-updatedAt', '-__v']
        },
        select: ['-createdAt', '-updatedAt', '-__v']
      })
      .populate({
        path: 'fragment',
        select: ['-createdAt', '-updatedAt', '-__v', '-owner'],
        populate: [
          {
            path: 'box',
            select: ['-createdAt', '-updatedAt', '-__v', '-device'],
          }
        ]
      })
      .populate({
        path: 'place',
        select: ['-createdAt', '-updatedAt', '-__v', '-IntalledMaterial']
      })
      .populate({
        path: 'task',
        select: ['-createdAt', '-updatedAt', '-__v']
      })
      .select(['-user', '-state', '-__v', '-createdAt', '-updatedAt'])
      .lean();
    return material;
  }

  async getByUser(id: string, state: string): Promise<LeanDocument<Inventory>[]> {
    let place = null;
    if (state !== 'free') {
      place = { $ne: null }
    }
    const inventory = await Inventories.find({ user: id, place })
      .populate({
        path: 'device',
        populate: {
          path: 'categoryId',
          select: ['-createdAt', '-updatedAt', '-__v']
        },
        select: ['-createdAt', '-updatedAt', '-__v']
      })
      .populate({
        path: 'fragment',
        select: ['-createdAt', '-updatedAt', '-__v', '-owner'],
        populate: [
          {
            path: 'box',
            select: ['-createdAt', '-updatedAt', '-__v', '-device'],
          }
        ]
      })
      .populate({
        path: 'place',
        select: ['-createdAt', '-updatedAt', '-__v', '-IntalledMaterial']
      })
      .populate({
        path: 'task',
        select: ['-createdAt', '-updatedAt', '-__v']
      })
      .select(['-user', '-state', '-__v', '-createdAt', '-updatedAt'])
      .lean();
    return inventory;
  }

  async getTaskInventory(id: string): Promise<Inventory[]> {
    const material = await Inventories.find({ task: id })
      .populate('device')
      .populate('box', '-device');
    return material;
  }

  async getByFragment(id:string): Promise<LeanDocument<Inventory>[]> {
    const material = await Inventories.find({ fragment: id })
      .populate({
        path: 'place',
        select: ['-createdAt', '-updatedAt', '-__v', '-IntalledMaterial']
      })
      .populate({
        path: 'task',
        select: ['-createdAt', '-updatedAt', '-__v']
      })
      .select(['-user', '-state', '-__v', '-createdAt', '-updatedAt', '-fragment', '-device'])
      .lean();
    return material;
  }
}
