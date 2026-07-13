const baseConfig = {
  preset: "jest-expo",
  moduleNameMapper: {
    "^@/assets/(.*)$": "<rootDir>/assets/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["node_modules/(?!(\\.pnpm/)?((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg))"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};

module.exports = {
  projects: [
    {
      ...baseConfig,
      displayName: "mobile-unit",
      setupFilesAfterEnv: ["<rootDir>/jest.unit.setup.ts"],
      testMatch: ["<rootDir>/src/**/*.unit.test.ts", "<rootDir>/src/**/*.unit.test.tsx", "<rootDir>/src/**/*.unit.spec.ts", "<rootDir>/src/**/*.unit.spec.tsx"],
    },
    {
      ...baseConfig,
      displayName: "mobile-integration",
      testMatch: ["<rootDir>/src/**/*.integration.test.ts", "<rootDir>/src/**/*.integration.test.tsx", "<rootDir>/src/**/*.integration.spec.ts", "<rootDir>/src/**/*.integration.spec.tsx", "<rootDir>/src/**/*.e2e.test.ts", "<rootDir>/src/**/*.e2e.test.tsx"],
    },
  ],
};
