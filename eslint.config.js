import globals from 'globals';
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
import sonarjs from 'eslint-plugin-sonarjs';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 * This is the main ESLint configuration array.
 * ESLint processes this array from top to bottom, merging configurations.
 */
export default [
  // Layer 1: Global Ignores
  // Performance: Ignore non-source code directories to speed up linting.
  {
    ignores: ['node_modules', 'dist', 'build', '.vinxi', '.vercel', 'public/build', '**/*.gen.ts'],
  },

  // Layer 2: Base Configuration for All Project Files
  // Establishes a consistent foundation for the entire project.
  {
    plugins: {
      prettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...prettierConfig.rules, // Integrates Prettier rules into ESLint
      'prettier/prettier': 'warn', // Shows Prettier issues as warnings
    },
  },

  // Layer 3: Strict Rules for the Core Application (TypeScript & React)
  // This is the most important layer, enforcing high-quality code in the app.
  {
    files: ['app/**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': ts,
      react,
      'react-refresh': reactRefresh,
      sonarjs,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        // Type-aware linting: Provides the tsconfig path to ESLint
        project: './tsconfig.json',
      },
    },
    rules: {
      // Base recommended rules from plugins
      ...js.configs.recommended.rules,
      ...ts.configs['recommended-type-checked'].rules,
      ...ts.configs.stylistic.rules,
      ...react.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,

      // --- Custom Rule Overrides ---
      // React & DX
      'react-refresh/only-export-components': 'warn',
      'react/react-in-jsx-scope': 'off', // Not needed with modern React
      'react/prop-types': 'off', // We use TypeScript for prop types

      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn', // Discourage 'any' but don't block
    },
    settings: {
      react: {
        version: 'detect', // Automatically detects React version
      },
    },
  },

  // Layer 4: Overrides for Specific File Types

  // Configuration for Test Files (more relaxed)
  {
    files: ['**/*.test.{ts,tsx}', 'vitest.config.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Allows 'any' in tests for easier mocking
    },
  },

  // Configuration for JS Config files (Node.js environment)
  {
    files: ['*.config.js', '*.config.ts', 'scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off', // Allows require() in build scripts
    },
  },
];
