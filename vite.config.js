import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const root = process.cwd();
	const envConfig = loadEnv(mode, "./");
	return {
		base: "./",
		plugins: [
			Components({
				dirs: ["src/components"],
				extensions: ["vue", "jsx"]
			}),
			AutoImport({
				imports: ["vue"]
			}),
			vue(),
			vueJsx()
		],
		server: {
			cors: true,
			proxy: {
				"/api": {
					target: "https://localhost:7080",
					changeOrigin: true,
					secure: false,
					ws: true
				},
				"/GamaEvent/api": {
					target: "https://localhost:7259",
					changeOrigin: true,
					secure: false,
					ws: true
				},
				"/agent": {
					target: "https://localhost:7259",
					changeOrigin: true,
					secure: false,
					ws: true,
					rewrite: (path) => path.replace(/^\/agent/, "")
				}
			}
		},
		esbuild: {
			drop: ["console", "debugger"]
		},
		build: {
			target: "modules",
			outDir: "dist",
			assetsDir: "assets",
			cssCodeSplit: true,
			emptyOutDir: mode == "devbuild" ? false : true,
			rollupOptions: {
				input: {
					index: path.resolve(__dirname, "index.html"),
					main: path.resolve(__dirname, "main.html")
				},
				// entryFileNames: "assets/js/[name].[hash].js",
				output: {
					entryFileNames: `js/[name].js`,
					chunkFileNames: `js/[name].js`,
					assetFileNames: (assetInfo) => {
						let extType = assetInfo.name.split(".").at(1);
						if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
							extType = "img";
						}
						if (/mp4/i.test(extType)) {
							extType = "video";
						}
						return `${extType}/[name][extname]`;
					}
				}
			}
		}
	};
});
