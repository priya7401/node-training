import { FindManyOptions, In, Like } from 'typeorm';
import { ProjectStatus } from '../config/appConstants';
import { Meta } from '../config/types';
import { AppDataSource } from '../database/dbConnection';
import { Project } from '../database/entity/Project';
import { ProjectAttachment } from '../database/entity/ProjectAttachment';
import { ProjectAttachmentInterface, ProjectInterface, projectAttachmentSelectColumns } from '../database/models';

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

  meta.total_pages = Math.ceil(total / (meta.per_page ?? 1));
  meta.total_count = total;
  if (meta.page < meta.total_pages) {
    meta.next_page = meta.page + 1;
  } else {
    meta.next_page = null;
  }
  meta.per_page = undefined;
  return { projects, meta };
};

export const createProject = async (projectDetails: ProjectInterface) => {
  const project = projectRepository.create(projectDetails);
  return await projectRepository.save(project);
};

export const getProjectById = async (id: number) => {
  return await projectRepository.findOne({ where: { id } });
};

export const updateProject = async (id: number, projectDetails: ProjectInterface) => {
  const project = await projectRepository.findOneBy({ id });
  if (!project) {
    return null;
  }

  for (const key in projectDetails) {
    if (key.toString() != 'id' && projectDetails[key]) project[key] = projectDetails[key];
  }
  const updatedProject = await projectRepository.save(project);
  return updatedProject;
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
