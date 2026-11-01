import { lazyPlugins } from 'vite-plus'
import type { Plugin, PluginOption, UserConfig } from 'vite-plus'

import { pushPackPlugins } from './pack.ts'
import type { PackPluginOption, Slot, VpPluginDefinition } from './types.ts'

export type * from './types.ts'

/** Combine the parts of a Vite+ plugin into one plugin factory for users. */
export function defineVpPlugin<T>(
  definition: VpPluginDefinition<T>
): (option?: T) => PluginOption[] {
  const { name, vite, pack } = definition
  return option => [
    // `lazyPlugins` skips the factory while Vite+ only reads config blocks for `lint`, `fmt`, `pack`, etc.
    vite && lazyPlugins(async () => [await run(vite, option)]),
    // `pack` is read from the resolved config, so it is applied by a `config` hook.
    pack && configPlugin(`${name}:pack`, () => run(pack, option), pushPackPlugins)
  ]
}

export function defineVitePlugins<T>(slot: Slot<T, PluginOption>): Slot<T, PluginOption> {
  return slot
}

export function definePackPlugins<T>(slot: Slot<T, PackPluginOption>): Slot<T, PackPluginOption> {
  return slot
}

async function run<T, R>(load: () => Promise<{ default: Slot<T, R> }>, option?: T): Promise<R> {
  const { default: slot } = await load()
  return slot(option)
}

function configPlugin<R>(
  name: string,
  load: () => Promise<R>,
  merge: (config: UserConfig, value: R) => void
): Plugin {
  return {
    name,
    async config(config) {
      merge(config, await load())
    }
  }
}
