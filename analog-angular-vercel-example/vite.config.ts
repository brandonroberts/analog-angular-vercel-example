/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, Plugin, splitVendorChunkPlugin } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',

    optimizeDeps: {
      include: ['@angular/common', '@angular/forms'],
    },
    build: {
      target: ['es2020'],
    },
    plugins: [
      analog({
        ssrBuildDir: '../dist/./analog-angular-vercel-example/ssr',
        entryServer: './analog-angular-vercel-example/src/main.server.ts',
        vite: {
          inlineStylesExtension: 'css',
          tsconfig:
            mode === 'test'
              ? './analog-angular-vercel-example/tsconfig.spec.json'
              : './analog-angular-vercel-example/tsconfig.app.json',
        },
        nitro: {
          rootDir: './analog-angular-vercel-example',
          output: {
            dir: '../../dist/./analog-angular-vercel-example/analog',
            publicDir:
              '../../dist/./analog-angular-vercel-example/analog/public',
          },
          publicAssets: [
            { dir: `../../dist/./analog-angular-vercel-example/client` },
          ],
          serverAssets: [
            {
              baseName: 'public',
              dir: `./dist/./analog-angular-vercel-example/client`,
            },
          ],
          buildDir: '../dist/./analog-angular-vercel-example/.nitro',
        },
        prerender: {
          routes: ['/'],
        },
      }),
      tsConfigPaths({
        root: '../',
      }),
      visualizer() as Plugin,
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      cache: {
        dir: `../node_modules/.vitest`,
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
