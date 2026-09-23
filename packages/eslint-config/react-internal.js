import { config as baseConfig } from "./base.js";

/**
 * A shared ESLint configuration for React libraries.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  ...baseConfig,
];
