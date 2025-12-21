// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

export default [
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
            // adapte si besoin
            "no-unused-vars": "warn",
            "no-console": "off",
        },
    },
];
