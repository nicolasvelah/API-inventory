/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';

enum PlaceType {
  ATM,
  sucursal
}
export type placeType = keyof typeof PlaceType;
export const PLACE_TYPE_LIST = Object.keys(PlaceType);

export default interface Place extends Document {
  name: string;
  latLong: {
    type: 'Point';
    coordinates: Number[];
  };
  mainStreet: string;
  addressNumber: string;
  colony: string;
  municipality: string;
  city: string;
  state: string;
  type: placeType;
  createdAt?: Date;
  updatedAt?: Date;
}
