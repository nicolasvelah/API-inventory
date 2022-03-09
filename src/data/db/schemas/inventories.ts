import { Schema, model } from 'mongoose';
import Inventory, {
  inventoryStateType,
  INVENTORY_STATE_TYPE_LIST
} from '../../../domain/models/inventory';

const defaultInventoryState: inventoryStateType = 'installed';

const schema = new Schema(
  {
    device: {
      ref: 'catalog',
      type: Schema.Types.ObjectId,
      required: true
    },
    box: {
      ref: 'boxes',
      type: Schema.Types.ObjectId,
      required: false
    },
    place: {
      ref: 'place',
      type: Schema.Types.ObjectId,
      required: false
    },
    user: {
      ref: 'user',
      type: Schema.Types.ObjectId,
      required: false
    },
    task: {
      ref: 'task',
      type: Schema.Types.ObjectId,
      required: false
    },
    state: {
      type: String,
      enum: INVENTORY_STATE_TYPE_LIST,
      default: defaultInventoryState
    },
    installationDate: { type: Date, required: false },
    spentMaterial: { type: Number, required: false },
    photos: { type: JSON, required: false },
    dataCollected: { type: JSON, required: false },
  },
  { timestamps: true }
);

const Inventories = model<Inventory>('inventory', schema);
export default Inventories;
