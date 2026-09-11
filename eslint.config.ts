import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['dist/**', '.output/**', 'node_modules/**', 'src/routeTree.gen.ts'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  reactHooks.configs.flat.recommended,

  {
    files: ['**/*.{ts,tsx}'],

    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
      'react-refresh': reactRefresh,
    },

    rules: {
      'prettier/prettier': 'error',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-non-null-assertion': 'warn',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],

      '@typescript-eslint/explicit-function-return-type': 'off',

      '@typescript-eslint/explicit-module-boundary-types': 'off',

      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^node:'],
            [String.raw`^@?\w`],
            ['^@/'],
            [String.raw`^\.\.`],
            [String.raw`^\.`],
            [String.raw`^.+\.s?css$`],
          ],
        },
      ],

      'simple-import-sort/exports': 'error',

      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  prettierConfig,
]);
