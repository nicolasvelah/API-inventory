import { DocumentDefinition } from 'mongoose';
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
    const places = await Inventories.find({});
    return places;
  }
}
