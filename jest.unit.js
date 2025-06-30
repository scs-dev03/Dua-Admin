/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // setup
  maxWorkers: 4,
  setupFilesAfterEnv: ['./test/utils/unit.setup.ts'],

  // test
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./src'],
  testMatch: ['**/__test__/**/?(*.)+(spec|test).[jt]s?(x)'],
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
    '!**/__test/**',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageProvider: 'v8',
  coverageReporters: ['text-summary'],
};
