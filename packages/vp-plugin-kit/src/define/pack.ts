import type { UserConfig } from 'vite-plus'
import type { UserConfig as PackConfig } from 'vite-plus/pack'

import type { PackPluginOption } from './types.ts'

// `pack` can list several builds, and each one needs the plugins.
export function pushPackPlugins(config: UserConfig, plugins: PackPluginOption): void {
  const push = (item: PackConfig = {}): PackConfig => ({
    ...item,
    plugins: [item.plugins, plugins]
  })
  config.pack = Array.isArray(config.pack) ? config.pack.map(item => push(item)) : push(config.pack)
}
