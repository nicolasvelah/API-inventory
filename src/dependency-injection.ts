/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import UsersRepositoryImpl from './data/repositories-implementation/users-repository-impl';
import UsersRepository from './domain/repositories/users-repository';
import PlacesRepositoryImpl from './data/repositories-implementation/places-repository-impl';
import PlacesRepository from './domain/repositories/places-repository';
import Get from './helpers/get';
import TasksRepository from './domain/repositories/tasks-repository';
import TasksRepositoryImpl from './data/repositories-implementation/tasks-repository-impl';
import InventoriesRepository from './domain/repositories/inventories-repository';
import InventoriesRepositoryImpl from './data/repositories-implementation/inventories-repository-impl';

export enum Dependencies {
  users = 'users',
  places = 'places',
  tasks = 'tasks',
  inventories = 'inventories'
}

const injectDependencies = () => {
  Get.put<UsersRepository>(new UsersRepositoryImpl(), Dependencies.users);
  Get.put<PlacesRepository>(new PlacesRepositoryImpl(), Dependencies.places);
  Get.put<TasksRepository>(new TasksRepositoryImpl(), Dependencies.tasks);
  Get.put<InventoriesRepository>(new InventoriesRepositoryImpl(), Dependencies.inventories);
};

export default injectDependencies;
