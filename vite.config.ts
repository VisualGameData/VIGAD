import { fileURLToPath, URL } from 'url';
import { rmSync } from 'fs';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
// import electron from 'vite-electron-plugin';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';

rmSync('dist-electron', { recursive: true, force: true });

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    rmSync('dist-electron', { recursive: true, force: true });

    const isServe = command === 'serve';
    const isBuild = command === 'build';
    const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

    return {
        test: {
            // Unit-Test coverage report settings and output directory
            coverage: {
                all: true,
                provider: 'c8',
                reporter: ['text', 'html'],
                reportsDirectory: './tests/unit/coverage',
            },
        },
        plugins: [
            vue(),
            electron([
                {
                    // Main-Process entry file of the Electron App.
                    entry: 'electron/main/index.ts',
                    onstart(options) {
                        if (process.env.VSCODE_DEBUG) {
                            console.log(
                                /* For `.vscode/.debug.script.mjs` */ '[startup] Electron App'
                            );
                        } else {
                            options.startup();
                        }
                    },
                    vite: {
                        build: {
                            sourcemap,
                            minify: isBuild,
                            outDir: 'dist-electron/main',
                            rollupOptions: {
                                external: Object.keys(
                                    'dependencies' in pkg
                                        ? pkg.dependencies
                                        : {}
                                ),
                            },
                        },
                    },
                },
                {
                    entry: 'electron/preload/index.ts',
                    onstart(options) {
                        // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
                        // instead of restarting the entire Electron App.
                        options.reload();
                    },
                    vite: {
                        build: {
                            sourcemap: sourcemap ? 'inline' : undefined,
                            minify: isBuild,
                            outDir: 'dist-electron/preload',
                            rollupOptions: {
                                external: Object.keys(
                                    'dependencies' in pkg
                                        ? pkg.dependencies
                                        : {}
                                ),
                            },
                        },
                    },
                },
            ]),
            // Use Node.js API in the Renderer-process
            renderer(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server:
            process.env.VSCODE_DEBUG &&
            (() => {
                const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
                return {
                    host: url.hostname,
                    port: +url.port,
                };
            })(),
        clearScreen: false,
    };
});
