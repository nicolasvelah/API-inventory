import { connect } from 'mongoose';

export default class MongoDb {
  static async connect(uri: string): Promise<boolean> {
    try {
      if (uri === '') throw new Error('The URL does not exist');

      const conn = await connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
      });

      return !!conn.connection;
    } catch (e) {
      console.error('Error en connect MongoDB:', e.message);
      return false;
    }
  }
}
