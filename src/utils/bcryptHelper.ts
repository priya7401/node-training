import { AppConstants } from "./appConstants";
import bcrypt from "bcrypt";

export const encryptString = (text: string) => {
  const hash = bcrypt.hash(text, AppConstants.saltRounds);
  return hash;
};
