import { randomUUID } from 'crypto';
import { AppDataSource } from '../../database/dbConnection';
import { Project, User } from '../../database/entity';
import { encryptString } from '../../utils/utils';

export const seedAttachmentData = async () => {
  await AppDataSource.initialize();
  const entityManager = AppDataSource.manager;

  // Insert seed data
  // const project1 = new Project();
  // project1.temple_name = 'temple 1';
  // project1.temple_incharge_name = 'temple incharge 1';
  // project1.temple_incharge_number = '9999999991';
  // project1.location = 'temple 1 location';
  // project1.reg_num = 'TEM' + randomUUID().slice(0, 6);
  // await entityManager.save(project1);

  const user1 = new User();
  user1.name = 'Test user 6';
  user1.email = 'test6@gmail.com';
  user1.mobile_number = '9888888886';
  user1.password = await encryptString('Password@123');
  await entityManager.save(user1);
};
