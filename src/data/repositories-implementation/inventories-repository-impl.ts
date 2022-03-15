import { DocumentDefinition, LeanDocument } from 'mongoose';
import Inventories from '../db/schemas/inventories';
import Fragments from '../db/schemas/fragments';
import Places from '../db/schemas/places';
import InventoriesRepository from '../../domain/repositories/inventories-repository';
import Inventory from '../../domain/models/inventory';

export default class InventoriesRepositoryImpl implements InventoriesRepository {
  create(data: DocumentDefinition<Inventory>): Promise<Inventory> {
    return Inventories.create(data);
  }

  async update(id: string, data: any, idUser: string): Promise<Inventory | null> {
    if (data.inRemplaceId) {
      const invOld = await Inventories.findById(data.inRemplaceId);
      if (!invOld) return null;
      invOld.state = 'unInstalled'
      await invOld.save();
    }

    if (!data.fragment) {
      const inv = await Inventories.findById(id);
      if (!inv) return null;
      inv.place = data.place ?? inv.place;
      inv.task = data.task ?? inv.task;
      inv.state = 'installed';
      await inv.save();
      await this.placeUpdate(data.place, id, data.inRemplaceId);

      return inv;
    }

    const fragment:any = await Fragments.findOne({ id: data.fragment.id })
      .populate('box');
    const newInventory = {
      state: 'installed',
      device: fragment.box.device,
      place: data.place,
      user: idUser,
      task: data.task,
      installationDate: new Date(),
      spentMaterial: data.fragment.spentMaterial,
      fragment: data.fragment.id
    }

    const fragmentInv = await Inventories.create(newInventory);

    await this.placeUpdate(data.place, fragmentInv._id, data.inRemplaceId);

    return fragmentInv;
  }

  async placeUpdate(placeId: string, idToAdd:string, inRemplaceId?:string | null): Promise<boolean | null> {
    const place:any = await Places.findById({ _id: placeId })
    if (!place) return null;
    if (inRemplaceId && place.IntalledMaterial) {
      for (let i = 0; i < place.IntalledMaterial.length; i++) {
        const placeMaterial = place.IntalledMaterial[i]
        if (String(placeMaterial) === inRemplaceId) {
          place.IntalledMaterial.splice(i, 1);
        }
      }
    }

    const { IntalledMaterial } = place;
    if (!IntalledMaterial) place.IntalledMaterial = [];
    if (!IntalledMaterial.includes(idToAdd)) place.IntalledMaterial.push(idToAdd);
    await place.save();
    //console.log({ place });
    return true
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Inventories.deleteOne({ _id: id });
    return (result.deletedCount ?? 0) > 0;
  }

  async getAll(): Promise<Inventory[]> {
    const material = await Inventories.find({})
      .populate('user', '-password')
      .populate('place')
      .populate('task')
      .populate('device');
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
}
