import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

/**
 * Update manifest.json with actual built file names
 * This handles dynamic chunk names with hashes
 */
function updateManifest() {
  const distDir = path.join(rootDir, 'dist')
  const manifestPath = path.join(rootDir, 'manifest.json')

  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory not found. Please run build first.')
    process.exit(1)
  }

  if (!fs.existsSync(manifestPath)) {
    console.error('Error: manifest.json not found.')
    process.exit(1)
  }

  // Read current manifest
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

  // Get all files in dist (including subdirectories)
  const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath)

    files.forEach((file) => {
      const filePath = path.join(dirPath, file)
      if (fs.statSync(filePath).isDirectory()) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
      } else {
        arrayOfFiles.push(path.relative(distDir, filePath))
      }
    })

    return arrayOfFiles
  }

  const distFiles = getAllFiles(distDir)

  // Find all JS chunks
  const jsChunks = distFiles.filter(f => f.startsWith('chunks/') && f.endsWith('.js'))
  
  // Find CSS files
  const configCSS = distFiles.filter(f => f === 'config.css')
  const componentCSS = distFiles.filter(f => !f.includes('config.css') && f.endsWith('.css') && !f.includes('/'))

  // Update manifest
  manifest.desktop = {
    js: [...jsChunks, 'desktop.js'],
    css: componentCSS
  }

  manifest.mobile = {
    js: [...jsChunks, 'mobile.js'],
    css: componentCSS
  }

  manifest.config = {
    html: 'config.html',
    js: [
      ...jsChunks.filter(f => f.includes('_plugin-vue_export-helper')),
      'config.js'
    ],
    css: configCSS,
    required_params: []
  }

  // Write updated manifest to dist
  const distManifestPath = path.join(distDir, 'manifest.json')
  fs.writeFileSync(distManifestPath, JSON.stringify(manifest, null, 2))

  console.log('✓ Manifest updated successfully')
  console.log('  Desktop JS:', manifest.desktop.js)
  console.log('  Desktop CSS:', manifest.desktop.css)
  console.log('  Mobile JS:', manifest.mobile.js)
  console.log('  Mobile CSS:', manifest.mobile.css)
  console.log('  Config JS:', manifest.config.js)
  console.log('  Config CSS:', manifest.config.css)
}

updateManifest()
