/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition, LeanDocument } from 'mongoose';
import Inventory, { UpdateRequest } from '../models/inventory';

export default interface InventoriesRepository {
  create(data: DocumentDefinition<Inventory>): Promise<Inventory>;
  updateUser(id: string, idUser: string): Promise<Inventory | Object | null>;
  update(id: string, data: UpdateRequest, idUser: string): Promise<Inventory | Object | null>;
  deleteById(id: string): Promise<boolean>;
  getAll(): Promise<LeanDocument<Inventory>[]>;
  getTaskInventory(id: string): Promise<Inventory[]>;
  getByUser(id: string, state: string): Promise<LeanDocument<Inventory>[]>;
  getByFragment(id:string): Promise<LeanDocument<Inventory>[]>;
}
