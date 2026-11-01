import { definePackPlugins } from 'vp-plugin-kit'

import type { ReactPluginOption } from './index.ts'

// Slot modules use a default export, the shape `import()` loads.
// oxlint-disable-next-line import/no-default-export
export default definePackPlugins(async (option?: ReactPluginOption) => {
  const { default: react } = await import('@vitejs/plugin-react')
  return react(option)
})
