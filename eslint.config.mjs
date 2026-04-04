import expo from "eslint-config-expo/flat.js";
import { defineConfig } from "eslint/config";
import path from "path";
import { fileURLToPath } from "url";
import unusedImports from "eslint-plugin-unused-imports";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  expo,
  {
    ignores: ["dist/*", "functions/lib/**"],

    plugins: {
      "unused-imports": unusedImports,
    },

    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },

    settings: {
      "import/resolver": {
        alias: {
          map: [["@", path.resolve(__dirname, "src")]],
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      },
    },
  },
]);
