import { expect, it } from 'vite-plus/test'

import { vpPlugin } from '../src/index.ts'

it('reports that the plugin is not implemented yet', () => {
  expect(vpPlugin).toThrow('Not implemented yet')
})
