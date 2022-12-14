/* eslint-disable no-shadow */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import Categories from './categories';

enum PlaceCatalogType {
  ATM,
  sucursal,
}
export type placeCatalogType = keyof typeof PlaceCatalogType
export const PLACE_CATALOG_TYPE_LIST = Object.keys(PlaceCatalogType);

enum StateCatalogType {
  stock,
  empty,
}
export type stateCatalogType = keyof typeof StateCatalogType
export const STATE_CATALOG_TYPE_LIST = Object.keys(StateCatalogType);

enum TypeCatalogType {
  controlled,
  notControlled,
}
export type typeCatalogType = keyof typeof TypeCatalogType
export const TYPE_CATALOG_TYPE_LIST = Object.keys(TypeCatalogType);

export default interface Catalog extends Document {
  device: string; // equipo
  brand: string;
  referenceModel: string;
  typePlace: placeCatalogType;
  unitOfMeasurement?: string;
  state?: stateCatalogType;
  type?: typeCatalogType;
  categoryId: Categories | string;
  createdAt?: Date;
  updatedAt?: Date;
}
