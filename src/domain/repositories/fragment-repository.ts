/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { DocumentDefinition, LeanDocument } from 'mongoose';
import Fragment from '../models/fragment';

export default interface FragmentRepository {
  create(data: DocumentDefinition<Fragment>): Promise<Fragment>;
  getByUser(userId: string): Promise<LeanDocument<Fragment>[]>;
}
