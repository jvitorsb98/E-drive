import type { Config } from 'jest';

const config: Config = {
  coverageDirectory: 'coverage', // Diretório para os relatórios de cobertura
  coverageReporters: ['html', 'text', 'lcov'], // Formatos dos relatórios de cobertura
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}", // Inclui arquivos .ts e .tsx
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/*.spec.{js,jsx,ts,tsx}", // Exclui arquivos de teste
  ],
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  transform: {
    '^.+\\.(ts|js|html)$': ['jest-preset-angular', {
      tsconfig: '<rootDir>/tsconfig.spec.json', // Altere 'tsConfig' para 'tsconfig'
      stringifyContentPathRegex: '\\.html$',
    }],
  },
};

export default config;
