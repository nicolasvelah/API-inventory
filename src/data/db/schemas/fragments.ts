import { Schema, model } from 'mongoose';
import Fragments from '../../../domain/models/fragment';

const schema = new Schema(
  {
    owner: {
      ref: 'user',
      type: Schema.Types.ObjectId,
      required: true
    },
    box: {
      ref: 'boxes',
      type: Schema.Types.ObjectId,
      required: true
    },
    remainingFragment: { type: Number, required: false },
    totalFragment: { type: Number, required: false }
  },
  { timestamps: true }
);

const Fragment = model<Fragments>('fragments', schema);
export default Fragment;
