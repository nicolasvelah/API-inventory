import { Schema, model } from 'mongoose';
import Place, { PLACE_TYPE_LIST, placeType } from '../../../domain/models/place';
import pointSchema from './point';

const defaultPlaceType: placeType = 'sucursal';

const schema = new Schema(
  {
    name: { type: String, required: true },
    coords: pointSchema,
    mainStreet: { type: String, required: true },
    addressNumber: { type: String, required: true },
    colony: { type: String, required: true },
    municipality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    type: {
      type: String,
      enum: PLACE_TYPE_LIST,
      default: defaultPlaceType
    },
    IntalledMaterial: [{
      ref: 'inventory',
      type: Schema.Types.ObjectId,
    }]
  },
  { timestamps: true }
);

const Places = model<Place>('place', schema);
export default Places;
