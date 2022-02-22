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
    coordinator: {
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
    arrivalDate: { type: Date },
    arrivalLatLong: pointSchema,
    arrivalPhoto: { type: String },
    closedDate: { type: Date },
    closedLatLong: pointSchema,
    closedPhoto: { type: String },
    certificatePhoto: { type: String },
    emnployeePhoto: { type: String },
    type: {
      type: String,
      enum: TASK_TYPE_LIST,
      default: defaultType
    },
    description: { type: String }
  },
  { timestamps: true }
);

const Tasks = model<Task>('task', schema);
export default Tasks;
