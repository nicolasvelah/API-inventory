import { DocumentDefinition, Types } from 'mongoose';
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

  async getBy(id: string, type: string): Promise<Inventory[]> {
    let query:any = null;
    const OId = Types.ObjectId(id);
    const unwindString = `$${type}`;
    switch (type) {
      case 'task':
        query = { 'task._id': OId }
        break;
      case 'device':
        query = { 'device._id': OId }
        break;
      case 'place':
        query = { 'place._id': OId }
        break;
      default:
        query = { 'user._id': OId }
        break;
    }
    const material = await Inventories.aggregate([
      // join users
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      // join tasks
      {
        $lookup: {
          from: 'tasks',
          localField: 'task',
          foreignField: '_id',
          as: 'task'
        }
      },
      // join place
      {
        $lookup: {
          from: 'places',
          localField: 'place',
          foreignField: '_id',
          as: 'place'
        }
      },
      // join devices
      {
        $lookup: {
          from: 'devices',
          localField: 'device',
          foreignField: '_id',
          as: 'device'
        }
      },
      {
        $unwind: unwindString
      },
      // filtramos solo los de la variable userId
      { $match: query }
    ])
    return material;
  }
}
