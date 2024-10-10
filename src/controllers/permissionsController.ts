import { NextFunction, Request, Response } from 'express';
import * as permissionService from '../services/permissionService';
import { HttpStatusCode } from '../config/httpStatusCodes';
import { ModuleType } from '../config/appConstants';
import * as roleService from '../services/roleService';
import { messages } from '../config/messages';

export const createPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_id, module_name, can_create, can_read, can_update, can_delete } = req.body;

    const existingRole = await roleService.getRoleByIdOrName({ roleId: role_id });

    if (!existingRole) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: messages.roleNotFound });
    }

    let permission = await permissionService.createPermission({
      role: role_id,
      module_name: ModuleType[module_name],
      can_create: can_create,
      can_read: can_read,
      can_update: can_update,
      can_delete: can_delete,
    });

    // performing separate DB call to get the relations ('role')
    permission = await permissionService.getPermission({ id: permission.id });
    return res.status(HttpStatusCode.CREATED).json({ permission });
  } catch (error) {
    next(error);
  }
};

export const getPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_name, module_name, permission_id } = req.body;

    const permission = await permissionService.getPermission({ role: { role: role_name }, module_name: ModuleType[module_name], id: permission_id });

    if (!permission) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: messages.permissionNotFound });
    }

    return res.status(HttpStatusCode.OK).json({ permission });
  } catch (error) {
    next(error);
  }
};

export const updatePermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { permission_id, role_name, module_name, can_create, can_read, can_update, can_delete } = req.body;

    let permission = await permissionService.updatePermission(permission_id, {
      role: role_name,
      module_name: ModuleType[module_name],
      can_create: can_create,
      can_read: can_read,
      can_update: can_update,
      can_delete: can_delete,
    });

    // performing separate DB call to get the relations ('role')
    permission = await permissionService.getPermission({ id: permission.id });

    return res.status(HttpStatusCode.CREATED).json({ permission });
  } catch (error) {
    next(error);
  }
};

export const deletePermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { permission_id } = req.body;

    await permissionService.deletePermission(permission_id);

    return res.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
