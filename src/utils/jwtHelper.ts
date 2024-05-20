import * as jwt from "jsonwebtoken";
import { AppConstants } from "../config/appConstants";

export const createToken = (userId: number) => {
  return jwt.sign({ user_id: userId }, AppConstants.jwtTokenKey, {
    expiresIn: "600s",
  });
};
