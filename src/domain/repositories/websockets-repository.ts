/* eslint-disable no-unused-vars */
import FcmData from '../models/generic/fcm';

export default interface WebsocketsRepository {
  sendNotification(room: string, data: FcmData): void;
}
