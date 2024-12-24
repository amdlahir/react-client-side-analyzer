import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import type { UserConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache']
  }
} as UserConfig)
