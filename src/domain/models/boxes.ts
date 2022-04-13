/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import Catalog from './catalog';

export interface dataCollected extends Document {
  name: string;
  value: string;
}

export default interface Boxes extends Document {
  device?: Catalog | string;
  remainingMaterial?: number | null;
  totalMaterial?: number | null;
  dataCollected?: [dataCollected] | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface createRequest extends Document {
  catalogId: string;
  totalMaterial: number | null;
  dataCollected: [dataCollected];
}
