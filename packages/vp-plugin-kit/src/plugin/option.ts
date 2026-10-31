import type { PluginKitOption } from './types.ts'

export interface ResolvedOption {
  forceLazyPlugins: boolean
  bundle: Required<NonNullable<PluginKitOption['bundle']>>
}

export function resolveOption(option: PluginKitOption = {}): ResolvedOption {
  return {
    forceLazyPlugins: option.forceLazyPlugins ?? true,
    bundle: {
      exclude: option.bundle?.exclude ?? [],
      redirect: option.bundle?.redirect ?? {}
    }
  }
}
