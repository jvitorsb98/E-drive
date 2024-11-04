import type {Config} from 'jest';


const config: Config = {
  //collectCoverage: true, // Habilita a coleta de cobertura
  coverageDirectory: 'coverage', // Define o diretório onde os relatórios de cobertura serão gerados
  coverageReporters: ['html', 'text', 'lcov'], // Define os formatos dos relatórios de cobertura a serem gerados
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}", // Inclua arquivos .ts e .tsx
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/*.spec.{js,jsx,ts,tsx}", // Exclua os arquivos de teste
  ],
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  globalSetup: 'jest-preset-angular/global-setup',
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/"
  ],
  transform: {
    '^.+\\.(ts|js|html)$': ['jest-preset-angular', {
      tsConfig: "<rootDir>/tsconfig.spec.json",
      stringifyContentPathRegex: "\\.html$"
    }]
  },
};

export default config;
