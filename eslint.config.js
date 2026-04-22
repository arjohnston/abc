// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores(['dist', 'storybook-static', '.storybook']), {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
    jsxA11y.flatConfigs.recommended,
  ],
  plugins: {
    'simple-import-sort': simpleImportSort,
    'unused-imports': unusedImports,
  },
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parser: tseslint.parser,
    parserOptions: {
      ecmaVersion: 'latest',
      ecmaFeatures: { jsx: true },
      sourceType: 'module',
    },
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    curly: ['error', 'all'],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    eqeqeq: ['error', 'always'],
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['**/components/core', '**/components/core/**'],
        message: "Import from '@core' instead of relative paths.",
      }],
    }],
  },
}, // ─── Architecture boundaries ──────────────────────────────────────────────
// Game logic must stay pure — no UI layer imports
{
  files: ['src/games/**'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['../components/**', '@components/**', '../pages/**', '@pages/**', '../hooks/**', '@hooks/**'],
          message: 'Game logic must not import from UI layers (components, pages, hooks).',
        },
      ],
    }],
  },
}, // Hooks must not depend on UI
{
  files: ['src/hooks/**'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        { group: ['../pages/**', '@pages/**'], message: 'Hooks must not import from pages.' },
        { group: ['../components/**', '@components/**'], message: 'Hooks must not import from components.' },
      ],
    }],
  },
}, // Components must not import from pages
{
  files: ['src/components/**'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        { group: ['../../pages/**', '../pages/**', '@pages/**'], message: 'Components must not import from pages.' },
      ],
    }],
  },
}, // Pages must not import other pages (alias form; relative same-level is caught by code review)
{
  files: ['src/pages/**'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        { group: ['@pages/*', '@pages/**'], message: 'Pages must not import from other pages.' },
      ],
    }],
  },
}, // ─── Test files — relax rules that don't apply in tests ──────────────────
{
  files: ['src/**/__tests__/**', 'src/test/**', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
  },
}, ...storybook.configs["flat/recommended"]])
