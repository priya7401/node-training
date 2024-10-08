import { AppDataSource } from '../../database/dbConnection';
import { User } from '../../database/entity';
import { encryptString } from '../../utils/utils';

export const seedUserData = async () => {
  await AppDataSource.initialize();
  const entityManager = AppDataSource.manager;

  // Insert seed data
  const user1 = new User();
  user1.name = 'Test user 1';
  user1.email = 'test1@gmail.com';
  user1.mobile_number = '9888888881';
  user1.password = await encryptString('Password@123');
  await entityManager.save(user1);

  const user2 = new User();
  user2.name = 'Test user 2';
  user2.email = 'test2@gmail.com';
  user2.mobile_number = '9888888882';
  user2.password = await encryptString('Password@123');
  await entityManager.save(user2);
};
