import { Schema, model } from 'mongoose';
import Task, { TASK_TYPE_LIST, taskType } from '../../../domain/models/task';

const defaultType: taskType = 'maintenance';

const schema = new Schema(
  {
    user: {
      ref: 'user',
      type: Schema.Types.ObjectId
    },
    task: {
      ref: 'task',
      type: Schema.Types.ObjectId
    },
    scheduledDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    arrivalLatLong: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    arrivalPhoto: { type: String, required: true },
    closeDate: { type: Date, required: true },
    closeLatLong: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    closePhoto: { type: String, required: true },
    type: {
      type: String,
      enum: TASK_TYPE_LIST,
      default: defaultType
    }
  },
  { timestamps: true }
);

const Tasks = model<Task>('task', schema);
export default Tasks;
