import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    verbose: true,
    preset: 'ts-jest',
    rootDir: './tests',
    testRegex: '.e2e-spec.ts$',
  };
};
