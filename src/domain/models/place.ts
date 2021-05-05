import { Document } from 'mongoose';

export enum placeType {
  ATM = 'ATM',
  Sucursal = 'sucursal',
}

export default interface Place extends Document {
  name: string;
  latLong: [number, number];
  mainStreet: string;
  addressNumber: string;
  colony: string; //colonia
  municipality: string; //municipio
  city: string;
  state: string; //estado
  type: placeType.ATM | placeType.Sucursal;
  createdAt?: Date;
  updatedAt?: Date;
}
