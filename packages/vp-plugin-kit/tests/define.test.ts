import { resolveConfig } from 'vite-plus'
import type { Plugin, PluginOption, ResolvedConfig, UserConfig } from 'vite-plus'
import { afterEach, expect, it, vi } from 'vite-plus/test'

import { definePackPlugins, defineVitePlugins, defineVpPlugin } from '../src/index.ts'

afterEach(() => {
  vi.unstubAllEnvs()
})

it('loads Vite plugins only when Vite runs, not when Vite+ reads config metadata', async () => {
  const plugin = createPlugin()

  // The same marker Vite+ sets while resolving config for `vp lint`, `vp fmt`, etc.
  vi.stubEnv('VP_RESOLVING_CONFIG_METADATA', '1')
  const metadata = await resolve({ plugins: [plugin()] })
  vi.unstubAllEnvs()
  const full = await resolve({ plugins: [plugin()] })

  expect(pluginNames(metadata)).not.toContain('test:vite')
  expect(pluginNames(full)).toContain('test:vite')
})

it('adds pack plugins to every pack build', async () => {
  const plugin = createPlugin()
  const config = await resolve({
    plugins: [plugin()],
    pack: [{ entry: 'a.ts', plugins: [{ name: 'user' }] }, { entry: 'b.ts' }]
  })

  const packs = [config.pack].flat()
  expect(packs.map(pack => packPluginNames(pack?.plugins))).toEqual([
    ['user', 'test:pack'],
    ['test:pack']
  ])
})

function createPlugin(): (option?: unknown) => PluginOption[] {
  return defineVpPlugin({
    name: 'test',
    vite: () => Promise.resolve({ default: defineVitePlugins(() => ({ name: 'test:vite' })) }),
    pack: () => Promise.resolve({ default: definePackPlugins(() => [{ name: 'test:pack' }]) })
  })
}

async function resolve(config: UserConfig): Promise<ResolvedConfig> {
  return resolveConfig({ ...config, configFile: false, logLevel: 'silent' }, 'build')
}

function pluginNames(config: ResolvedConfig): string[] {
  return config.plugins.map(plugin => plugin.name)
}

function packPluginNames(plugins: unknown): string[] {
  return [plugins].flat(Infinity).flatMap(plugin => (plugin ? [(plugin as Plugin).name] : []))
}
