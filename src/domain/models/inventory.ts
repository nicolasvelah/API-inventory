/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import Place from './place';
import User from './user';
import Task from './task';
import Catalogue from './catalogue';

enum InventoryState {
  installed,
  free,
  damaged
}
export type inventoryStateType = keyof typeof InventoryState;
export const INVENTORY_STATE_TYPE_LIST = Object.keys(InventoryState);

export default interface Inventory extends Document {
  device: Catalogue;
  place: Place;
  user: User;
  task: Task;
  state: inventoryStateType;
  dataCollected: Object;
  createdAt?: Date;
  updatedAt?: Date;
}
