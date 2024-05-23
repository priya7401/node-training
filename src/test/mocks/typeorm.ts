import { UserInterface } from "../../database/models/user";

const mockUsers = [
  {
    id: 1,
    name: null,
    mobile_number: "9999999991",
    "email": "test1@gmail.com",
    password: "xcxcxcx",
  },
  {
    id: 1,
    name: null,
    mobile_number: "9999999992",
    "email": "test2@gmail.com",
    password: "xcxcvdfsefesxcx",
  },
];

const find = jest.fn().mockResolvedValue(mockUsers);
const findOne = jest
  .fn()
  .mockImplementation((userDetails: UserInterface) =>
    Promise.resolve(
      mockUsers.find(
        (user) =>
          user.id === userDetails.id ||
          user.mobile_number == userDetails.mobile_number ||
          user.email == userDetails.email
      )
    )
  );
const save = jest
  .fn()
  .mockImplementation((user) =>
    Promise.resolve({ ...user, id: mockUsers.length + 1 })
  );
const remove = jest.fn();

const PrimaryGeneratedColumn = jest.fn();
const Column = jest.fn();
const Entity = jest.fn();

const getRepository = jest.fn().mockReturnValue({
  find,
  save,
  remove,
  findOne,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  // add other methods you need to mock
});

export default {
  getRepository,
  PrimaryGeneratedColumn,
  Column,
  Entity,
};
