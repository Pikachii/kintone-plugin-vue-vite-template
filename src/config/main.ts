/**
 * Configuration screen entry point
 */

import { createApp } from 'vue'
import ConfigApp from './components/ConfigApp.vue'
import { KintoneConfigRepository } from '../infrastructure/KintoneConfigRepository'
import { ConfigService } from '../application/ConfigService'

// Get plugin ID from URL parameter
const params = new URLSearchParams(window.location.search)
const pluginId = params.get('id')

if (!pluginId) {
  throw new Error('Plugin ID not found in URL parameters')
}

// Set up Clean Architecture layers
const configRepository = new KintoneConfigRepository(pluginId)
const configService = new ConfigService(configRepository)

// Create and mount the Vue app
const app = createApp(ConfigApp, {
  configService
})

app.mount('#app')
