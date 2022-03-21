/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import Place from './place';
import User from './user';
import Task from './task';
import Catalog from './catalog';
import Fragment from './fragment';

enum InventoryState {
  installed,
  free,
  damaged,
  onManteince,
  unInstalled
}
export type inventoryStateType = keyof typeof InventoryState;
export const INVENTORY_STATE_TYPE_LIST = Object.keys(InventoryState);

export default interface Inventory extends Document {
  device: Catalog | string;
  fragment?: Fragment | string;
  place?: Place | string | null;
  user?: User | string;
  task?: Task | string;
  state: inventoryStateType | string;
  installationDate?: Date;
  spentMaterial?: number;
  photos?: string[];
  dataCollected?: [JSON];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateRequest {
  place: string;
  task: string;
  spentMaterial?: number;
  inRemplaceId?: string;
  photos?: string[];
}
