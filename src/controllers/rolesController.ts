import { NextFunction, Request, Response } from 'express';
import * as roleService from '../services/roleService';
import { HttpStatusCode } from '../config/httpStatusCodes';
import { messages } from '../config/messages';

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_name } = req.body;
    const role = await roleService.createRole(role_name);
    return res.status(HttpStatusCode.CREATED).json({ role });
  } catch (error) {
    next(error);
  }
};

export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_id, role_name }: { role_id: number; role_name: string } = req.body;
    const roles = await roleService.getRoles({ role: role_name, id: role_id });
    if (!roles) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: messages.roleNotFound });
    }
    return res.status(HttpStatusCode.OK).json({ roles });
  } catch (error) {
    next(error);
  }
};

export const getRoleByIdOrName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_id, role_name }: { role_id: number; role_name: string } = req.body;

    const roleDetails = await roleService.getRoleByIdOrName({ roleId: role_id, roleName: role_name });

    if (!roleDetails) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: messages.roleNotFound });
    }

    return res.status(HttpStatusCode.OK).json({ role_details: roleDetails });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_id, role_name }: { role_id: number; role_name: string } = req.body;
    const roles = await roleService.updateRole(role_id, {
      role: role_name,
    });
    if (!roles) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: messages.roleNotFound });
    }
    return res.status(HttpStatusCode.CREATED).json({ roles });
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_id } = req.body;
    await roleService.deleteRole(role_id);
    return res.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
