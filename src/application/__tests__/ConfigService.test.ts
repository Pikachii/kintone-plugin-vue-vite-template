import { describe, it, expect, vi } from 'vitest'
import { ConfigService } from '../ConfigService'
import type { ConfigRepository } from '../../domain/repositories'

describe('ConfigService', () => {
  it('should get config from repository', () => {
    const mockConfig = { key1: 'value1', key2: 'value2' }
    const mockRepository: ConfigRepository = {
      getConfig: vi.fn().mockReturnValue(mockConfig),
      setConfig: vi.fn()
    }

    const service = new ConfigService(mockRepository)
    const result = service.getConfig()

    expect(result).toEqual(mockConfig)
    expect(mockRepository.getConfig).toHaveBeenCalled()
  })

  it('should set config to repository', () => {
    const mockConfig = { key1: 'value1' }
    const mockRepository: ConfigRepository = {
      getConfig: vi.fn(),
      setConfig: vi.fn()
    }

    const service = new ConfigService(mockRepository)
    service.setConfig(mockConfig)

    expect(mockRepository.setConfig).toHaveBeenCalledWith(mockConfig)
  })

  it('should get a config value by key', () => {
    const mockConfig = { key1: 'value1', key2: 'value2' }
    const mockRepository: ConfigRepository = {
      getConfig: vi.fn().mockReturnValue(mockConfig),
      setConfig: vi.fn()
    }

    const service = new ConfigService(mockRepository)
    const result = service.getConfigValue('key1')

    expect(result).toBe('value1')
  })

  it('should return undefined for non-existent key', () => {
    const mockConfig = { key1: 'value1' }
    const mockRepository: ConfigRepository = {
      getConfig: vi.fn().mockReturnValue(mockConfig),
      setConfig: vi.fn()
    }

    const service = new ConfigService(mockRepository)
    const result = service.getConfigValue('nonexistent')

    expect(result).toBeUndefined()
  })

  it('should set a config value by key', () => {
    const mockConfig = { key1: 'value1' }
    const mockRepository: ConfigRepository = {
      getConfig: vi.fn().mockReturnValue(mockConfig),
      setConfig: vi.fn()
    }

    const service = new ConfigService(mockRepository)
    service.setConfigValue('key2', 'value2')

    expect(mockRepository.setConfig).toHaveBeenCalledWith({
      key1: 'value1',
      key2: 'value2'
    })
  })
})
