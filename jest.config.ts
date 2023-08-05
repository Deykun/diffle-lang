const { resolve } = require('path');

export default {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleNameMapper: {
        '@api(.*)': '<rootDir>/src/api$1',
        '@components(.*)': '<rootDir>/src/components$1',
        '@hooks(.*)': '<rootDir>/src/hooks$1',
        '@const(.*)': '<rootDir>/src/const$1',
        '^@common-types(.*)$': resolve(__dirname, './src/types.d.ts$'),
        '@store(.*)': '<rootDir>/src/store$1',
        '@utils(.*)': '<rootDir>/src/utils$1',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
