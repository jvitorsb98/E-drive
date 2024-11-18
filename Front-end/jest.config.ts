import type { Config } from 'jest';

const config: Config = {
  coverageDirectory: 'coverage', // Diretório para os relatórios de cobertura
  coverageReporters: ['html', 'text', 'lcov'], // Formatos dos relatórios de cobertura
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}", // Inclui arquivos principais
    "!**/node_modules/**",  // Ignora node_modules
    "!**/vendor/**",        // Ignora vendor
    "!**/dist/**",          // Ignora build final
    "!**/*.spec.{js,jsx,ts,tsx}", // Ignora arquivos de teste
    "!**/.angular/**",      // Ignora a pasta de cache do Angular
    "!**/coverage/**",      // Ignora a pasta de relatórios de cobertura
    "!<rootDir>/setup-jest.ts",  // Ignora o arquivo de setup do Jest
    "!**/*.config.{js,ts}", // Ignora arquivos de configuração
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
