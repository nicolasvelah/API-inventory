import { Schema, model } from 'mongoose';
import Place, { placeType } from '../../../domain/models/place';

const schema = new Schema(
  {
    name: { type: String, required: true },
    latLong: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    mainStreet: { type: String, required: true },
    addressNumber: { type: String, required: true },
    colony: { type: String, required: true },
    municipality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    type: {
      type: String,
      enum: [placeType.ATM, placeType.Sucursal],
      default: placeType.Sucursal,
    },
  },
  { timestamps: true }
);

const Places = model<Place>('place', schema);
export default Places;
