import UsersRepositoryImpl from './data/repositories-implementation/users-repository-impl';
import UsersRepository from './domain/repositories/users-repository';
import Get from './helpers/get';

export enum Dependencies {
  users = 'users',
}

const injectDependencies = () => {
  Get.put<UsersRepository>(new UsersRepositoryImpl(), Dependencies.users);
};
