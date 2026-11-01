# vp-plugin

`vp-plugin` is a community project designed to provide full range of functionalities, including dev server, bundling, building through **a single plugin** with [Vite+](https://viteplus.dev/).

## Highlights

- **One for All**: You no longer need to choose dev and pack plugins one by one. One plugin can make everything work.
- **Lazy loading**: Each command only loads their needed plugins.
- **Dependencies Overrides**: All code shares the same tool instance, brings better ecosystem compatibility.

```typescript
import { defineConfig } from 'vite-plus'
import { react } from 'vp-plugin-react'

export default defineConfig({
  // Only one plugin is needed
  plugins: [react()]
})
```

```bash
# Start a dev server with correct JSX & React Compiler transformer
vp dev

# Bundle a library with reliable language features
vp pack
```

## Plugin Kit

<!-- WIP -->

## Pre-made Plugins

### React

```bash
pnpm install -D vp-plugin-react
```

```typescript
import { defineConfig } from 'vite-plus'
import { react } from 'vp-plugin-react'

export default defineConfig({
  // Only one plugin is needed
  plugins: [react()]
})
```

It integrates:

- [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react/) for both Vite and tsdown bundling.

### Other Frameworks

Currently, only React is maintained in this repo. We plan to add support for Vue in the future.

## License

[MIT](./LICENSE) License © [Liang Mi](https://github.com/liangmiQwQ) and contributors.
