import type { Options } from '@vitejs/plugin-react'
import { defineVpPlugin } from 'vp-plugin-kit'

export type ReactPluginOption = Options

export const react = defineVpPlugin<ReactPluginOption>({
  name: 'vp-plugin-react',
  vite: () => import('./vite.ts'),
  pack: () => import('./pack.ts')
})
