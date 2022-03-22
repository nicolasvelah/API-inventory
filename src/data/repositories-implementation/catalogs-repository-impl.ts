import { DocumentDefinition } from 'mongoose';
import CatalogsRepository from '../../domain/repositories/catalogs-repository';
import Catalog from '../../domain/models/catalog';
import Catalogs from '../db/schemas/catalog';

export default class CatalogsRepositoryImpl implements CatalogsRepository {
  create(data: DocumentDefinition<Catalog>): Promise<Catalog> {
    return Catalogs.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Catalogs.deleteOne({ _id: id });
    return (result.deletedCount ?? 0) > 0;
  }

  async getAll(): Promise<Catalog[]> {
    const places = await Catalogs.find({})
      .populate({
        path: 'categoryId',
        select: ['-createdAt', '-updatedAt', '-__v']
      });
    return places;
  }
}
