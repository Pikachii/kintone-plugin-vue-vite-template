/**
 * Infrastructure Layer - Kintone API implementation
 * 
 * This layer contains concrete implementations of repository interfaces
 * that interact with kintone APIs.
 */

import type { RecordRepository, Record } from '../domain/repositories'

declare const kintone: any

export class KintoneRecordRepository implements RecordRepository {
  async getRecord(appId: string, recordId: string): Promise<Record> {
    const resp = await kintone.api(kintone.api.url('/k/v1/record', true), 'GET', {
      app: appId,
      id: recordId
    })
    return resp.record
  }

  async getRecords(appId: string, query?: string): Promise<Record[]> {
    const params: any = {
      app: appId
    }
    
    if (query) {
      params.query = query
    }

    const resp = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', params)
    return resp.records
  }

  async createRecord(appId: string, record: Partial<Record>): Promise<string> {
    const resp = await kintone.api(kintone.api.url('/k/v1/record', true), 'POST', {
      app: appId,
      record
    })
    return resp.id
  }

  async updateRecord(appId: string, recordId: string, record: Partial<Record>): Promise<void> {
    await kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', {
      app: appId,
      id: recordId,
      record
    })
  }

  async deleteRecords(appId: string, recordIds: string[]): Promise<void> {
    await kintone.api(kintone.api.url('/k/v1/records', true), 'DELETE', {
      app: appId,
      ids: recordIds
    })
  }
}
