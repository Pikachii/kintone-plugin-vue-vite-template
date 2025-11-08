/**
 * Application Layer - Use cases and application-specific business logic
 * 
 * This layer orchestrates domain objects and coordinates application workflows.
 * It depends on the domain layer but is independent of infrastructure details.
 */

import type { RecordRepository, Record } from '../domain/repositories'

export class RecordService {
  constructor(private recordRepository: RecordRepository) {}

  async fetchRecords(appId: string, query?: string): Promise<Record[]> {
    return await this.recordRepository.getRecords(appId, query)
  }

  async fetchRecord(appId: string, recordId: string): Promise<Record> {
    return await this.recordRepository.getRecord(appId, recordId)
  }

  async createRecord(appId: string, record: Partial<Record>): Promise<string> {
    return await this.recordRepository.createRecord(appId, record)
  }

  async updateRecord(appId: string, recordId: string, record: Partial<Record>): Promise<void> {
    await this.recordRepository.updateRecord(appId, recordId, record)
  }

  async deleteRecords(appId: string, recordIds: string[]): Promise<void> {
    await this.recordRepository.deleteRecords(appId, recordIds)
  }
}
