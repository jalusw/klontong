// @ts-check
import js from "@eslint/js";
import ts from "typescript-eslint";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import prettier from "eslint-config-prettier";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["dist", "node_modules", "**/*.d.ts", "coverage", "eslint.config.js", ".eslintrc.cjs"],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs["flat/recommended"],
  prettier,
  {
    files: ["**/*.{js,cjs,mjs,ts,tsx,vue}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parser: vueParser,
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: [".vue"],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": ts.plugin,
      vue,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];
