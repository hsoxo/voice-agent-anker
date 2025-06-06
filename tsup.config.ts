import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.loader = {
      '.png': 'file', // ✅ 让 .png 用 file-loader 处理
    };
  },
});
