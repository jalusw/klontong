/* eslint-env node */
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2023,
    sourceType: "module",
    extraFileExtensions: [".vue"],
  },
  plugins: ["@typescript-eslint", "vue"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  rules: {
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
  ignorePatterns: ["dist", "node_modules", "**/*.d.ts"],
};
