// @ts-expect-error This is used at buildtime, and uses `pnpx` to install in order to add the correct system binaries.
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
