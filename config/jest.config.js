module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts', '!<rootDir>/node_modules/'],
  coverageReporters: ['lcov'],
  coverageDirectory: '../coverage',
  //   coverageThreshold: {
  //     global: {
  //       lines: 90,
  //       statements: 90,
  //     },
  //   },
  roots: [
    '<rootDir>/../test',
    //, '<rootDir>/../src'
  ],
  setupFilesAfterEnv: ['../test/jest-config.ts'],
  //   reporters: ['jest-silent-reporter'],
  globals: {
    'ts-jest': {
      tsconfig: {
        module: 'system',
      },
    },
  },
};
