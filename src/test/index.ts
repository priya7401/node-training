import { Express } from "express";
import app from "..";
// import { Repository, SelectQueryBuilder } from "typeorm";

const testApp: Express = app;
// jest.useFakeTimers();

// import { mock } from "jest-mock-extended";
// import { User } from "../database/entity/User";

// jest.mock("typeorm");

// const repositoryMock = mock<Repository<User>>();
// const qbuilderMock = mock<SelectQueryBuilder<User>>();

// jest.mock("typeorm", () => {
//   qbuilderMock.where.mockReturnThis();
//   qbuilderMock.select.mockReturnThis();
//   repositoryMock.createQueryBuilder.mockReturnValue(qbuilderMock);

//   return {
//     getRepository: () => repositoryMock,

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
//   };
// });

export { testApp };
