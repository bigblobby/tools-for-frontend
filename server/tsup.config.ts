import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node24',
  outDir: 'dist',
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  treeshake: true,
  dts: false,
  esbuildOptions(options) {
    // Resolve @ path alias to src directory
    options.alias = {
      '@': './src',
    };
  },
});

