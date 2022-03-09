import { Schema, model } from 'mongoose';
import Boxes from '../../../domain/models/boxes';

const schema = new Schema(
  {
    device: {
      type: String,
      required: true
    },
    remainingMaterial: { type: Number, required: false },
    totalMaterial: { type: Number, required: false }
  },
  { timestamps: true }
);

const Box = model<Boxes>('boxes', schema);
export default Box;
