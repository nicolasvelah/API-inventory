import path from 'path';
import admin from 'firebase-admin';

export default class FirebaseAdmin {
  private static instance: FirebaseAdmin;

  constructor() {
    const keyFilename = path.join(__dirname, '../../../../pas-hq-backend-firebase-admin.json');
    admin.initializeApp({
      credential: admin.credential.cert(keyFilename)
    });
    /* this.client = new speech.SpeechClient({
      keyFilename,
      projectId: 'asistencias-vehiculares-tag',
    }); */
  }

  public static getInstance(): FirebaseAdmin {
    if (!FirebaseAdmin.instance) {
      FirebaseAdmin.instance = new FirebaseAdmin();
    }
    return FirebaseAdmin.instance;
  }

  async createFirebaseToken(idUser: string, additionalData?: object): Promise<string | null> {
    try {
      const token = await admin.auth().createCustomToken(idUser, additionalData);
      return token;
    } catch (error) {
      console.log('Error en createFirebaseToken:', error.message);
      return null;
    }
  }
}
