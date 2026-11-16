import js from "@eslint/js";
import globals from "globals";
import hooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
// Espree parses JSX; mark component references so import analysis follows the JSX runtime.
const jsxReferences = {
  rules: {
    uses: {
      create(context) {
        return {
          JSXOpeningElement(node) {
            let name = node.name;
            while (name.type === "JSXMemberExpression") name = name.object;
            if (name.type === "JSXIdentifier" && /^[A-Z]/.test(name.name))
              context.sourceCode.markVariableAsUsed(name.name, node);
          },
        };
      },
    },
  },
};
export default [
  { ignores: ["dist/**", "node_modules/**", ".qa/**"] },
  {
    files: ["src/**/*.{js,jsx,mjs}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": [
        "error",
        { args: "none", caughtErrors: "none", varsIgnorePattern: "^_" },
      ],
      "unused-imports/no-unused-imports": "error",
      "jsx-references/uses": "error",
      "react-hooks/rules-of-hooks": "error",
    },
    plugins: {
      "react-hooks": hooks,
      "unused-imports": unusedImports,
      "jsx-references": jsxReferences,
    },
  },
  {
    files: ["src/**/*.mjs"],
    rules: {
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
