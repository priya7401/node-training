import dotenv from 'dotenv';

const pathToEnv = `.env.${process.env.NODE_ENV}`;
process.env.NODE_ENV ? dotenv.config({ path: pathToEnv }) : dotenv.config({ path: `.env` });

dotenv.config();

export const AppConstants = {
  nodeEnv: process.env.NODE_ENV,
  apiPort: Number(process.env.PORT),
  postgresHost: process.env.POSTGRES_HOST,
  postgresPort: Number(process.env.POSTGRES_PORT),
  postgresUsername: process.env.POSTGRES_USERNAME,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresDB: process.env.POSTGRES_DATABASE,
  saltRounds: Number(process.env.SALT_ROUNDS),
  jwtTokenKey: process.env.JWT_TOKEN_KEY,
  AWSaccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AWSsecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  AWSregion: process.env.S3_REGION,
  AWSbucket: process.env.S3_BUCKET,
};

export enum ProjectStatus {
  proposed = 'proposed',
  planned = 'planned',
  active = 'active',
  completed = 'completed',
  scrapped = 'scrapped',
}

export enum ProjectAttachmentType {
  temple_images = 'temple_images',
  project_documents = 'project_documents',
  temple_main_image = 'temple_main_image',
}

export enum ModuleType {
  project = 'project',
  donor = 'donor',
  payment = 'payment',
  role = 'role',
  permission = 'permission',
  attachment = 'attachment',
  auth = 'auth',
}

export enum CRUDOperation {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

export enum Role {
  admin = 'admin',
  donor = 'donor',
}
