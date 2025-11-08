/**
 * Application Layer - Configuration Service
 */

import type { ConfigRepository, PluginConfig } from '../domain/repositories'

export class ConfigService {
  constructor(private configRepository: ConfigRepository) {}

  getConfig(): PluginConfig {
    return this.configRepository.getConfig()
  }

  setConfig(config: PluginConfig): void {
    this.configRepository.setConfig(config)
  }

  getConfigValue(key: string): string | undefined {
    const config = this.getConfig()
    return config[key]
  }

  setConfigValue(key: string, value: string): void {
    const config = this.getConfig()
    config[key] = value
    this.setConfig(config)
  }
}
