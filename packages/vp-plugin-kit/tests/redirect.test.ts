import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { build } from 'vite-plus/pack'
import { expect, it } from 'vite-plus/test'

import { resolveOption } from '../src/plugin/option.ts'
import { redirectPlugin } from '../src/plugin/redirect.ts'
import type { PluginKitOption } from '../src/plugin/types.ts'

it('redirects tools bundled by Vite+ to vite-plus imports', async () => {
  const output = await pack({
    'index.ts': [
      `export * from 'vite'`,
      `export * from 'vitest/config'`,
      `export * from 'tsdown'`,
      `export * from 'oxlint'`,
      `export * from '@oxlint/plugins'`
    ].join('\n')
  })

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

it('keeps disabled redirects and excluded dependencies as direct imports', async () => {
  const output = await pack(
    {
      'index.ts': `export * from 'vitest/config'\nexport * from 'my-dep/sub'`,
      // A resolvable package, so the test fails if `exclude` lets it get bundled.
      'node_modules/my-dep/sub.js': `export const value = 1`
    },
    { redirect: { vitest: false }, exclude: ['my-dep'] }
  )

  expect(output).toContain(`from "vitest/config"`)
  expect(output).toContain(`from "my-dep/sub"`)
})

async function pack(
  files: Record<string, string>,
  option?: PluginKitOption['bundle']
): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'vp-plugin-kit-'))
  for (const [path, content] of Object.entries(files)) {
    await mkdir(dirname(join(dir, path)), { recursive: true })
    await writeFile(join(dir, path), content)
  }

  await build({
    cwd: dir,
    entry: ['index.ts'],
    dts: false,
    logLevel: 'silent',
    config: false,
    plugins: [redirectPlugin(resolveOption({ bundle: option }).bundle)]
  })
  return readFile(join(dir, 'dist/index.mjs'), 'utf8')
}
