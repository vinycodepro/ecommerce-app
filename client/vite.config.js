/// <reference types="vitest/config" />
// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: [{
      find: '@components',
      replacement: path.resolve(__dirname, 'src/components')
    }, {
      find: '@services',
      replacement: path.resolve(__dirname, 'src/services')
    }, {
      find: '@shared',
      replacement: path.resolve(__dirname, 'src/components/Shared')
    }, {
      find: '@',
      replacement: path.resolve(__dirname, 'src')
    }, {
      find: '@pages',
      replacement: path.resolve(__dirname, 'src/pages')
    }, {
      find: '@contexts',
      replacement: path.resolve(__dirname, 'src/contexts')
    }, {
      find: '@styles',
      replacement: path.resolve(__dirname, 'src/styles')
    }]
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});