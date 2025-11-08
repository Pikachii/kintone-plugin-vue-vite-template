import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import archiver from 'archiver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

/**
 * Package the plugin into a zip file
 * Following the kintone plugin format specification
 */
async function packagePlugin() {
  const distDir = path.join(rootDir, 'dist')
  const outputPath = path.join(rootDir, 'plugin.zip')

  // Check if dist directory exists
  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory not found. Please run "npm run build" first.')
    process.exit(1)
  }

  // Check if manifest.json exists in dist
  const distManifestPath = path.join(distDir, 'manifest.json')
  if (!fs.existsSync(distManifestPath)) {
    console.error('Error: manifest.json not found in dist. Please run "npm run build" first.')
    process.exit(1)
  }

  // Remove existing plugin.zip if it exists
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath)
  }

  // Create output stream
  const output = fs.createWriteStream(outputPath)
  const archive = archiver('zip', {
    zlib: { level: 9 }
  })

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`✓ Plugin packaged successfully: ${outputPath}`)
      console.log(`  Total size: ${archive.pointer()} bytes`)
      resolve()
    })

    archive.on('error', (err) => {
      reject(err)
    })

    archive.pipe(output)

    // Add all files from dist directory
    archive.directory(distDir, false)

    // Add icon if exists (SVG as placeholder if PNG doesn't exist)
    const iconPngPath = path.join(rootDir, 'public', 'icon.png')
    const iconSvgPath = path.join(rootDir, 'public', 'icon.svg')
    
    if (fs.existsSync(iconPngPath)) {
      archive.file(iconPngPath, { name: 'icon.png' })
    } else if (fs.existsSync(iconSvgPath)) {
      // Note: kintone requires PNG, but we'll include SVG as placeholder
      console.warn('⚠ Warning: icon.png not found. Please add a 48x48 PNG icon.')
    }

    archive.finalize()
  })
}

packagePlugin().catch(err => {
  console.error('Error packaging plugin:', err)
  process.exit(1)
})
