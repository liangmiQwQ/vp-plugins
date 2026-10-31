import type { VITE_PLUS_REDIRECTS } from './redirect.ts'

/**
 * - `eager`: load Vite plugins as soon as the config is resolved.
 * - `lazy`: load Vite plugins only when the running command needs them.
 */
export type VitePluginMode = 'eager' | 'lazy'

type RedirectSource = (typeof VITE_PLUS_REDIRECTS)[number][0]

export interface PluginKitOption {
  /** Deny direct imports of Vite plugins. Default: `true` */
  forceLazyPlugins?: boolean
  /** How the plugin is bundled by `vp pack`. */
  bundle?: {
    /** Dependencies kept out of the bundle. Default: `[]` */
    exclude?: string[]
    /** Set a source to `false` to keep importing it directly instead of through `vite-plus`. Default: all `true` */
    redirect?: Partial<Record<RedirectSource, boolean>>
  }
}
