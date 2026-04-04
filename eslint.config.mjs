import expo from "eslint-config-expo/flat.js";
import { defineConfig } from "eslint/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  expo,
  {
    ignores: ["dist/*", "functions/lib/**"],
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
