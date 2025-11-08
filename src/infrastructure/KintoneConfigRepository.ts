/**
 * Infrastructure Layer - Kintone Plugin Configuration implementation
 */

import type { ConfigRepository, PluginConfig } from '../domain/repositories'

declare const kintone: any

export class KintoneConfigRepository implements ConfigRepository {
  private pluginId: string

  constructor(pluginId?: string) {
    this.pluginId = pluginId || kintone.plugin.app.getConfig()
  }

  getConfig(): PluginConfig {
    if (typeof kintone === 'undefined' || !kintone.plugin) {
      return {}
    }
    return kintone.plugin.app.getConfig(this.pluginId)
  }

  setConfig(config: PluginConfig): void {
    if (typeof kintone === 'undefined' || !kintone.plugin) {
      throw new Error('kintone plugin API is not available')
    }
    kintone.plugin.app.setConfig(config)
  }
}
