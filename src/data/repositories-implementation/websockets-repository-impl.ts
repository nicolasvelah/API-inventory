import WebsocketsRepository from '../../domain/repositories/websockets-repository';
import Websockets from '../providers/local/websockets';

export default class WebsocketsRepositoryImpl implements WebsocketsRepository {
  private provider: Websockets;

  constructor(provider: Websockets) {
    this.provider = provider;
  }

  sendNotification(room: string, data: any): void {
    this.provider.sendNotificationTo(room, data);
  }
}
