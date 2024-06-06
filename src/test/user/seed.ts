import { AppDataSource } from '../../database/dbConnection';
import { Attachment, Project, ProjectAttachment, User } from '../../database/entity';
import { encryptString } from '../../utils/bcryptHelper';

export const seedUserData = async () => {
  await AppDataSource.initialize();
  await AppDataSource.synchronize(true);
  const entityManager = AppDataSource.manager;

  // Clear existing data
  await entityManager.delete(ProjectAttachment, {});
  await entityManager.delete(Attachment, {});
  await entityManager.delete(Project, {});
  await entityManager.delete(User, {});

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

  await AppDataSource.destroy();
};
