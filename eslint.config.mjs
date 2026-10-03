import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'coverage/**', '.superpowers/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        describe: 'readonly',
        expect: 'readonly',
        it: 'readonly',
        process: 'readonly',
        setImmediate: 'readonly',
      },
    },
    rules: {},
  },
];
