/* eslint-disable semi */
/* eslint-disable no-unused-vars */
export default interface FirebaseRepository {
  createFirebaseToken(idUser: string, additionalData?: object): Promise<string | null>;
  verifyFirebaseToken(idToken: string): Promise<string | null>;
}
