import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  js.configs.recommended,
  {
    plugins: {
      "unused-imports": unusedImports
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        URLSearchParams: "readonly",
        URL: "readonly",
        AbortSignal: "readonly"
      }
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^(next|_)" }
      ]
    }
  }
];
