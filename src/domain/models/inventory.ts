/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import Place from './place';
import User from './user';
import Task from './task';
import Catalog from './catalog';

enum InventoryState {
  installed,
  free,
  damaged
}
export type inventoryStateType = keyof typeof InventoryState;
export const INVENTORY_STATE_TYPE_LIST = Object.keys(InventoryState);

export interface Photos {
  url: string;
  fecha: Date;
  description: string;
}

export default interface Inventory extends Document {
  device: Catalog;
  place?: Place;
  user?: User;
  task?: Task;
  state: inventoryStateType;
  installationDate?: Date;
  spentMaterial?: number;
  remainingMaterial?: number;
  totalMaterial?: number;
  photos?: Photos;
  dataCollected?: JSON;
  createdAt?: Date;
  updatedAt?: Date;
}