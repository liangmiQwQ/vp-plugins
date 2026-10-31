# vp-plugin

`vp-plugin` is a community project designed to provide full range of functionalities, including linting, bundling, building through **a single plugin** with [Vite+](https://viteplus.dev/).

- **One for All**: You no longer need choose lint, format, dev plugin one by one. One plugin can make everything work.
- **Lazy loading**: Each command only loads their needed plugins.
- **Dependencies Overrides**: All code shares the same tool instance, brings better ecosystem compatibility.

```typescript
import { defineConfig } from 'vite-plus'
import { react } from 'vp-plugin-react'

export default defineConfig({
  // Only one plugin is needed
  plugins: [react()],
  lint: {
    rules: {
      'react/globals': 'error'
    }
  }
})
```

```bash
# Check your code with `react` rules enable
vp lint

# Start a dev server with correct JSX & React Compiler transformer
vp dev
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
  plugins: [react()],
  lint: {
    rules: {
      'react/globals': 'error'
    }
  }
})
```

It integrates:

- [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react/) for both Vite and tsdown bundling.
- [`react` Oxilnt Plugin](https://oxc.rs/docs/guide/usage/linter/rules.html?sort=name&dir=asc&scope=react#rules-oxlint) and [`jsx-a11y` Oxlint Plugin](https://oxc.rs/docs/guide/usage/linter/rules.html?sort=name&dir=asc&scope=jsx_a11y#rules-oxlint) for JSX linting.

### Other Frameworks

Currently, due to limitations in Oxlint's template linting, only React is maintained in this repo. We plan to add support for Vue in the future.

## License

[MIT](./LICENSE) License © [Liang Mi](https://github.com/liangmiQwQ) and contributors.
