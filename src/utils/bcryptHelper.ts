import { AppConstants } from "../config/appConstants";
import bcrypt from "bcrypt";

export const encryptString = (text: string) => {
  return bcrypt.hash(text, AppConstants.saltRounds);
};

export const compareString = (text: string, hash: string) => {
  return bcrypt.compare(text, hash);
};
