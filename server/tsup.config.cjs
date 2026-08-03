const { defineConfig } = require('tsup')

module.exports = defineConfig({
  entry: {
    index: 'src/server.ts'
  },
  format: ['cjs'],
  outDir: 'api',
  clean: true,
  splitting: false,
  noExternal: [/.*/],
  shims: true,
})
