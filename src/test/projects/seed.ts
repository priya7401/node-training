import { randomUUID } from 'crypto';
import { AppDataSource } from '../../database/dbConnection';
import { Attachment, Project, ProjectAttachment, User } from '../../database/entity';

export const seedProjectsData = async () => {
  await AppDataSource.initialize();
  await AppDataSource.synchronize(true);
  const entityManager = AppDataSource.manager;

  // Clear existing data
  // await entityManager.delete(ProjectAttachment, {});
  // await entityManager.delete(Attachment, {});
  // await entityManager.delete(Project, {});
  // await entityManager.delete(User, {});

  // Insert seed data
  const project1 = new Project();
  project1.temple_name = 'temple 1';
  project1.temple_incharge_name = 'temple incharge 1';
  project1.temple_incharge_number = '9999999991';
  project1.location = 'temple 1 location';
  project1.reg_num = 'TEM' + randomUUID().slice(0, 6);
  await entityManager.save(project1);

  const project2 = new Project();
  project2.temple_name = 'temple 2';
  project2.temple_incharge_name = 'temple incharge 1';
  project2.temple_incharge_number = '9999999992';
  project2.location = 'temple 2 location';
  project2.reg_num = 'TEM' + randomUUID().slice(0, 6);
  await entityManager.save(project2);

  // await AppDataSource.destroy();
};
