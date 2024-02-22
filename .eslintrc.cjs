const { resolve } = require('path');

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react-refresh'],
  rules: {
    "react/jsx-no-undef": [ "error", { "allowGlobals": true } ],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "import/extensions": 0
  },
  settings: {
    'import/resolver': {
      'alias-array': {
        map: [
          ['@api', resolve(__dirname, './src/api/')],
          ['@components', resolve(__dirname, './src/components/')],
          ['@store', resolve(__dirname, './src/store/')],
          ['@utils', resolve(__dirname, './src/utils/')],
        ]
      }
    }
  },
  overrides: [
      {
          files: ['*.ts', '*.tsx'],
          rules: {
              "no-undef": "off"
          }
      }
  ]
}
