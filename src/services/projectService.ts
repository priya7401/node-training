import { FindManyOptions, In, Like } from 'typeorm';
import { ProjectStatus } from '../config/appConstants';
import { Meta } from '../config/types';
import { AppDataSource } from '../database/dbConnection';
import { Project } from '../database/entity/Project';
import { ProjectAttachment } from '../database/entity/ProjectAttachment';
import { ProjectInterface, projectSelectColumns } from '../database/models/project';
import { ProjectAttachmentInterface, projectAttachmentSelectColumns } from '../database/models/projectAttachment';
import { getMetaData } from '../utils/utils';

const projectRepository = AppDataSource.getRepository(Project);
const projectAttachmentRepository = AppDataSource.getRepository(ProjectAttachment);

export const getProjects = async (status: ProjectStatus, meta: Meta, searchKeyword: string) => {
  const whereCondition = [
    { reg_num: Like(`%${searchKeyword}%`), status },
    { temple_name: Like(`%${searchKeyword}%`), status },
    { location: Like(`%${searchKeyword}%`), status },
  ];

  const queryOptions: FindManyOptions = {
    relations: ['project_attachments', 'project_attachments.attachment'],
    where: whereCondition,
  };

  if (meta.page && meta.per_page) {
    queryOptions.skip = (meta.page - 1) * meta.per_page;
    queryOptions.take = meta.per_page;
  }

  const [projects, total] = await projectRepository.findAndCount(queryOptions);

  const metaObject = getMetaData(meta, total);
  return { projects, metaObject };
};

export const createProject = async (projectDetails: ProjectInterface) => {
  const project = projectRepository.create(projectDetails);
  return await projectRepository.save(project);
};

export const getProjectById = async (id: number) => {
  return await projectRepository.findOne({ where: { id }, relations: ['project_attachments', 'project_attachments.attachment'] });
};

export const updateProject = async (id: number, projectDetails: ProjectInterface) => {
  const updatedProject = await AppDataSource.createQueryBuilder()
    .update(Project)
    .set(projectDetails)
    .where('id = :id', { id: id })
    .returning(projectSelectColumns)
    .execute();
  const project = updatedProject.raw[0];
  return project;
};

export const deleteProject = async (id: number) => {
  return await projectRepository.delete({ id });
};

export const createProjectAttachment = async (attachments: ProjectAttachmentInterface[]) => {
  const projectAttachments = await projectAttachmentRepository
    .createQueryBuilder()
    .insert()
    .into(ProjectAttachment)
    .values(attachments)
    .returning(projectAttachmentSelectColumns)
    .execute();
  return projectAttachments.generatedMaps;
};

export const getProjectAttachments = async (ids: number[]) => {
  return await projectAttachmentRepository.find({
    where: { id: In(ids) },
    relations: ['project', 'attachment'],
    select: { project: { id: true } },
  });
};
