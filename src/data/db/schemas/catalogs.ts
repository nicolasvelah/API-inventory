import { Schema, model } from 'mongoose';
import Catalogue, {
  placeCatalogueType,
  PLACE_CATALOGUE_TYPE_LIST
} from '../../../domain/models/catalogue';

const defaultPlaceCatalogueType: placeCatalogueType = 'sucursal';

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
      type: Object,
      required: true
    },
    typePlace: {
      type: String,
      enum: PLACE_CATALOGUE_TYPE_LIST,
      default: defaultPlaceCatalogueType
    }
  },
  { timestamps: true }
);

const Catalogs = model<Catalogue>('catalogue', schema);
export default Catalogs;
