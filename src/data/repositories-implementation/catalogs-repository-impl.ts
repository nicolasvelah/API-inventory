import { DocumentDefinition } from 'mongoose';
import CatalogsRepository from '../../domain/repositories/catalogs-repository';
import Catalogue from '../../domain/models/catalogue';
import Catalogs from '../db/schemas/catalogs';

export default class CatalogsRepositoryImpl implements CatalogsRepository {
  create(data: DocumentDefinition<Catalogue>): Promise<Catalogue> {
    return Catalogs.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Catalogs.deleteOne({ _id: id });
    return (result.deletedCount ?? 0) > 0;
  }

  async getAll(): Promise<Catalogue[]> {
    const places = await Catalogs.find({});
    return places;
  }
}
