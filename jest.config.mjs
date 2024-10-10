export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: './src/test/setup.ts',
    globalTeardown: './src/test/teardown.ts',
  };