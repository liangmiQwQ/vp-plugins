import type { PackUserConfig, TsdownPlugin } from 'vite-plus/pack'

// Longer names come first so `oxlint/plugins-dev` wins over `oxlint`.
const VITE_PLUS_REDIRECTS: [from: string, to: string][] = [
  ['@oxlint/plugins', 'vite-plus/lint/plugins'],
  ['oxlint/plugins-dev', 'vite-plus/lint/plugins-dev'],
  ['oxlint', 'vite-plus/lint'],
  ['oxfmt', 'vite-plus/fmt'],
  ['tsdown', 'vite-plus/pack'],
  ['vitest', 'vite-plus/test'],
  ['vite', 'vite-plus']
]

export function createPackConfig(config: PackUserConfig): PackUserConfig {
  return { ...config, plugins: [config.plugins, redirectPlugin()] }
}

function redirectPlugin(): TsdownPlugin {
  return {
    name: 'vp-plugin-kit:redirect',
    resolveId(id) {
      const target = redirect(id)
      return target === undefined ? null : { id: target, external: true }
    }
  }
}

function redirect(id: string): string | undefined {
  for (const [from, to] of VITE_PLUS_REDIRECTS) {
    if (id === from) {
      return to
    }
    if (id.startsWith(`${from}/`)) {
      return to + id.slice(from.length)
    }
  }
  return undefined
}
