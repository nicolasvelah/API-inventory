/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition } from 'mongoose';
import Inventory from '../models/inventory';

export default interface InventoriesRepository {
  create(data: DocumentDefinition<Inventory>): Promise<Inventory>;
  deleteById(id: string): Promise<boolean>;
  getAll(): Promise<Inventory[]>;
  getTaskInventory(id: string): Promise<Inventory[]>;
  getBy(id: string, type: string): Promise<Inventory[]>;
}
