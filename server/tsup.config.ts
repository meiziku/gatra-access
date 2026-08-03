import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  outDir: 'api',
  clean: true,
  splitting: false,
  noExternal: [/.*/],
  shims: true,
})
