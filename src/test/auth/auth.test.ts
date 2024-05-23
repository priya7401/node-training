// import request from "supertest";
// import { testApp } from "..";
// import { AppConstants } from "../../config/appConstants";
// import { User } from "../../database/entity/User";
// // import getRepository from "../mocks/typeorm";
// import * as typeorm from "typeorm/globals";
// import { mock } from "jest-mock-extended";
// import { Repository, SelectQueryBuilder } from "typeorm";
// import { UserInterface } from "../../database/models/user";

// const mockUsers = [
//   {
//     id: 1,
//     name: null,
//     mobile_number: "9999999991",
//     "email": "test1@gmail.com",
//     password: "xcxcxcx",
//   },
//   {
//     id: 1,
//     name: null,
//     mobile_number: "9999999992",
//     "email": "test2@gmail.com",
//     password: "xcxcvdfsefesxcx",
//   },
// ];

// const find = jest.fn().mockResolvedValue(mockUsers);
// const findOne = jest
//   .fn()
//   .mockImplementation((userDetails: UserInterface) =>
//     Promise.resolve(
//       mockUsers.find(
//         (user) =>
//           user.id === userDetails.id ||
//           user.mobile_number == userDetails.mobile_number ||
//           user.email == userDetails.email
//       )
//     )
//   );
// const save = jest
//   .fn()
//   .mockImplementation((user) =>
//     Promise.resolve({ ...user, id: mockUsers.length + 1 })
//   );
// const remove = jest.fn();

// const PrimaryGeneratedColumn = jest.fn();
// const Column = jest.fn();
// const Entity = jest.fn();

// const getRepository = jest.fn().mockReturnValue({
//   find,
//   save,
//   remove,
//   findOne,
//   PrimaryGeneratedColumn,
//   Column,
//   Entity,
//   // add other methods you need to mock
// });

// const mockDS = {
//   initialize: jest.fn(),
// };

// jest.mock("typeorm", () => {
//   // qbuilderMock.where.mockReturnThis();
//   // qbuilderMock.select.mockReturnThis();
//   // repositoryMock.createQueryBuilder.mockReturnValue(qbuilderMock);

//   // const originalModule = jest.requireActual("typeorm");

//   return {
//     // ...originalModule,
//     getRepository: () => getRepository,
//     DataSource: jest.fn().mockImplementation(() => mockDS),

//     BaseEntity: class Mock {},
//     ObjectType: () => {},
//     Entity: () => {},
//     InputType: () => {},
//     Index: () => {},
//     PrimaryGeneratedColumn: () => {},
//     Column: () => {},
//     CreateDateColumn: () => {},
//     UpdateDateColumn: () => {},
//     OneToMany: () => {},
//     ManyToOne: () => {},
//     Repository: jest.fn(),
//   };
// });

// describe("POST /auth/signup", () => {
//   const userAlreadyExistsPayload = {
//     "mobile_number": "9999999999",
//     "email": "test@gmail.com",
//     "password": "Password@123",
//   };

//   it("should handle validation errors", async () => {
//     // DB mock

//     const response = await request(testApp)
//       .post(`${AppConstants.apiV1}/auth/signup`)
//       .send(userAlreadyExistsPayload);

//     console.log("======= response: ", response.body);

//     expect(response.status).toBe(400);
//   });
// });

import request from "supertest";
import { getRepository } from "typeorm";
import { testApp } from "..";

jest.mock("typeorm", () => ({
  getRepository: jest.fn(),
  PrimaryGeneratedColumn: () => {},
  Column: () => {},
  CreateDateColumn: () => {},
  UpdateDateColumn: () => {},
  Entity: () => {},
}));

describe("User Controller", () => {
  let mockCreate: jest.Mock;
  let mockSave: jest.Mock;
  let mockFindOne: jest.Mock;

  beforeAll(() => {
    mockCreate = jest.fn();
    mockSave = jest.fn();
    mockFindOne = jest.fn();
    (getRepository as jest.Mock).mockReturnValue({
      create: mockCreate,
      save: mockSave,
      findOne: mockFindOne,
    });
  });

  beforeEach(() => {
    mockCreate.mockClear();
    mockSave.mockClear();
    mockFindOne.mockClear();
  });

  it("should create a new user", async () => {
    const user = {
      id: 1,
      name: "John Doe",
      mobile_number: "9999999991",
      email: "test1@example.com",
      password: "Password@123",
    };
    mockCreate.mockReturnValue(user);
    mockSave.mockResolvedValue(user);

    const response = await request(testApp).post("/api/v1/auth/login").send({
      name: "John Doe",
      mobile_number: "9999999991",
      email: "test1@example.com",
      password: "Password@123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(user);
    expect(mockCreate).toHaveBeenCalledWith({
      name: "John Doe",
      mobile_number: "9999999991",
      email: "test1@example.com",
      password: "Password@123",
    });
    expect(mockSave).toHaveBeenCalledWith(user);
  });

  // it("should get a user by ID", async () => {
  //   const user = {
  //     id: 1,
  //     name: "John Doe",
  //     email: "john@example.com",
  //     password: "password",
  //   };
  //   mockFindOne.mockResolvedValue(user);

  //   const response = await request(testApp).get("/api/users/1");

  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(user);
  //   expect(mockFindOne).toHaveBeenCalledWith("1");
  // });

  // it("should return 404 if user not found", async () => {
  //   mockFindOne.mockResolvedValue(null);

  //   const response = await request(testApp).get("/api/users/999");

  //   expect(response.status).toBe(404);
  //   expect(response.body).toEqual({ message: "User not found" });
  //   expect(mockFindOne).toHaveBeenCalledWith("999");
  // });
});
