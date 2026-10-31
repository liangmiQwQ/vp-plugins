import { liangmi } from '@liangmi/vp-config'

export default liangmi({
  // Point workspace dependents at source, so examples can load their config before the kit is built.
  pack: { entry: ['./src/index.ts'], exports: { devExports: true } }
})
