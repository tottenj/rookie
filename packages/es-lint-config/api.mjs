import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export function createApiConfig(options = {}, overrides = {}) {
  const { tsconfigRootDir } = options;

  const { ignores = ['eslint.config.mjs', 'dist/**', 'coverage/**', 'src/generated/**'] } = overrides;

  return tseslint.config(
    {
      ignores,
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.jest,
        },
        sourceType: 'module',
        parserOptions: {
          projectService: true,
          ...(tsconfigRootDir ? { tsconfigRootDir } : {}),
        },
      },
    },
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        'prettier/prettier': 'error',
      },
    },
    {
      files: ['**/*.spec.ts', 'test/**/*.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
  );
}

export default createApiConfig();
