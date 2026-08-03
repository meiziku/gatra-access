const { defineConfig } = require('tsup')

module.exports = defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  outDir: 'api',
  clean: true,
  splitting: false,
  noExternal: [/.*/],
  shims: true,
})
