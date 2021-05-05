import { Schema, model } from 'mongoose';
import Place, { PLACE_TYPE_LIST, placeType } from '../../../domain/models/place';

const defaultPlaceType: placeType = 'sucursal';

const schema = new Schema(
  {
    name: { type: String, required: true },
    latLong: {
      type: [Number],
      required: true
    },
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
    }
  },
  { timestamps: true }
);

const Places = model<Place>('place', schema);
export default Places;
