/**
 * Domain Layer - Core business logic (independent of external dependencies)
 * 
 * This layer contains:
 * - Entities: Core business objects
 * - Value Objects: Immutable objects representing domain concepts
 * - Domain Services: Business logic that doesn't belong to a single entity
 * - Repository Interfaces: Contracts for data access
 */

// Record entity representing a kintone record
export interface Record {
  $id: { value: string }
  [key: string]: any
}

// Repository interface for record operations
export interface RecordRepository {
  getRecord(appId: string, recordId: string): Promise<Record>
  getRecords(appId: string, query?: string): Promise<Record[]>
  createRecord(appId: string, record: Partial<Record>): Promise<string>
  updateRecord(appId: string, recordId: string, record: Partial<Record>): Promise<void>
  deleteRecords(appId: string, recordIds: string[]): Promise<void>
}

// Plugin configuration entity
export interface PluginConfig {
  [key: string]: string
}

// Repository interface for plugin configuration
export interface ConfigRepository {
  getConfig(): PluginConfig
  setConfig(config: PluginConfig): void
}
