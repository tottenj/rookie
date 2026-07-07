const commonConfig = {
  rootDir: '.',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
};

module.exports = {
  projects: [
    {
      ...commonConfig,
      displayName: 'api-unit',
      testMatch: ['<rootDir>/src/**/*.spec.ts'],
      testPathIgnorePatterns: ['/node_modules/', '/dist/'],
      coverageDirectory: '<rootDir>/coverage/unit',
    },
    {
      ...commonConfig,
      displayName: 'api-integration',
      testMatch: [
        '<rootDir>/__tests__/integration/**/*.test.ts',
        '<rootDir>/__tests__/integration/**/*.spec.ts',
        '<rootDir>/__tests__/e2e/**/*.test.ts',
        '<rootDir>/__tests__/e2e/**/*.spec.ts',
        '<rootDir>/test/**/*.e2e-spec.ts',
        '<rootDir>/test/**/*.integration-spec.ts',
        '<rootDir>/src/**/*.integration.spec.ts',
      ],
      testPathIgnorePatterns: ['/node_modules/', '/dist/'],
      coverageDirectory: '<rootDir>/coverage/integration',
    },
  ],
};
