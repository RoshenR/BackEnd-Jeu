// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

export default [
    // Base (par défaut: Node)
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            // tu peux garder strict, mais je te mets le minimum
            "no-console": "off",
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },

    // Front: autoriser document/window/etc.
    {
        files: ["front/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },

    // Tests Mocha: autoriser describe/it/beforeEach/afterEach...
    {
        files: ["tests/**/*.js", "tests/**/*.test.js"],
        languageOptions: {
            globals: {
                ...globals.mocha,
            },
        },
    },
];
