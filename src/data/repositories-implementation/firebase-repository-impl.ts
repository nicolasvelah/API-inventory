import FirebaseRepository from '../../domain/repositories/firebase-repository';
import FirebaseAdmin from '../providers/remote/firebase-admin';

export default class FirebaseRepositoryImpl implements FirebaseRepository {
  private firebaseAdmin = FirebaseAdmin.getInstance();

  async verifyFirebaseToken(idToken: string): Promise<string | null> {
    return this.firebaseAdmin.verifyFirebaseToken(idToken);
  }

  async createFirebaseToken(idUser: string, additionalData?: object): Promise<string | null> {
    const token = await this.firebaseAdmin.createFirebaseToken(idUser, additionalData);
    return token;
  }
}
