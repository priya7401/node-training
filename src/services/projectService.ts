import { ProjectStatus } from '../config/appConstants';
import { AppDataSource } from '../database/dbConnection';
import { Project } from '../database/entity/Project';
import { ProjectInterface } from '../database/models/project';

const projectRepository = AppDataSource.getRepository(Project);

export const getProjects = async (projectDetails: ProjectInterface) => {
  return await projectRepository.findBy({ temple_name: projectDetails.temple_name });
};

export const getProjectsByStatus = async (status: ProjectStatus) => {
  return await projectRepository.find({ where: { status } });
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
    return {};
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