import { Schema, model } from 'mongoose';
import Inventory, {
  inventoryStateType,
  INVENTORY_STATE_TYPE_LIST
} from '../../../domain/models/inventory';

const defaultInventoryState: inventoryStateType = 'installed';

const schema = new Schema(
  {
    device: {
      ref: 'catalogue',
      type: Schema.Types.ObjectId,
      required: true
    },
    place: {
      ref: 'place',
      type: Schema.Types.ObjectId,
      required: true
    },
    user: {
      ref: 'user',
      type: Schema.Types.ObjectId,
      required: true
    },
    task: {
      ref: 'task',
      type: Schema.Types.ObjectId,
      required: true
    },
    state: {
      type: String,
      enum: INVENTORY_STATE_TYPE_LIST,
      default: defaultInventoryState
    },
    dataCollected: { type: Object, required: true }
  },
  { timestamps: true }
);

const Inventories = model<Inventory>('inventory', schema);
export default Inventories;
