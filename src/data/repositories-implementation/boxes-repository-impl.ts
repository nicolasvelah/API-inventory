import { DocumentDefinition } from 'mongoose';
import BoxesRepository from '../../domain/repositories/boxes-respository';
import Boxes from '../../domain/models/boxes';
import Box from '../db/schemas/boxes';

export default class BoxesRepositoryImpl implements BoxesRepository {
  create(data: DocumentDefinition<Boxes>): Promise<Boxes> {
    return Box.create(data);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Box.deleteOne({ _id: id });
    return (result.deletedCount ?? 0) > 0;
  }

  async getAll(): Promise<Boxes[]> {
    const boxes = await Box.find({})
      .populate({
        path: 'device',
        populate: {
          path: 'categoryId',
          select: ['-createdAt', '-updatedAt', '-__v']
        },
        select: ['-createdAt', '-updatedAt', '-__v']
      })
      .select(['-__v', '-createdAt', '-updatedAt']);
    return boxes;
  }

  async update(id: string, data: DocumentDefinition<Boxes>): Promise<Boxes | null> {
    const box = await Box.findById(id);
    if (!box) return null;

    box.remainingMaterial = data.remainingMaterial ?? box.remainingMaterial;
    box.totalMaterial = data.totalMaterial ?? box.totalMaterial;
    box.device = data.device ?? box.device;
    await box.save();

    return box;
  }
}
