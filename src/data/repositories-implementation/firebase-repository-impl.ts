import FirebaseRepository from '../../domain/repositories/firebase-repository';
import FirebaseAdmin from '../providers/remote/firebase-admin';

export default class FirebaseRepositoryImpl implements FirebaseRepository {
  async createFirebaseToken(idUser: string, additionalData?: object): Promise<string | null> {
    const firebaseAdmin = FirebaseAdmin.getInstance();
    const token = await firebaseAdmin.createFirebaseToken(idUser, additionalData);
    return token;
  }
}
