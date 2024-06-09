import * as jwt from 'jsonwebtoken';
import { AppConstants } from '../config/appConstants';
import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../config/httpStatusCodes';
import { messages } from '../config/messages';
import * as userService from '../services/userService';

export const createToken = (userId: number) => {
  return jwt.sign({ user_id: userId }, AppConstants.jwtTokenKey, {
    expiresIn: '600s',
  });
};

interface CustomJwtPayload extends jwt.JwtPayload {
  user_id: string;
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization ?? '';
    token = token.split(' ')[1]; //remove "Bearer" string from token
    if (!token) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: messages.unauthorizedRequest });
    }

    const decoded = jwt.verify(token, AppConstants.jwtTokenKey ?? '') as CustomJwtPayload;

    console.log({ decoded });

    if (!decoded.user_id) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: messages.unauthorizedRequest });
    }

    //local variable, available only through the lifetime of the request
    req.app.locals.user_id = decoded.id;

    const id = parseInt(decoded.user_id);

    // check if user exists in db
    const user = await userService.findUser({ id });

    if (!user) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ mesage: messages.userNotFound });
    }

    req.app.locals.user = user;

    //if the user has logged out and logs back in with the same token
    //(before the expiry time defined in the jwt token during signing the token),
    //this check is used to prevent the same
    if (user.invalidate_token_before) {
      const date = new Date();
      if (date >= user.invalidate_token_before) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: messages.unauthorizedRequest });
      }
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: messages.unauthorizedRequest });
  }
};
