module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'react/display-name': 'off',
    'max-len': ['error', { code: 120, tabWidth: 2 }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-console': ['error', { allow: ['error'] }],
    // Un-used AirBnb rules
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
    'arrow-parens': [2, 'as-needed', { requireForBlockBody: true }], // option require
  },
  globals: {
    __DEV__: true,
    Platform: true,
  },
};
