import type { TsdownPlugin } from 'vite-plus/pack'

import type { ResolvedOption } from './option.ts'

type BundleOption = ResolvedOption['bundle']
type Redirect = readonly [from: string, to: string]

// Longer names come first so `oxlint/plugins-dev` wins over `oxlint`.
export const VITE_PLUS_REDIRECTS = [
  ['@oxlint/plugins', 'vite-plus/lint/plugins'],
  ['oxlint/plugins-dev', 'vite-plus/lint/plugins-dev'],
  ['oxlint', 'vite-plus/lint'],
  ['oxfmt', 'vite-plus/fmt'],
  ['tsdown', 'vite-plus/pack'],
  ['vitest', 'vite-plus/test'],
  ['vite', 'vite-plus']
] as const

export function redirectPlugin(option: BundleOption): TsdownPlugin {
  const redirects = createRedirects(option)
  return {
    name: 'vp-plugin-kit:redirect',
    resolveId(id) {
      // Keep redirected imports external so the plugin uses the host's `vite-plus` instead of bundling a copy.
      const target = redirect(id, redirects)
      return target === undefined ? null : { id: target, external: true }
    }
  }
}

// Disabled and excluded sources redirect to themselves, so they stay external but keep their import path.
function createRedirects({ exclude, redirect }: BundleOption): Redirect[] {
  const redirects = VITE_PLUS_REDIRECTS.map(([from, to]): Redirect => [
    from,
    redirect[from] === false ? from : to
  ])
  return [...redirects, ...exclude.map((dep): Redirect => [dep, dep])]
}

// Match whole path segments so `vitest` is not treated as a subpath of `vite`.
function redirect(id: string, redirects: Redirect[]): string | undefined {
  for (const [from, to] of redirects) {
    if (id === from) {
      return to
    }
    if (id.startsWith(`${from}/`)) {
      return to + id.slice(from.length)
    }
  }
  return undefined
}
