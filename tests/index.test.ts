import { expect, it } from 'vite-plus/test'

import { vpPlugins } from '../src/index.ts'

it('reports that the plugin is not implemented yet', () => {
  expect(vpPlugins).toThrow('Not implemented yet')
})
