import { closeTestConnection, createTestConnection, resetTestDatabase } from './testUtils';

beforeAll(async () => {
  await createTestConnection();
});

afterAll(async () => {
  await closeTestConnection();
});

beforeEach(async () => {
  await resetTestDatabase();
});
