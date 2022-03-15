/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import Catalog from './catalog';

export default interface Boxes extends Document {
  device?: Catalog | string;
  remainingMaterial?: number | null;
  totalMaterial?: number | null;
  dataCollected?: [JSON] | null;
  createdAt?: Date;
  updatedAt?: Date;
}
