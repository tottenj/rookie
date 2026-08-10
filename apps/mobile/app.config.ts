import type { ConfigContext, ExpoConfig } from 'expo/config';

const variant = process.env.APP_VARIANT;

const isDevelopment = variant === 'development';
const isE2e = variant === 'e2e';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: isE2e ? 'Rookie E2E' : isDevelopment ? 'Rookie Dev' : 'Rookie',

  slug: 'rookie',

  scheme: isE2e ? 'rookie-e2e' : isDevelopment ? 'rookie-dev' : 'rookie',

  ios: {
    ...config.ios,
    bundleIdentifier: isE2e
      ? 'com.jtotssteam.rookie.e2e'
      : isDevelopment
        ? 'com.jtotssteam.rookie.dev'
        : 'com.jtotssteam.rookie',
  },

  android: {
    ...config.android,
    package: isE2e
      ? 'com.jtotssteam.rookie.e2e'
      : isDevelopment
        ? 'com.jtotssteam.rookie.dev'
        : 'com.jtotssteam.rookie',
  },
});
