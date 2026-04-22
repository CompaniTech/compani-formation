import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';


export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        JSX: true,
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'linebreak-style': ['error', 'unix'],
      'max-len': ['error', { code: 120, tabWidth: 2 }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'no-console': ['error', { allow: ['error'] }],
      // Un-used AirBnb rules
      'implicit-arrow-linebreak': 0,
      'import/no-extraneous-dependencies': 0,
      'import/extensions': ['error', 'never'],
      'import/prefer-default-export': 0,
      'import/no-unresolved': 0,
      'no-underscore-dangle': 0,
      'no-use-before-define': 0,
      'func-names': 0,
      'global-require': 0,
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],
      'object-curly-newline': ['error', { consistent: true }],
      'operator-linebreak': ['error', 'before', { overrides: { '&&': 'after', '||': 'after', '=': 'after' } }],
      'arrow-parens': [2, 'as-needed', { requireForBlockBody: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
      'prefer-destructuring': ['error', { VariableDeclarator: { object: true, array: false } }],
      'function-paren-newline': ['error', 'consistent'],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/set-state-in-effect': 0,
      'react-hooks/refs': 0,
    },
  },
];
