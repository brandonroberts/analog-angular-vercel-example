/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
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
        nitro: {
          output: {
            dir: '../../../.vercel/output',
            publicDir: '../../../.vercel/output/static',
          },
        },
      }),
      tsConfigPaths({
        root: '../',
      }),
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
