import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), viteTsConfigPaths()],
  base: process.env.VITE_BASE_PATH ?? '/higher-or-pwned/',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
});
