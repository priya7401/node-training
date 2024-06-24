import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/userService';
import * as roleService from '../services/roleService';
import { HttpStatusCode } from '../config/httpStatusCodes';
import { messages } from '../config/messages';

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, name, role_name }: { user_id: number; name: string; role_name: string } = req.body;

    const role = await roleService.getRoleByIdOrName({ roleName: role_name });

    if (!role) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: messages.roleNotFound });
    }

    let user = await userService.updateUser(user_id, {
      name: name,
      role: { id: role.id },
    });

    // separate DB call to get relations ('role')
    user = await userService.findUser({ id: user.id });
    delete user.invalidate_token_before;
    delete user.password;

    return res.status(HttpStatusCode.CREATED).json({ user });
  } catch (error) {
    next(error);
  }
};
