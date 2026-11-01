import type { PluginOption } from 'vite-plus'
import type { UserConfig as PackConfig } from 'vite-plus/pack'

/** Plugins for `vp pack`, in any shape `pack.plugins` accepts. */
export type PackPluginOption = PackConfig['plugins']

/** A part of the plugin, built from the option the user passes to the plugin factory. */
export type Slot<T, R> = (option?: T) => R | Promise<R>

// Slots are loaded with `import()`, so commands that never need a slot never load its module.
type SlotModule<S> = () => Promise<{ default: S }>

export interface VpPluginDefinition<T> {
  /** Prefix of the generated plugin names, usually the package name. */
  name: string
  /** Vite plugins, loaded only when Vite runs (`dev`, `build`, `test`, `preview`). */
  vite?: SlotModule<Slot<T, PluginOption>>
  /** Pack plugins, added to every `pack` build. */
  pack?: SlotModule<Slot<T, PackPluginOption>>
}
