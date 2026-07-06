// Learn more https://docs.expo.io/guides/customizing-metro
const { withStorybook } = require("@storybook/react-native/withStorybook");
const { withUniwindConfig } = require("uniwind/metro");

const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(withStorybook(config), {
  cssEntryFile: "./src/global.css",
  dtsFile: "./src/uniwind-types.d.ts",
});
