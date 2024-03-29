module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:prettier/recommended',
  ],
  env: {
    es2023: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['simple-import-sort'],
  rules: {
    '@typescript-eslint/indent': 'off',
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['vite.config.ts', '*.test.{j,t}s'],
      },
    ],
    'import/order': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
  },
  overrides: [
    {
      files: ['*.test.{j,t}s'],
      extends: ['plugin:vitest/recommended'],
      rules: {
        '@typescript-eslint/dot-notation': 'off',
        'prefer-destructuring': 'off',
      },
    },
  ],
};
