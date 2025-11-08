/**
 * Mobile entry point
 * This script runs on the kintone app's mobile view
 */

import { createApp } from 'vue'
import SamplePlugin from '../desktop/components/SamplePlugin.vue'
import { KintoneRecordRepository } from '../infrastructure/KintoneRecordRepository'
import { RecordService } from '../application/RecordService'

declare const kintone: any

// Initialize when the app is ready
kintone.events.on('mobile.app.record.index.show', (event: any) => {
  // Create a container for the Vue app
  const container = document.createElement('div')
  container.id = 'plugin-container-mobile'
  
  // Insert the container into the kintone UI
  const spaceElement = kintone.mobile.app.getHeaderSpaceElement()
  if (spaceElement) {
    spaceElement.appendChild(container)
  }

  // Set up Clean Architecture layers
  const recordRepository = new KintoneRecordRepository()
  const recordService = new RecordService(recordRepository)

  // Create and mount the Vue app
  const app = createApp(SamplePlugin, {
    appId: event.appId,
    recordService
  })

  app.mount('#plugin-container-mobile')

  return event
})
