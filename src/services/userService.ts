import { AppDataSource } from '../database/dbConnection';
import { User } from '../database/entity/User';
import { UserInterface, userSelectColumns } from '../database/models/user';

const userRepository = AppDataSource.getRepository(User);

export const getUserByMobileOrEmail = async (userDetails: UserInterface) => {
  const user = await userRepository.findOne({
    where: [{ mobile_number: userDetails.mobile_number }, { email: userDetails.email }],
  });
  return user;
};

export const createNewUser = async (userDetails: UserInterface) => {
  const user = await AppDataSource.createQueryBuilder().insert().into(User).values([userDetails]).returning(userSelectColumns).execute();
  return user.generatedMaps[0];
};

export const updateUser = async (id: number, userDetails: UserInterface) => {
  const updatedUser = await AppDataSource.createQueryBuilder()
    .update(User)
    .set(userDetails)
    .where('id = :id', { id: id })
    .returning(userSelectColumns)
    .execute();

  const user = updatedUser.raw[0];

  if (!user) {
    throw 'User not found';
  }

  return user;
};
