import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { isAbsolute, join } from 'node:path'

import type { TsdownPlugin } from 'vite-plus/pack'

import { DECLARATION_FILE } from './declaration.ts'
import { VITE_PLUS_REDIRECTS } from './redirect.ts'

interface PackageJson {
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

// Vite+'s own packages depend on `vite` too, but they are redirected to the host's `vite-plus`.
const IGNORED_PACKAGES = new Set([
  'vite-plus',
  ...VITE_PLUS_REDIRECTS.map(([from]) => getPackageName(from))
])

// Static imports make the host load every Vite plugin up front, even for commands that never use them.
export function lazyPlugin(): TsdownPlugin {
  // Resolved id -> import specifier, since `moduleParsed` only sees resolved ids.
  const vitePlugins = new Map<string, string>()

  return {
    name: 'vp-plugin-kit:lazy',
    resolveId: {
      // Run before `tsdown:deps`, which externalizes declared dependencies and stops later hooks.
      order: 'pre',
      async handler(id, importer, extraOptions) {
        // Virtual importers like `\0rolldown/runtime.js` have no `node_modules` to look up.
        if (
          importer === undefined ||
          !isAbsolute(importer) ||
          !(await isVitePlugin(id, importer))
        ) {
          return null
        }
        const resolved = await this.resolve(id, importer, { ...extraOptions, skipSelf: true })
        if (resolved !== null) {
          vitePlugins.set(resolved.id, id)
        }
        return resolved
      }
    },
    // Not checking `kind` in `resolveId`: tsdown's `moduleTypes` makes rolldown also resolve `import()` as `import-statement`.
    moduleParsed({ id, importedIds }) {
      // Declaration files only hold type imports, which never load the plugin at runtime.
      if (DECLARATION_FILE.test(id)) {
        return
      }
      const plugin = importedIds.find(imported => vitePlugins.has(imported))
      if (plugin !== undefined) {
        const specifier = vitePlugins.get(plugin)
        this.error(
          `Vite plugin "${specifier}" is imported statically in ${id}. Load it with \`await import('${specifier}')\` instead.`
        )
      }
    }
  }
}

async function isVitePlugin(id: string, importer: string): Promise<boolean> {
  const name = getPackageName(id)
  if (name === undefined || IGNORED_PACKAGES.has(name)) {
    return false
  }
  const pkg = await readPackageJson(name, importer)
  return pkg !== undefined && dependsOnVite(pkg)
}

function dependsOnVite({ dependencies = {}, peerDependencies = {} }: PackageJson): boolean {
  return 'vite' in dependencies || 'vite' in peerDependencies
}

// `@scope/name/sub` -> `@scope/name`, `name/sub` -> `name`. Relative, absolute and virtual ids have no package.
function getPackageName(id: string): string | undefined {
  if (id.startsWith('.') || id.startsWith('\0') || isAbsolute(id)) {
    return undefined
  }
  const segments = id.split('/')
  return id.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0]
}

// Look up `node_modules` like Node does, but read `package.json` directly since many packages don't export it.
async function readPackageJson(name: string, importer: string): Promise<PackageJson | undefined> {
  const dirs = createRequire(importer).resolve.paths(name) ?? []
  const contents = await Promise.all(
    dirs.map(dir => readFile(join(dir, name, 'package.json'), 'utf8').catch(() => {}))
  )
  // The nearest `node_modules` wins, matching Node's resolution order.
  const content = contents.find(text => text !== undefined)
  return content === undefined ? undefined : (JSON.parse(content) as PackageJson)
}
