import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // If you want to keep running your existing tests in Node.js, uncomment the next line.
  'vitest.config.mts',
  {
    extends: 'vitest.config.mts',
    // test: {
    //   browser: {
    //     enabled: true,
    //     name: 'webkit',
    //     provider: 'playwright',
    //     // https://playwright.dev
    //     providerOptions: {},
    //   },
    // },
  },
])
