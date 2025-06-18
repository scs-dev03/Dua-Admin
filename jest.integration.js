/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // setup
  maxWorkers: 4,
  setupFilesAfterEnv: ['./test/utils/integration.setup.ts'],

  // test
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./test'],
  testMatch: ['**/test/**/?(*.)+(spec|test).[jt]s?(x)'],
  transformIgnorePatterns: ['/node_modules'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.test.json',
      },
    ],
  },

  // coverage
  collectCoverage: false,
  collectCoverageFrom: [
    './src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageProvider: 'v8',
  coverageReporters: ['text-summary'],
};
