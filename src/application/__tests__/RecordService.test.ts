import { describe, it, expect, vi } from 'vitest'
import { RecordService } from '../RecordService'
import type { RecordRepository, Record } from '../../domain/repositories'

describe('RecordService', () => {
  it('should fetch records from repository', async () => {
    // Mock repository
    const mockRecords: Record[] = [
      { $id: { value: '1' } },
      { $id: { value: '2' } }
    ]

    const mockRepository: RecordRepository = {
      getRecords: vi.fn().mockResolvedValue(mockRecords),
      getRecord: vi.fn(),
      createRecord: vi.fn(),
      updateRecord: vi.fn(),
      deleteRecords: vi.fn()
    }

    // Create service with mock repository
    const service = new RecordService(mockRepository)

    // Test
    const result = await service.fetchRecords('1')

    expect(result).toEqual(mockRecords)
    expect(mockRepository.getRecords).toHaveBeenCalledWith('1', undefined)
  })

  it('should fetch a single record', async () => {
    const mockRecord: Record = { $id: { value: '1' } }

    const mockRepository: RecordRepository = {
      getRecords: vi.fn(),
      getRecord: vi.fn().mockResolvedValue(mockRecord),
      createRecord: vi.fn(),
      updateRecord: vi.fn(),
      deleteRecords: vi.fn()
    }

    const service = new RecordService(mockRepository)
    const result = await service.fetchRecord('1', '1')

    expect(result).toEqual(mockRecord)
    expect(mockRepository.getRecord).toHaveBeenCalledWith('1', '1')
  })

  it('should create a record', async () => {
    const mockRepository: RecordRepository = {
      getRecords: vi.fn(),
      getRecord: vi.fn(),
      createRecord: vi.fn().mockResolvedValue('123'),
      updateRecord: vi.fn(),
      deleteRecords: vi.fn()
    }

    const service = new RecordService(mockRepository)
    const newRecord = { name: { value: 'Test' } }
    const result = await service.createRecord('1', newRecord)

    expect(result).toBe('123')
    expect(mockRepository.createRecord).toHaveBeenCalledWith('1', newRecord)
  })

  it('should update a record', async () => {
    const mockRepository: RecordRepository = {
      getRecords: vi.fn(),
      getRecord: vi.fn(),
      createRecord: vi.fn(),
      updateRecord: vi.fn().mockResolvedValue(undefined),
      deleteRecords: vi.fn()
    }

    const service = new RecordService(mockRepository)
    const updatedRecord = { name: { value: 'Updated' } }
    await service.updateRecord('1', '1', updatedRecord)

    expect(mockRepository.updateRecord).toHaveBeenCalledWith('1', '1', updatedRecord)
  })

  it('should delete records', async () => {
    const mockRepository: RecordRepository = {
      getRecords: vi.fn(),
      getRecord: vi.fn(),
      createRecord: vi.fn(),
      updateRecord: vi.fn(),
      deleteRecords: vi.fn().mockResolvedValue(undefined)
    }

    const service = new RecordService(mockRepository)
    await service.deleteRecords('1', ['1', '2'])

    expect(mockRepository.deleteRecords).toHaveBeenCalledWith('1', ['1', '2'])
  })
})
