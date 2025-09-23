import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/dota-dashboard' : '/',
    plugins: [vue()],
    server: {
      open: true
    },
    resolve: {
      alias: {
        '@/pages': path.resolve(__dirname, 'src/pages'),
        '@/assets': path.resolve(__dirname, 'src/assets'),
        '@/utils': path.resolve(__dirname, 'src/utils'),
        '@/service': path.resolve(__dirname, 'src/service'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/hooks': path.resolve(__dirname, 'src/hooks')
      },
      extensions: ['.vue', '.js']
    }
  };
});
