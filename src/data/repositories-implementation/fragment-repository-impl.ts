import { DocumentDefinition, LeanDocument } from 'mongoose';
import FragmentRepository from '../../domain/repositories/fragment-repository';
import Fragment from '../../domain/models/fragment';
import Fragments from '../db/schemas/fragments';

export default class FragmentRepositoryImpl implements FragmentRepository {
  create(data: DocumentDefinition<Fragment>): Promise<Fragment> {
    return Fragments.create(data);
  }

  async getByUser(id: string): Promise<LeanDocument<Fragment>[]> {
    const fragments = await Fragments.find({ owner: id })
      .populate({
        path: 'box',
        select: ['-createdAt', '-updatedAt', '-__v'],
        populate: {
          path: 'device',
          select: ['-createdAt', '-updatedAt', '-__v'],
          populate: {
            path: 'categoryId',
            select: ['-createdAt', '-updatedAt', '-__v']
          }
        },
      })
      .select(['-owner', '-__v', '-createdAt', '-updatedAt'])
      .lean();

    return fragments;
  }
}
