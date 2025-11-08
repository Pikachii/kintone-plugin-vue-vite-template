import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import FormData from 'form-data'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

/**
 * Upload the plugin to kintone
 * 
 * This script requires the following environment variables:
 * - KINTONE_BASE_URL: Your kintone domain (e.g., https://example.cybozu.com)
 * - KINTONE_USERNAME: Your kintone username
 * - KINTONE_PASSWORD: Your kintone password
 * 
 * Optional:
 * - KINTONE_APP_ID: App ID to install the plugin (if updating)
 */
async function uploadPlugin() {
  const pluginPath = path.join(rootDir, 'plugin.zip')

  // Check if plugin.zip exists
  if (!fs.existsSync(pluginPath)) {
    console.error('Error: plugin.zip not found. Please run "npm run package" first.')
    process.exit(1)
  }

  // Get environment variables
  const baseUrl = process.env.KINTONE_BASE_URL
  const username = process.env.KINTONE_USERNAME
  const password = process.env.KINTONE_PASSWORD

  if (!baseUrl || !username || !password) {
    console.error('Error: Missing required environment variables.')
    console.error('Required: KINTONE_BASE_URL, KINTONE_USERNAME, KINTONE_PASSWORD')
    console.log('\nExample usage:')
    console.log('KINTONE_BASE_URL=https://example.cybozu.com \\')
    console.log('KINTONE_USERNAME=your-username \\')
    console.log('KINTONE_PASSWORD=your-password \\')
    console.log('npm run upload')
    process.exit(1)
  }

  try {
    // Create form data
    const form = new FormData()
    form.append('file', fs.createReadStream(pluginPath))

    // Upload to kintone
    const url = `${baseUrl}/k/v1/plugin.json`
    const auth = Buffer.from(`${username}:${password}`).toString('base64')

    console.log(`Uploading plugin to ${baseUrl}...`)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        ...form.getHeaders()
      },
      body: form
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.status} ${response.statusText}\n${errorText}`)
    }

    const result = await response.json()
    console.log('✓ Plugin uploaded successfully!')
    console.log('Plugin ID:', result.id)
    console.log('Plugin Version:', result.version)

  } catch (error) {
    console.error('Error uploading plugin:', error.message)
    process.exit(1)
  }
}

uploadPlugin()
