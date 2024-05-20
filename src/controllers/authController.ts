import { NextFunction, Request, Response } from "express";
import * as userService from "../services/userService";
import { messages } from "../config/messages";
import { encryptString } from "../utils/bcryptHelper";
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
    // const invalidateTokenBefore: string = time.toUTCString();

    // update invalidate_token_before column
    user = await userService.updateUser(user.id, {
      invalidate_token_before: time,
    });

    // TODO: how to remove password, invalidate_token_before when sending the json
    return res.status(HttpStatusCode.CREATED).json({ user, token });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send(messages.internalServerError);
  }
};
