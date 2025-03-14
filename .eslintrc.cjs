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
    'prettier/react',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react-refresh'],
  rules: {
    'import/prefer-default-export': 'off',
    'arrow-body-style': 'off',
    'react/jsx-indent': ['error', 2],
    'react/jsx-no-undef': [ "error", { "allowGlobals": true } ],
    'react/require-default-props': 0,
    'react/function-component-definition': 0,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'max-len': ['warn', {
      'code': 110,
      'ignoreUrls': true,
      'ignorePattern': '(^import|d="([\\s\\S]*?)|\\srequire\\()',
      'ignoreTrailingComments': true,
    }],
    'no-param-reassign': ['error', {
      ignorePropertyModificationsFor: ['stack'], // Mutating the stack in reduce() is usually more performant
    }],
    'react/react-in-jsx-scope': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': ['warn', {
        /* We list everything that Webpack can bundle into pure JS as deAvDependencies
          for performance reasons, to keep a Docker image as small as possible. */
        devDependencies: true,
        /** Imports should only be validated against top-level package.json */
        packageDir: '.',
    }],
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
