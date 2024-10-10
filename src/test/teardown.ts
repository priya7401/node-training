import { closeTestConnection } from './testUtils';

module.exports = async () => {
  await closeTestConnection();
};
