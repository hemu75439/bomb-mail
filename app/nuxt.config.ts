// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  // modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "nuxt-electron"],
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  // electron: {
  //   build: [
  //     {
  //       // Main-Process entry file of the Electron App.
  //       entry: 'electron/main.ts',
  //     },
  //     {
  //       entry: 'electron/preload.ts',
  //       onstart(args) {
  //         // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
  //         // instead of restarting the entire Electron App.
  //         args.reload()
  //       },
  //     },
  //   ],
    // Ployfill the Electron and Node.js API for Renderer process.
    // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
    // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
  //   renderer: {},
  // },
  ssr: false, // #43
  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: 'http://localhost:4000/api/',
    }
  },
  server: {
    host: '0.0.0.0', // Default: localhost
    port: 3000       // Default: 3000
  },
})