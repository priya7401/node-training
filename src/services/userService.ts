import { AppDataSource } from "../database/dbConnection";
import { User } from "../database/entity/User";
import { UserInterface } from "../database/models/user";

const userRepository = AppDataSource.getRepository(User);

export const getUserByMobileNumber = async (mobileNumber: string) => {
  const user = await userRepository.findOneBy({
    mobile_number: mobileNumber,
  });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await userRepository.findOneBy({
    email,
  });
  return user;
};

export const getUserByMobileOrEmail = async (userDetails: UserInterface) => {
  const user = await userRepository.find({
    where: [
      { mobile_number: userDetails.mobile_number },
      { email: userDetails.email },
    ],
  });
  return user;
};

export const createNewUser = async (userDetails: UserInterface) => {
  const user = userRepository.create({
    name: userDetails.name,
    mobile_number: userDetails.mobile_number,
    email: userDetails.email,
    password: userDetails.password,
  });
  const updatedUser = await userRepository.save(user);
  return updatedUser;
};

export const updateUser = async (id: number, userDetails: UserInterface) => {
  const user = await userRepository.findOneBy({ id: id });
  if (!user) {
    throw "User not found";
  }

  for (let key in userDetails) {
    if (key.toString() != "id") user[key] = userDetails[key];
  }
  const updatedUser = await userRepository.save(user);
  return updatedUser;
};
