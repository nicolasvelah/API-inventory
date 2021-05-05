/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import UsersRepositoryImpl from './data/repositories-implementation/users-repository-impl';
import UsersRepository from './domain/repositories/users-repository';
import PlacesRepositoryImpl from './data/repositories-implementation/places-repository-impl';
import PlacesRepository from './domain/repositories/places-repository';
import Get from './helpers/get';

export enum Dependencies {
  users = 'users',
  places = 'places'
}

const injectDependencies = () => {
  Get.put<UsersRepository>(new UsersRepositoryImpl(), Dependencies.users);
  Get.put<PlacesRepository>(new PlacesRepositoryImpl(), Dependencies.places);
};

export default injectDependencies;
