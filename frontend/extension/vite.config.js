import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import fs from "fs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tailwindcss(),

      // Custom plugin to generate manifest.json
      {
        name: "generate-manifest",
        generateBundle() {
          const template = fs.readFileSync("manifest.template.json", "utf-8");

          const backendUrl = env.VITE_APP_URL ? `"${env.VITE_APP_URL}/*"` : "";

          const processed = template.replace(
            '"__BACKEND_PERMISSIONS__"',
            backendUrl
          );

          this.emitFile({
            type: "asset",
            fileName: "manifest.json",
            source: processed,
          });
        },
      },
    ],

    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          background: resolve(__dirname, "src/background/background.js"),
        },
        output: {
          entryFileNames: (chunkInfo) =>
            chunkInfo.name === "background"
              ? "[name].js"
              : "assets/[name]-[hash].js",
        },
      },
    },

    define: {
      "import.meta.env.VITE_APP_URL": JSON.stringify(env.VITE_APP_URL),
    },
  };
});
