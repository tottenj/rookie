const commonConfig = {
  rootDir: '.',

  moduleFileExtensions: ['js', 'json', 'ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',

    '^@rookie/shared-types$':
      '<rootDir>/../../packages/shared-types/src/index.ts',
  },

  testEnvironment: 'node',

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },

  collectCoverageFrom: ['src/**/*.(t|j)s'],

  coveragePathIgnorePatterns: ['/test/factories/', '/prisma/'],
};

module.exports = {
  projects: [
    {
      ...commonConfig,

      displayName: 'api-unit',

      testMatch: ['<rootDir>/src/**/*.unit.test.ts'],

      testPathIgnorePatterns: ['/node_modules/', '/dist/'],

      coverageDirectory: '<rootDir>/coverage/unit',
    },

    {
      ...commonConfig,

      displayName: 'api-integration',

      testMatch: [
        '<rootDir>/__tests__/integration/**/*.test.ts',
        '<rootDir>/src/**/*.integration.test.ts',
      ],

      testPathIgnorePatterns: ['/node_modules/', '/dist/'],

      coverageDirectory: '<rootDir>/coverage/integration',

      setupFilesAfterEnv: ['<rootDir>/test/integration/setup-integration.ts'],

      maxWorkers: 1,
    },
    {
      ...commonConfig,
      displayName: 'api-api',
      testMatch: ['<rootDir>/__tests__/api/**/*.test.ts'],
      testPathIgnorePatterns: ['/node_modules/', '/dist/'],
      coverageDirectory: '<rootDir>/coverage/api',
      setupFilesAfterEnv: ['<rootDir>/test/api/setup-api.ts'],
      maxWorkers: 1,
    },
  ],
};
