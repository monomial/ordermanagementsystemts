const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testMatch: ['**/?(*.)+(integration).test.ts'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/integration/setup.ts'],
  testTimeout: 10000
}; 