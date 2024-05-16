import { AppDataSource } from "../database/dbConnection";
import { User } from "../entity/User";

const userRepository = AppDataSource.getRepository(User);

export const getUserByMobileNumber = async (mobileNumber: string) => {
  try {
    const user = await userRepository.findOneBy({
      mobile_number: mobileNumber,
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await userRepository.findOneBy({
      email: email,
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const createNewUser = async (
  name: string,
  mobileNumber: string,
  email: string,
  password: string
) => {
  try {
    const user = userRepository.create({
      name: name,
      mobile_number: mobileNumber,
      email: email,
      password: password,
    });
    await userRepository.save(user);
    return user;
  } catch (error) {
    console.log(error);
  }
};
