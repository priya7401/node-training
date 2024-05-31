import { Request, Response } from 'express';
import { HttpStatusCode } from '../config/httpStatusCodes';
import { messages } from '../config/messages';
import * as projectService from '../services/projectService';
import { randomUUID } from 'crypto';
import { ProjectStatus } from '../config/appConstants';
import { ProjectInterface } from '../database/models/project';
import { ProjectAttachmentInterface } from '../database/models/projectAttachment';
import { AttachmentDetails } from '../config/types';
import { formatProjectDate } from '../utils/dateFormatHelper';
import { getDownloadUrl } from '../utils/awsConfig';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const projects: ProjectInterface[] = await projectService.getProjectsByStatus(status ? ProjectStatus[status.toString()] : null);

    for (const project of projects) {
      for (const projectAttachment of project.project_attachments) {
        projectAttachment.attachment.s3_url = await getDownloadUrl(projectAttachment.attachment.s3_key);
      }
      if (project.status == ProjectStatus.active) {
        let progress = Math.round((project.expensed_amount / project.estimated_amount) * 100);
        project.progress = progress;
      } else if (project.status == ProjectStatus.completed || (project.estimated_amount && project.estimated_amount == project.expensed_amount)) {
        project.progress = 100;
      }
    }

    return res.status(HttpStatusCode.OK).json({ projects });
  } catch (error) {
    console.log(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(messages.internalServerError);
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { temple_name, temple_incharge_name, temple_incharge_number, location } = req.body;

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
    } = req.body;

    let updatedProject: ProjectInterface = {};
    let formatted_start_date: Date;
    let formatted_end_date: Date;
    // assuming date is sent in the following format from FE: "DD/MM/YYYY"
    if (start_date) {
      formatted_start_date = formatProjectDate(start_date);
    }
    if (end_date) {
      formatted_end_date = formatProjectDate(end_date);
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

    for (const projectAttachment of updatedProject.project_attachments) {
      projectAttachment.attachment.s3_url = await getDownloadUrl(projectAttachment.attachment.s3_key);
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

export const createProjectAttachment = async (req: Request, res: Response) => {
  try {
    const { project_id, attachments }: { project_id: number; attachments: AttachmentDetails[] } = req.body;

    let projectAttachments: ProjectAttachmentInterface[] = [];

    attachments.forEach((attachment: AttachmentDetails) => {
      projectAttachments.push({
        project: { id: project_id },
        attachment: { id: attachment.attachment_id },
        project_attachment_type: attachment.attachment_type,
      });
    });

    const updatedProjectAttachments = await projectService.updateProjectAttachments(projectAttachments);
    return res.status(HttpStatusCode.CREATED).json({ project_attachments: updatedProjectAttachments });
  } catch (error) {
    console.log(error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(messages.internalServerError);
  }
};