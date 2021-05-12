/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { Server } from 'http';

import UsersRepositoryImpl from './data/repositories-implementation/users-repository-impl';
import UsersRepository from './domain/repositories/users-repository';
import PlacesRepositoryImpl from './data/repositories-implementation/places-repository-impl';
import PlacesRepository from './domain/repositories/places-repository';
import Get from './helpers/get';
import TasksRepository from './domain/repositories/tasks-repository';
import TasksRepositoryImpl from './data/repositories-implementation/tasks-repository-impl';
import InventoriesRepository from './domain/repositories/inventories-repository';
import InventoriesRepositoryImpl from './data/repositories-implementation/inventories-repository-impl';
import CatalogsRepository from './domain/repositories/catalogs-repository';
import CatalogsRepositoryImpl from './data/repositories-implementation/catalogs-repository-impl';
import FirebaseRepository from './domain/repositories/firebase-repository';
import FirebaseRepositoryImpl from './data/repositories-implementation/firebase-repository-impl';
import WebsocketsRepository from './domain/repositories/websockets-repository';
import Websockets from './data/providers/local/websockets';
import WebsocketsRepositoryImpl from './data/repositories-implementation/websockets-repository-impl';

export enum Dependencies {
  users = 'users',
  places = 'places',
  tasks = 'tasks',
  inventories = 'inventories',
  catalogs = 'catalogs',
  firebase = 'firebase',
  websockets = 'websockets'
}

const injectDependencies = (nameWs: string, server: Server) => {
  const firebaseRepo = new FirebaseRepositoryImpl();
  const websockets = new Websockets(nameWs, server, firebaseRepo);
  Get.put<UsersRepository>(new UsersRepositoryImpl(), Dependencies.users);
  Get.put<PlacesRepository>(new PlacesRepositoryImpl(), Dependencies.places);
  Get.put<TasksRepository>(new TasksRepositoryImpl(), Dependencies.tasks);
  Get.put<InventoriesRepository>(new InventoriesRepositoryImpl(), Dependencies.inventories);
  Get.put<CatalogsRepository>(new CatalogsRepositoryImpl(), Dependencies.catalogs);
  Get.put<FirebaseRepository>(firebaseRepo, Dependencies.firebase);
  Get.put<WebsocketsRepository>(new WebsocketsRepositoryImpl(websockets), Dependencies.websockets);
};

export default injectDependencies;
