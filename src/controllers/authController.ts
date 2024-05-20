import { NextFunction, Request, Response } from "express";
import * as userService from "../services/userService";
import { messages } from "../config/messages";
import { compareString, encryptString } from "../utils/bcryptHelper";
import { HttpStatusCode } from "../config/httpStatusCodes";
import { createToken } from "../utils/jwtHelper";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, mobile_number, email, password } = req.body;

    // check if user already exists in DB
    const existingUser = await userService.getUserByMobileOrEmail({
      mobile_number,
      email,
    });

    if (existingUser) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ "message": messages.userAlreadyExists });
    }

    // encrypt password
    const hash = await encryptString(password);

    // create new user
    let user = await userService.createNewUser({
      name,
      mobile_number,
      email,
      password: hash,
    });

    const token = createToken(user.id);
    const time = new Date();
    time.setUTCSeconds(time.getUTCSeconds() + 600);

    // update invalidate_token_before column
    user = await userService.updateUser(user.id, {
      invalidate_token_before: time,
    });

    return res.status(HttpStatusCode.CREATED).json({ user, token });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send(messages.internalServerError);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mobile_number, email, password } = req.body;

    // check if user already exists in DB
    let existingUser = await userService.getUserByMobileOrEmail({
      mobile_number,
      email,
    });

    if (!existingUser || !existingUser.id) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ "message": messages.userNotFound });
    }

    // encrypt password
    const checkPassword = await compareString(password, existingUser.password);

    // check if encrypted password is same as stored password
    if (!checkPassword) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ "message": messages.invalidPassword });
    }

    const token = createToken(existingUser.id);
    const time = new Date();
    time.setUTCSeconds(time.getUTCSeconds() + 600);

    // update invalidate_token_before column
    existingUser = await userService.updateUser(existingUser.id, {
      invalidate_token_before: time,
    });

    return res.status(HttpStatusCode.CREATED).json({ existingUser, token });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send(messages.internalServerError);
  }
};
