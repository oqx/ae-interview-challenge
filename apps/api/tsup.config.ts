import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  noExternal: ['@ae/typeguards'],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'build',
  platform: 'node'
})
