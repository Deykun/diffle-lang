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
  plugins: ['react-refresh', 'eslint-plugin-react-compiler'],
  rules: {
    'react-compiler/react-compiler': 'error',
    'import/prefer-default-export': 'off',
    'arrow-body-style': 'off',
    'arrow-parens': ['error', 'as-needed', {
      requireForBlockBody: true,
    }],
    'react/jsx-indent': ['error', 4],
    'react/jsx-no-undef': [ "error", { "allowGlobals": true } ],
    'react/require-default-props': 0,
    'react/function-component-definition': 0,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'max-len': ['warn', {
      'code': 140,
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
  settings: {
    'import/resolver': {
      'alias-array': {
        alias: true,
        map: [
          ['@api', resolve(__dirname, './src/api/')],
          ['@components', resolve(__dirname, './src/components/')],
          ['@store', resolve(__dirname, './src/store/')],
          ['@utils', resolve(__dirname, './src/utils/')],
        ],
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
