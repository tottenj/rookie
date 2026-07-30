const commonConfig = {
  rootDir: '.',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['<rootDir>/test/factories/', '<rootDir>/prisma/'],
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
    },
  ],
};
