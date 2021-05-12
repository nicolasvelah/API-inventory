import { Schema, model } from 'mongoose';
import Task, { TASK_TYPE_LIST, taskType } from '../../../domain/models/task';
import pointSchema from './point';

const defaultType: taskType = 'maintenance';

const schema = new Schema(
  {
    technical: {
      ref: 'user',
      type: Schema.Types.ObjectId,
      required: true
    },
    place: {
      ref: 'place',
      type: Schema.Types.ObjectId,
      required: true
    },
    scheduledDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    arrivalLatLong: pointSchema,
    arrivalPhoto: { type: String, required: true },
    closedDate: { type: Date, required: true },
    closedLatLong: pointSchema,
    closedPhoto: { type: String, required: true },
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
