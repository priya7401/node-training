import { randomUUID } from 'crypto';
import { AppDataSource } from '../../database/dbConnection';
import { Attachment, Project, User } from '../../database/entity';
import { encryptString } from '../../utils/utils';

export const seedAttachmentData = async () => {
  await AppDataSource.initialize();
  const entityManager = AppDataSource.manager;

  const attachment1 = new Attachment();
  attachment1.file_name = 'test_file_1.pdf';
  attachment1.file_type = 'application/pdf';
  attachment1.s3_key = '1716995190939-de0e90bb-6e6c-4600-96ce-b93b04ae2ecd-test_file_1.pdf';
  await entityManager.save(attachment1);

  const attachment2 = new Attachment();
  attachment2.file_name = 'test_file_2.pdf';
  attachment2.file_type = 'application/pdf';
  attachment2.s3_key = '1716996234209-8f99ac93-20c3-4ac2-93c5-e9a1d4123368-test_file_2.pdf';
  await entityManager.save(attachment2);

  const attachment3 = new Attachment();
  attachment3.file_name = 'test_file_3.pdf';
  attachment3.file_type = 'application/pdf';
  attachment3.s3_key = '1717168414132-594396a9-5ae4-489a-bb71-e711935cabdf-test_file_3.pdf';
  await entityManager.save(attachment3);

  const user1 = new User();
  user1.name = 'Test user 6';
  user1.email = 'test6@gmail.com';
  user1.mobile_number = '9888888886';
  user1.password = await encryptString('Password@123');
  await entityManager.save(user1);

  const project1 = new Project();
  project1.temple_name = 'temple 4';
  project1.temple_incharge_name = 'temple incharge 4';
  project1.temple_incharge_number = '9999999994';
  project1.location = 'temple 4 location';
  project1.reg_num = 'TEM' + randomUUID().slice(0, 6);
  await entityManager.save(project1);
};
