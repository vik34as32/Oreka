import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";
import { comlink } from "vite-plugin-comlink";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: "prompt",
  includeAssets: ["logo.png"],
  manifest: {
    short_name: "Oreka",
    name: "Oreka",
    icons: [
      {
        src: "logo512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "logo192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    start_url: "/",
    display: "standalone",
    theme_color: "#000000",
    background_color: "#ffffff",
    prefer_related_applications: true,
  },
};

// https://vitejs.dev/config/
// export default defineConfig({
//   resolve: {
//     alias: {
//       "@svg": path.resolve(__dirname, "src/assets/icons/"),
//     },
//   },
//   plugins: [
//     svgr({
//       exportAsDefault: true,
//     }),
//     react(),
//     comlink(),
//     VitePWA(manifestForPlugin),
//   ],
//   worker: {
//     plugins: [comlink()],
//   },
// });

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
  plugins: [react()],
});