import { createApiConfig } from './api.mjs';

export function createFunctionsConfig(options = {}) {
  return createApiConfig(options, {
    ignores: ['eslint.config.mjs', 'lib/**', 'generated/**', 'dist/**'],
  });
}

export default createFunctionsConfig();
