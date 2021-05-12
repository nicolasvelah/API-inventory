/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import socketIO, { Namespace, Socket } from 'socket.io';
import { Server } from 'http';
import FirebaseRepository from '../../../domain/repositories/firebase-repository';

export default class Websockets {
  private nsp: Namespace | null;

  private firebaseRepo: FirebaseRepository;

  constructor(name: string, server: Server, firebaseRepo: FirebaseRepository) {
    const ioServer = socketIO(server);
    ioServer.origins('*:*');
    this.nsp = ioServer.of(name);
    this.firebaseRepo = firebaseRepo;
    this.checkAuth(this.nsp, this.firebaseRepo);
    this.onConnection(this.nsp);
  }

  private checkAuth = (nsp: Namespace, firebaseRepo: FirebaseRepository): void => {
    nsp.use(async (socket: Socket, next) => {
      try {
        const { token }: { token: string } = socket.handshake.query as any;
        if (token) {
          const idUser = await firebaseRepo.verifyFirebaseToken(token);
          if (!idUser) throw { code: 401, message: 'WS access denied' };
          // eslint-disable-next-line no-param-reassign
          (socket.handshake.query as any).data = {
            idUser
          };
          next();
        }
      } catch (e) {
        console.warn('WS ERROR', e.message);
        socket.error(e.message);
        socket.disconnect(true);
      }
    });
  };

  private onConnection = (nsp: Namespace): void => {
    nsp.on('connection', (socket: Socket) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { idUser }: { idUser: string; } = (socket.handshake.query as any).data;
      socket.join(idUser);
      nsp.to(socket.id).emit('connected', socket.id); // emit conneted event
    });
  };

  sendNotificationTo = (room: string, data: any): void => {
    this.nsp!.to(room).emit('on-notification', data);
  };
}
