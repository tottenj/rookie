const path = require("path");
const { withStorybook } = require("@storybook/react-native/withStorybook");
const { withUniwindConfig } = require("uniwind/metro");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../.."); // adjust depth to match your repo

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules"), path.resolve(monorepoRoot, "node_modules")];

module.exports = withUniwindConfig(withStorybook(config), {
  cssEntryFile: "./src/global.css",
  dtsFile: "./src/uniwind-types.d.ts",
});
