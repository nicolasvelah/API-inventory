import { DocumentDefinition, LeanDocument } from 'mongoose';
import Inventories from '../db/schemas/inventories';
import InventoriesRepository from '../../domain/repositories/inventories-repository';
import Inventory from '../../domain/models/inventory';

export default class InventoriesRepositoryImpl implements InventoriesRepository {
  create(data: DocumentDefinition<Inventory>): Promise<Inventory> {
    return Inventories.create(data);
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
        path: 'box',
        select: ['-createdAt', '-updatedAt', '-__v']
      })
      .populate({
        path: 'place',
        select: ['-createdAt', '-updatedAt', '-__v']
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
