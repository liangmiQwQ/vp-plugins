import type { Plugin } from 'vite-plus'
import type { UserConfig } from 'vite-plus/pack'

import { lazyPlugin } from './lazy.ts'
import { resolveOption } from './option.ts'
import { redirectPlugin } from './redirect.ts'
import type { PluginKitOption } from './types.ts'

export type * from './types.ts'

/** Vite+ plugin that sets up `vp pack` for building a Vite+ plugin. */
export function pluginKit(userOption?: PluginKitOption): Plugin {
  const option = resolveOption(userOption)
  const packConfigItem: UserConfig = {
    plugins: [redirectPlugin(option.bundle), option.forceLazyPlugins && lazyPlugin()]
  }

  return {
    name: 'vp-plugin-kit',
    config(config) {
      // `pack` can list several builds, so append ours instead of replacing them.
      if (Array.isArray(config.pack)) {
        config.pack.push(packConfigItem)
      } else {
        config.pack = packConfigItem
      }
    }
  }
}
