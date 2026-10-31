import type { Plugin } from 'vite-plus'
import type { PackUserConfig, TsdownPlugin } from 'vite-plus/pack'

import type { PluginKitOption } from './types.ts'

export function pluginKit(_option: PluginKitOption): Plugin {
  return {
    name: 'vp-plugin-kit',
    config(config) {
      // Mutate in place: returning `{ pack }` would append a new build when `pack` is an array.
      config.pack = Array.isArray(config.pack)
        ? config.pack.map(withPackPlugin)
        : withPackPlugin(config.pack ?? {})
    }
  }
}

function withPackPlugin(pack: PackUserConfig): PackUserConfig {
  return { ...pack, plugins: [pack.plugins, packPlugin()] }
}

function packPlugin(): TsdownPlugin {
  return {
    name: 'vp-plugin-kit:pack'
  }
}
