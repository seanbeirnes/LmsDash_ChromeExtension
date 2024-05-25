import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: resolve(rootDir, 'public'),
  outDir: resolve(rootDir, 'dist'),
  build:
  {
    minify: isProduction, // is false in dev mode
    rollupOptions: 
      {
          input: {
            SidePanel: resolve(srcDir, 'SidePanel', 'index.html'),
            ServiceWorker: resolve(srcDir, 'ServiceWorker', 'main.js')
          },
          output: {
            entryFileNames: 'src/[name]/index.js',
            chunkFileNames: '[name]/index.js',
            assetFileNames: 'assets/[name].[ext]',
            format: 'es'
          }
      }
  }
})
