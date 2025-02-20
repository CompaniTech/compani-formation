module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint'],
  extends: ['airbnb-base', 'eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    '@typescript-eslint/indent': ['error', 2],
    indent: 0, // pour ne pas avoir l'erreur en doublon
    'linebreak-style': ['error', 'unix'],
    'react/display-name': 'off',
    'react/hook-use-state': 'error',
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
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // TS gère les types plutôt que eslint
    'no-unused-vars': 'off', // Pour ne pas avoir l'erreur en doublon
    'prefer-destructuring': ['error', { VariableDeclarator: { object: true, array: false } }],
    'function-paren-newline': ['error', 'consistent'],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  globals: {
    __DEV__: true,
    Platform: true,
    JSX: true,
    FormData: true,
  },
};
