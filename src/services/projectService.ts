import { ProjectStatus } from '../config/appConstants';
import { AppDataSource } from '../database/dbConnection';
import { Project } from '../database/entity/Project';
import { ProjectAttachment } from '../database/entity/ProjectAttachment';
import { ProjectInterface } from '../database/models/project';
import { ProjectAttachmentInterface, projectAttachmentSelectColumns } from '../database/models/projectAttachment';

const projectRepository = AppDataSource.getRepository(Project);
const projectAttachmentRepository = AppDataSource.getRepository(ProjectAttachment);

export const getProjects = async (projectDetails: ProjectInterface) => {
  return await projectRepository.find({
    relations: ['project_attachments', 'project_attachments.attachment'],
    where: { temple_name: projectDetails.temple_name },
  });
};

export const getProjectsByStatus = async (status: ProjectStatus) => {
  return await projectRepository.find({
    relations: ['project_attachments', 'project_attachments.attachment'],
    where: { status },
  });
};

export const createProject = async (projectDetails: ProjectInterface) => {
  let project = projectRepository.create(projectDetails);
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

  for (let key in projectDetails) {
    if (key.toString() != 'id' && projectDetails[key]) project[key] = projectDetails[key];
  }
  const updatedProject = await projectRepository.save(project);
  return updatedProject;
};

export const deleteProject = async (id: number) => {
  return await projectRepository.delete({ id });
};

export const updateProjectAttachments = async (attachments: ProjectAttachmentInterface[]) => {
  //TODO: how to get attachment object and project id
  const projectAttachments = await projectAttachmentRepository
    .createQueryBuilder()
    .insert()
    .into(ProjectAttachment)
    .values(attachments)
    .returning(projectAttachmentSelectColumns)
    .execute();
  return projectAttachments.generatedMaps;
};

export const getProjectAttachments = async (project_id: number) => {
  return await projectAttachmentRepository.find({
    where: { project: { id: project_id } },
    relations: ['project', 'attachment'],
    select: { project: { id: true }, attachment: { id: true } },
  });
};