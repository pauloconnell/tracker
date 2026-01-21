import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
    },
    typecheck: {
      tsconfig: './tsconfig.vitest.json',
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src'), }, },
});
