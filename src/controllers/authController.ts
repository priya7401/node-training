import { NextFunction, Request, Response } from "express";
import * as userService from "../services/userService";
import { messages } from "../config/messages";
import { encryptString } from "../utils/bcryptHelper";
import { HttpStatusCode } from "../utils/httpStatusCodes";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, mobile_number, email, password } = req.body;

    // check if user already exists in DB
    const checkMobileNumber = await userService.getUserByMobileNumber(
      mobile_number
    );
    const checkEmail = await userService.getUserByEmail(email);

    if (checkEmail || checkMobileNumber) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ "message": messages.userAlreadyExists });
    }

    // encrypt password
    const hash = encryptString(password);

    // create new user
    const user = await userService.createNewUser(
      name,
      mobile_number,
      email,
      password
    );

    // TODO: how to remove password when sending the json
    return res.status(HttpStatusCode.CREATED).json({ user: user });
  } catch (error) {
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send(messages.internalServerError);
  }
};
