import { AppDataSource } from '../database/dbConnection';
import { User } from '../database/entity/User';
import { UserInterface, userSelectColumns } from '../database/models';

const userRepository = AppDataSource.getRepository(User);

export const findUser = async (userDetails: UserInterface) => {
  const user = await userRepository.findOne({
    where: [{ mobile_number: userDetails.mobile_number }, { email: userDetails.email }, { id: userDetails.id }],
    relations: ['role'],
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

  return updatedUser.raw[0];
};
