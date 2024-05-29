import { Request, Response } from 'express';
import { HttpStatusCode } from '../config/httpStatusCodes';
import { messages } from '../config/messages';
import * as projectService from '../services/projectService';
import { randomUUID } from 'crypto';
import { ProjectStatus } from '../config/appConstants';
import { ProjectInterface } from '../database/models/project';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const projects = await projectService.getProjectsByStatus(status ? ProjectStatus[status.toString()] : null);
    return res.status(HttpStatusCode.OK).json({ projects });
  } catch (error) {
    console.log(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(messages.internalServerError);
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { temple_name, temple_incharge_name, temple_incharge_number, location } = req.body;

    // check if the project already exists
    const existingProjects = await projectService.getProjects({ temple_name });
    if (existingProjects && existingProjects.length) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: messages.projectAlreadyExists });
    }

    const reg_num = 'TEM' + randomUUID().slice(0, 6);

    const project = await projectService.createProject({ temple_name, temple_incharge_name, temple_incharge_number, location, reg_num });
    return res.status(HttpStatusCode.CREATED).json({ project });
  } catch (error) {
    console.log(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(messages.internalServerError);
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const {
      id,
      temple_name,
      temple_incharge_name,
      temple_incharge_number,
      status,
      start_date,
      end_date,
      estimated_amount,
      expensed_amount,
      location,
      scrapped_reason,
      attachment_id,
      attachment_type,
    } = req.body;

    // temple name unique validator check
    if (temple_name) {
      const existingProjects = await projectService.getProjects({ temple_name });
      if (existingProjects && existingProjects.length) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: messages.templeNameAlreadyExists });
      }
    }

    let updatedProject: ProjectInterface = {};
    let formatted_start_date: Date;
    let formatted_end_date: Date;
    // assuming date is sent in the following format from FE: "DD/MM/YYYY"
    if (start_date) {
      const [day, month, year] = start_date.split('/');
      const formattedDateString = `${year}-${month}-${day}`;
      formatted_start_date = new Date(formattedDateString);
    }
    if (end_date) {
      const [day, month, year] = end_date.split('/');
      const formattedDateString = `${year}-${month}-${day}`;
      formatted_end_date = new Date(formattedDateString);
    }

    updatedProject = await projectService.updateProject(id, {
      temple_name,
      temple_incharge_name,
      temple_incharge_number,
      status,
      start_date: formatted_start_date,
      end_date: formatted_end_date,
      estimated_amount,
      expensed_amount,
      location,
      scrapped_reason,
    });

    if (!updatedProject) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: messages.projectNotFound });
    }

    if (updatedProject.status == ProjectStatus.active) {
      let progress = Math.round((updatedProject.expensed_amount / updatedProject.estimated_amount) * 100);
      updatedProject.progress = progress;
    } else if (
      updatedProject.status == ProjectStatus.completed ||
      (updatedProject.estimated_amount && updatedProject.estimated_amount == updatedProject.expensed_amount)
    ) {
      updatedProject.progress = 100;
    }

    return res.status(HttpStatusCode.CREATED).json({ project: updatedProject });
  } catch (error) {
    console.log(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(messages.internalServerError);
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // check if the project exists
    const existingProject = await projectService.getProjectById(id);
    if (!existingProject) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: messages.projectNotFound });
    }

    await projectService.deleteProject(id);
    return res.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    console.log(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(messages.internalServerError);
  }
};