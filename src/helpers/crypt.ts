import bcrypt from 'bcrypt';

export default class Crypt {
  static async encryptPassword(password: string): Promise<string | null> {
    try {
      const salt = await bcrypt.genSalt(10);
      const encrypted = await bcrypt.hash(password, salt);
      return encrypted;
    } catch (error) {
      console.log('Error encryptPassword:', error.message);
      return null;
    }
  }

  static async matchPassword(password: string, passwordEncrypted: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, passwordEncrypted);
    } catch (error) {
      console.log('Error matchPassword:', error.message);
      return false;
    }
  }
}
