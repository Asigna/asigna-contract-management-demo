import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const networkV6Path = path.resolve('./node_modules/@stacks/network-v6')

// @stacks/connect v8 ships @stacks/transactions-v6 as a compat shim.
// That shim imports '@stacks/network' expecting v6 exports (StacksMainnet etc.)
// removed in v7. We redirect only those imports to the v6 copy.
// Two hooks are needed: esbuildOptions.plugins for `yarn dev` (dep pre-bundling)
// and a Vite plugin resolveId for `yarn build` (Rollup).
const stacksNetworkCompatPlugin = {
  name: 'stacks-network-compat',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (source === '@stacks/network' && importer?.replace(/\\/g, '/').includes('transactions-v6')) {
      return this.resolve(networkV6Path, importer, { skipSelf: true })
    }
  },
}

const esbuildStacksNetworkCompat = {
  name: 'stacks-network-compat',
  setup(build) {
    build.onResolve({ filter: /^@stacks\/network$/ }, (args) => {
      if (args.importer.replace(/\\/g, '/').includes('transactions-v6')) {
        return { path: path.join(networkV6Path, 'dist/esm/index.js') }
      }
    })
  },
}

export default defineConfig({
  plugins: [react(), stacksNetworkCompatPlugin],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildStacksNetworkCompat],
    },
  },
})
