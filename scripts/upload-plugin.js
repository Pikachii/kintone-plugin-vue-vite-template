import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import readline from 'readline'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const configPath = path.join(rootDir, '.kintone-plugin-uploader.json')
const defaultPluginPath = path.join(rootDir, 'dist', 'plugin.zip')

const ask = (question, { mask = false } = {}) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    })

    if (mask) {
      rl.stdoutMuted = true
      rl._writeToOutput = (stringToWrite) => {
        if (rl.stdoutMuted) {
          rl.output.write('*')
        } else {
          rl.output.write(stringToWrite)
        }
      }
    }

    rl.question(question, (answer) => {
      rl.stdoutMuted = false
      rl.output.write('\n')
      rl.close()
      resolve(answer.trim())
    })
  })

function readConfig() {
  if (!fs.existsSync(configPath)) return {}

  try {
    const raw = fs.readFileSync(configPath, 'utf-8')
    return JSON.parse(raw)
  } catch (error) {
    console.warn(`Could not parse ${path.basename(configPath)}. Falling back to prompts.`)
    console.warn(error.message)
    return {}
  }
}

async function buildOptions() {
  const fromFile = readConfig()

  const has = (key) => Object.prototype.hasOwnProperty.call(fromFile, key)

  const baseUrl = has('baseUrl')
    ? fromFile.baseUrl
    : await ask('Base URL (e.g. https://example.cybozu.com): ')
  const username = has('username') ? fromFile.username : await ask('Login username: ')
  const password = has('password') ? fromFile.password : await ask('Login password: ', { mask: true })

  const basicAuthUsername = has('basicAuthUsername')
    ? fromFile.basicAuthUsername
    : await ask('Basic auth username (optional): ')
  const basicAuthPassword = has('basicAuthPassword')
    ? fromFile.basicAuthPassword
    : basicAuthUsername
    ? await ask('Basic auth password (optional): ', { mask: true })
    : ''

  const guestSpaceId = has('guestSpaceId')
    ? fromFile.guestSpaceId
    : await ask('Guest space ID (optional): ')

  const pluginZipPath = path.resolve(
    rootDir,
    has('pluginZipPath') ? fromFile.pluginZipPath : defaultPluginPath,
  )

  return {
    baseUrl,
    username,
    password,
    basicAuthUsername,
    basicAuthPassword,
    guestSpaceId,
    pluginZipPath,
  }
}

async function run() {
  const {
    baseUrl,
    username,
    password,
    basicAuthUsername,
    basicAuthPassword,
    guestSpaceId,
    pluginZipPath,
  } = await buildOptions()

  if (!fs.existsSync(pluginZipPath)) {
    console.error(`Error: ${pluginZipPath} not found. Please run "npm run package" first.`)
    process.exit(1)
  }

  const args = [
    pluginZipPath,
    '--base-url',
    baseUrl,
    '--username',
    username,
    '--password',
    password,
  ]

  if (basicAuthUsername && basicAuthPassword) {
    args.push('--basic-auth-username', basicAuthUsername, '--basic-auth-password', basicAuthPassword)
  }

  if (guestSpaceId) {
    args.push('--guest-space-id', guestSpaceId)
  }

  console.log(`Uploading ${pluginZipPath} to ${baseUrl} with kintone-plugin-uploader...`)

  const uploader = spawn('npx', ['kintone-plugin-uploader', ...args], {
    cwd: rootDir,
    stdio: 'inherit',
  })

  uploader.on('close', (code) => {
    if (code !== 0) {
      console.error(`kintone-plugin-uploader exited with code ${code}`)
      process.exit(code ?? 1)
    }
  })

  uploader.on('error', (error) => {
    console.error('Failed to start kintone-plugin-uploader:', error.message)
    process.exit(1)
  })
}

run()
