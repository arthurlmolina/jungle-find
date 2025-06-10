import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),

        game: resolve(__dirname, 'game.html'),

        controls: resolve(__dirname, 'controls.html'),
        credits: resolve(__dirname, 'credits.html'),
      },
    },
  },
});