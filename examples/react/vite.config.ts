import { liangmi } from '@liangmi/vp-config'
import { pluginKit } from 'vp-plugin-kit'

export default liangmi({
  plugins: [pluginKit()],
  pack: { entry: ['./src/index.ts'] }
})
