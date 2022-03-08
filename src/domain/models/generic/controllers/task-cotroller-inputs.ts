import User from '../../user';
import Place from '../../place';
import Point from '../../point';
import { taskType } from '../../task'

export interface UpdateTask {
  technical?: User;
  coordinator?: User;
  place?: Place;
  scheduledDate?: Date | null;
  arrivalDate?: Date | null;
  arrivalLatLong?: Point;
  arrivalPhoto?: string | null;
  closedDate?: Date | null;
  closedLatLong?: Point;
  closedPhoto?: string | null;
  certificatePhoto?: string | null;
  emnployeePhoto?: string | null;
  type?: taskType;
  description?: string | null;
}
