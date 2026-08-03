import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  splitting: false,
  noExternal: ['better-auth', '@better-auth/core', '@better-auth/drizzle-adapter', '@better-auth/utils', '@better-fetch/fetch'],
  shims: true,
})
