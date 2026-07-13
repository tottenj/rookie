const transformedPackages = [
  "(jest-)?react-native",
  "@react-native",
  "expo(nent)?",
  "@expo(nent)?/.*",
  "@expo-google-fonts/.*",
  "react-navigation",
  "@react-navigation/.*",
  "@sentry/react-native",
  "native-base",
  "react-native-svg",
  "heroui-native",
  "uniwind",
  "standard-navigation",
].join("|");

const baseConfig = {
  preset: "jest-expo",
  moduleNameMapper: {
    "^@rookie/shared-types$": "<rootDir>/../../packages/shared-types/src/index.ts",
    "^@/assets/(.*)$": "<rootDir>/assets/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [`node_modules/(?!(\\.pnpm/)?(${transformedPackages}))`],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};

module.exports = {
  projects: [
    {
      ...baseConfig,
      displayName: "mobile-unit",
      setupFilesAfterEnv: ["<rootDir>/test/jest.unit.setup.ts"],
      testMatch: [
        "<rootDir>/src/**/*.unit.test.ts",
        "<rootDir>/src/**/*.unit.test.tsx",
        "<rootDir>/src/**/*.unit.spec.ts",
        "<rootDir>/src/**/*.unit.spec.tsx",
      ],
    },
    {
      ...baseConfig,
      displayName: "mobile-integration",
      testMatch: [
        "<rootDir>/src/**/*.integration.test.ts",
        "<rootDir>/src/**/*.integration.test.tsx",
        "<rootDir>/src/**/*.integration.spec.ts",
        "<rootDir>/src/**/*.integration.spec.tsx",
        "<rootDir>/src/**/*.e2e.test.ts",
        "<rootDir>/src/**/*.e2e.test.tsx",
      ],
      setupFilesAfterEnv: ["<rootDir>/test/jest.integration.setup.ts"],
    },
  ],
};
