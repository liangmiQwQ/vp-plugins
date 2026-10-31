import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { build } from 'vite-plus/pack'
import { expect, it } from 'vite-plus/test'

import { createPackConfig } from '../src/redirect.ts'

it('redirects tools bundled by Vite+ to vite-plus imports', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'vp-plugin-kit-'))
  const source = [
    `export * from 'vite'`,
    `export * from 'vitest/config'`,
    `export * from 'tsdown'`,
    `export * from 'oxlint'`,
    `export * from '@oxlint/plugins'`
  ].join('\n')
  await writeFile(join(dir, 'index.ts'), source)

  const config = createPackConfig({ cwd: dir, entry: ['index.ts'], dts: false, logLevel: 'silent' })
  await build({ ...config, config: false })
  const output = await readFile(join(dir, 'dist/index.mjs'), 'utf8')

  for (const id of [
    'vite-plus',
    'vite-plus/test/config',
    'vite-plus/pack',
    'vite-plus/lint',
    'vite-plus/lint/plugins'
  ]) {
    expect(output).toContain(`from "${id}"`)
  }
})
