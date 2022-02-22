import { Schema, model } from 'mongoose';
import Catalog, {
  placeCatalogType,
  PLACE_CATALOG_TYPE_LIST,
  stateCatalogType,
  STATE_CATALOG_TYPE_LIST,
  typeCatalogType,
  TYPE_CATALOG_TYPE_LIST
} from '../../../domain/models/catalog';

const defaultPlaceCatalogType: placeCatalogType = 'sucursal';
const defaultStateCatalog: stateCatalogType = 'empty';
const defaultTypeCatalog: typeCatalogType = 'controlled';

const schema = new Schema(
  {
    device: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    referenceModel: {
      type: String,
      required: true
    },
    dataToCollectInterface: {
      type: JSON,
      required: true
    },
    typePlace: {
      type: String,
      enum: PLACE_CATALOG_TYPE_LIST,
      default: defaultPlaceCatalogType
    },
    unitOfMeasurement: {
      type: String,
      required: true
    },
    state: {
      type: String,
      enum: STATE_CATALOG_TYPE_LIST,
      default: defaultStateCatalog
    },
    type: {
      type: String,
      enum: TYPE_CATALOG_TYPE_LIST,
      default: defaultTypeCatalog
    },
    categoryId: {
      ref: 'categories',
      type: Schema.Types.ObjectId,
      required: false
    },
  },
  { timestamps: true }
);

const Catalogs = model<Catalog>('catalog', schema);
export default Catalogs;
