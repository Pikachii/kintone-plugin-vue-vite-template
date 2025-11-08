import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Custom plugin to move HTML to root and rename
const moveHtmlToRoot = () => {
  return {
    name: 'move-html-to-root',
    enforce: 'post' as const,
    generateBundle(options: any, bundle: any) {
      // Find HTML files and move them to root with proper naming
      Object.keys(bundle).forEach((fileName) => {
        if (fileName.endsWith('.html')) {
          const asset = bundle[fileName]
          // Get the entry name from the original path (e.g., config from config/index.html)
          let newFileName = fileName
          if (fileName.includes('/')) {
            // Extract directory name as the new file name
            const parts = fileName.split('/')
            const dirName = parts[parts.length - 2]
            newFileName = `${dirName}.html`
          }
          
          if (newFileName !== fileName) {
            bundle[newFileName] = asset
            delete bundle[fileName]
            asset.fileName = newFileName
          }
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), moveHtmlToRoot()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Configuration screen entry point
        config: resolve(__dirname, 'src/config/index.html'),
        // Desktop customization entry point
        desktop: resolve(__dirname, 'src/desktop/index.ts'),
        // Mobile customization entry point (optional)
        mobile: resolve(__dirname, 'src/mobile/index.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Handle CSS files
          if (assetInfo.name?.endsWith('.css')) {
            return '[name].css'
          }
          return '[name][extname]'
        }
      }
    },
    cssCodeSplit: true
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})



