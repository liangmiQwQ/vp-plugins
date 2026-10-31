import type { PluginKitOption } from './types.ts'

export interface ResolvedOption {
  allowDirectPluginImports: boolean
  bundle: Required<NonNullable<PluginKitOption['bundle']>>
}

export function resolveOption(option: PluginKitOption = {}): ResolvedOption {
  return {
    allowDirectPluginImports: option.allowDirectPluginImports ?? false,
    bundle: {
      exclude: option.bundle?.exclude ?? [],
      redirect: option.bundle?.redirect ?? {}
    }
  }
}
