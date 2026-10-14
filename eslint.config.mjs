import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import importX from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['coverage', 'lib', 'reports', 'examples'],
  },
  {
    files: [
      'src/**/*.js',
      'scripts/**/*.js',
      '__tests__/**/*.js',
      '__mocks__/**/*.js',
    ],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
    extends: [js.configs.recommended, importX.flatConfigs.recommended],
    rules: {
      'no-template-curly-in-string': 'off',
      'import-x/no-extraneous-dependencies': 'error',
    },
    settings: {
      'import-x/resolver-next': createTypeScriptImportResolver(),
    },
  },
  {
    files: ['src/rules/*'],
    extends: [eslintPlugin.configs.recommended],
    rules: {
      'eslint-plugin/require-meta-docs-description': [
        'error',
        {
          pattern: '^(Enforce|Require|Disallow)',
        },
      ],
      'eslint-plugin/require-meta-docs-url': [
        'error',
        {
          pattern:
            'https://github.com/eslint-community/eslint-plugin-jsx-a11y-x/tree/HEAD/docs/rules/{{name}}.md',
        },
      ],
      'eslint-plugin/require-meta-type': 'off',
      // disable temporarily
      'eslint-plugin/prefer-message-ids': 'off',
    },
  },
  {
    files: ['__tests__/src/rules/*.js'],
    extends: [eslintPlugin.configs.recommended],
  },
  {
    files: ['src/**/*.ts'],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
]);
