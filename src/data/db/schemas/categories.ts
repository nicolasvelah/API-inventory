import { Schema, model } from 'mongoose';
import Categories from '../../../domain/models/categories';

const schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Category = model<Categories>('categories', schema);
export default Category;
