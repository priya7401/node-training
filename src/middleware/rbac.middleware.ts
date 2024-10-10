import { Request, Response, NextFunction } from 'express';
import * as roleService from '../services/roleService';
import { CRUDOperation, Role } from '../config/appConstants';
import { HttpStatusCode } from '../config/httpStatusCodes';
import { messages } from '../config/messages';
import { PermissionCheckParams } from '../config/types';
import { UserInterface } from '../database/models';

const checkPermissions = ({ allowedRoles, module, operation }: PermissionCheckParams) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: UserInterface = req.app.locals.user;
      const userRole: Role = Role[user.role.role];

      if (!allowedRoles.includes(userRole)) {
        return res.status(HttpStatusCode.FORBIDDEN).json({ message: messages.accessDenied });
      }

      const roleEntity = await roleService.getRoleByIdOrName({ roleName: userRole });

      if (!roleEntity) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: messages.roleNotFound });
      }

      const permission = roleEntity.permissions.find((permissionEntity) => permissionEntity.module_name === module);

      if (!permission) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: `${messages.permissionNotFound} for the role '${userRole}'` });
      }

      let hasPermission = false;

      switch (operation) {
        case CRUDOperation.create:
          hasPermission = permission.can_create;
          break;
        case CRUDOperation.read:
          hasPermission = permission.can_read;
          break;
        case CRUDOperation.update:
          hasPermission = permission.can_update;
          break;
        case CRUDOperation.delete:
          hasPermission = permission.can_delete;
          break;
      }

      if (hasPermission) {
        next();
      } else {
        return res.status(HttpStatusCode.FORBIDDEN).json({ message: messages.accessDenied });
      }
    } catch (error) {
      console.error(error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: messages.internalServerError });
    }
  };
};

export default checkPermissions;
