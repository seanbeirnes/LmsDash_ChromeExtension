import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: resolve(rootDir, 'public'),
  outDir: resolve(rootDir, 'dist'),
  build:
  {
    rollupOptions: {
      input: {
        serviceWorker: resolve(srcDir, 'serviceWorker', 'main.js'),
        contentScript: resolve(srcDir, 'contentScript', 'main.js'),
        sidepanel: resolve(srcDir, 'sidePanel', 'index.html'),
      },
      output: {
        entryFileNames: `src/[name]/index.js`,
        chunkFileNames: `[name]/index.js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})
