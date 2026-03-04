import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @stacks/connect v8 ships @stacks/transactions-v6 as a compat shim.
// That shim imports '@stacks/network' expecting v6 exports (StacksMainnet etc.)
// which were removed in v7. Redirect those imports to the @stacks/network-v6
// alias that @stacks/connect already installs.
const stacksNetworkCompat = {
  name: 'stacks-network-compat',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (source === '@stacks/network' && importer && importer.replace(/\\/g, '/').includes('transactions-v6')) {
      return this.resolve('@stacks/network-v6', importer, { skipSelf: true })
    }
  },
}

export default defineConfig({
  plugins: [react(), stacksNetworkCompat],
})
