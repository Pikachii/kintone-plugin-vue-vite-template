# 実装例 / Examples

このドキュメントでは、テンプレートを使用した具体的な実装例を紹介します。

## 例1: レコード一覧の表示と編集 / Example 1: Display and Edit Records

### 1. ドメイン層の拡張

既存の `RecordRepository` を使用します。

### 2. Vue コンポーネントの作成

`src/desktop/components/RecordList.vue`:

```vue
<template>
  <div class="record-list">
    <h2>レコード一覧</h2>
    <button @click="refresh">更新</button>
    
    <table v-if="records.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>タイトル</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.$id.value">
          <td>{{ record.$id.value }}</td>
          <td>{{ record.title?.value }}</td>
          <td>
            <button @click="editRecord(record)">編集</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { RecordService } from '@/application/RecordService'
import type { Record } from '@/domain/repositories'

const props = defineProps<{
  appId: string
  recordService: RecordService
}>()

const records = ref<Record[]>([])

const loadRecords = async () => {
  records.value = await props.recordService.fetchRecords(props.appId)
}

const refresh = async () => {
  await loadRecords()
}

const editRecord = (record: Record) => {
  // 編集ロジック
  console.log('Edit record:', record)
}

onMounted(async () => {
  await loadRecords()
})
</script>

<style scoped>
.record-list {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f5f5f5;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
```

## 例2: フィルター機能の追加 / Example 2: Add Filter Feature

### 1. アプリケーション層のサービス拡張

`src/application/FilterService.ts`:

```typescript
import type { RecordRepository, Record } from '../domain/repositories'

export interface FilterCriteria {
  fieldName: string
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan'
  value: string
}

export class FilterService {
  constructor(private recordRepository: RecordRepository) {}

  async filterRecords(appId: string, criteria: FilterCriteria): Promise<Record[]> {
    const query = this.buildQuery(criteria)
    return await this.recordRepository.getRecords(appId, query)
  }

  private buildQuery(criteria: FilterCriteria): string {
    const { fieldName, operator, value } = criteria
    
    switch (operator) {
      case 'equals':
        return `${fieldName} = "${value}"`
      case 'contains':
        return `${fieldName} like "${value}"`
      case 'greaterThan':
        return `${fieldName} > ${value}`
      case 'lessThan':
        return `${fieldName} < ${value}`
      default:
        return ''
    }
  }
}
```

### 2. テストの作成

`src/application/__tests__/FilterService.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { FilterService } from '../FilterService'
import type { RecordRepository } from '../../domain/repositories'

describe('FilterService', () => {
  it('should build equals query', async () => {
    const mockRepository: RecordRepository = {
      getRecords: vi.fn().mockResolvedValue([]),
      getRecord: vi.fn(),
      createRecord: vi.fn(),
      updateRecord: vi.fn(),
      deleteRecords: vi.fn()
    }

    const service = new FilterService(mockRepository)
    await service.filterRecords('1', {
      fieldName: 'status',
      operator: 'equals',
      value: 'active'
    })

    expect(mockRepository.getRecords).toHaveBeenCalledWith('1', 'status = "active"')
  })

  it('should build contains query', async () => {
    const mockRepository: RecordRepository = {
      getRecords: vi.fn().mockResolvedValue([]),
      getRecord: vi.fn(),
      createRecord: vi.fn(),
      updateRecord: vi.fn(),
      deleteRecords: vi.fn()
    }

    const service = new FilterService(mockRepository)
    await service.filterRecords('1', {
      fieldName: 'title',
      operator: 'contains',
      value: 'test'
    })

    expect(mockRepository.getRecords).toHaveBeenCalledWith('1', 'title like "test"')
  })
})
```

## 例3: カスタムフィールドタイプの実装 / Example 3: Custom Field Type

### 1. ドメイン層にカスタムフィールドを定義

`src/domain/fields.ts`:

```typescript
export interface CustomField {
  type: string
  value: any
}

export interface TextAreaField extends CustomField {
  type: 'TEXTAREA'
  value: string
}

export interface DateField extends CustomField {
  type: 'DATE'
  value: string // ISO 8601 format
}

export interface SelectField extends CustomField {
  type: 'SINGLE_SELECT'
  value: string
}

export type FieldValue = TextAreaField | DateField | SelectField
```

### 2. フィールドバリデーションサービス

`src/application/ValidationService.ts`:

```typescript
import type { FieldValue } from '../domain/fields'

export class ValidationService {
  validateField(field: FieldValue): boolean {
    switch (field.type) {
      case 'DATE':
        return this.validateDate(field.value)
      case 'TEXTAREA':
        return this.validateTextArea(field.value)
      case 'SINGLE_SELECT':
        return this.validateSelect(field.value)
      default:
        return true
    }
  }

  private validateDate(value: string): boolean {
    const date = new Date(value)
    return !isNaN(date.getTime())
  }

  private validateTextArea(value: string): boolean {
    return value.length <= 10000
  }

  private validateSelect(value: string): boolean {
    return value.length > 0
  }
}
```

## 例4: エラーハンドリング / Example 4: Error Handling

### 1. カスタムエラークラス

`src/domain/errors.ts`:

```typescript
export class KintoneApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'KintoneApiError'
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
```

### 2. エラーハンドリングサービス

`src/application/ErrorHandlerService.ts`:

```typescript
import { KintoneApiError, ValidationError } from '../domain/errors'

export class ErrorHandlerService {
  handleError(error: unknown): string {
    if (error instanceof KintoneApiError) {
      return this.handleKintoneError(error)
    } else if (error instanceof ValidationError) {
      return this.handleValidationError(error)
    } else if (error instanceof Error) {
      return error.message
    }
    return '不明なエラーが発生しました'
  }

  private handleKintoneError(error: KintoneApiError): string {
    switch (error.code) {
      case 'GAIA_RE01':
        return 'レコードが見つかりません'
      case 'GAIA_DA02':
        return 'レコードの更新権限がありません'
      case 'GAIA_AP01':
        return 'アプリが見つかりません'
      default:
        return `kintone エラー: ${error.message}`
    }
  }

  private handleValidationError(error: ValidationError): string {
    return `入力エラー (${error.field}): ${error.message}`
  }
}
```

### 3. Vue コンポーネントでの使用

```vue
<template>
  <div>
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
    <!-- コンテンツ -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ErrorHandlerService } from '@/application/ErrorHandlerService'

const errorMessage = ref<string | null>(null)
const errorHandler = new ErrorHandlerService()

const handleOperation = async () => {
  try {
    // 何らかの操作
  } catch (error) {
    errorMessage.value = errorHandler.handleError(error)
  }
}
</script>
```

## 例5: ページネーション / Example 5: Pagination

### 1. ページネーションサービス

`src/application/PaginationService.ts`:

```typescript
import type { RecordRepository, Record } from '../domain/repositories'

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult {
  records: Record[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export class PaginationService {
  constructor(private recordRepository: RecordRepository) {}

  async getPaginatedRecords(
    appId: string,
    params: PaginationParams,
    query?: string
  ): Promise<PaginatedResult> {
    const offset = (params.page - 1) * params.limit
    const queryWithPagination = this.buildPaginationQuery(query, params.limit, offset)
    
    const records = await this.recordRepository.getRecords(appId, queryWithPagination)
    const totalCount = await this.getTotalCount(appId, query)
    
    return {
      records,
      totalCount,
      currentPage: params.page,
      totalPages: Math.ceil(totalCount / params.limit)
    }
  }

  private buildPaginationQuery(query: string | undefined, limit: number, offset: number): string {
    let paginationQuery = query || ''
    paginationQuery += ` limit ${limit} offset ${offset}`
    return paginationQuery.trim()
  }

  private async getTotalCount(appId: string, query?: string): Promise<number> {
    const records = await this.recordRepository.getRecords(appId, query)
    return records.length
  }
}
```

## まとめ / Summary

これらの例は、Clean Architecture の原則に従いながら、テンプレートを拡張する方法を示しています：

1. **ドメイン層**: ビジネスロジックと型定義
2. **アプリケーション層**: ユースケースの実装
3. **インフラ層**: 外部システムとの連携
4. **プレゼンテーション層**: Vue コンポーネント

この構造により、テストが容易で保守性の高いコードを書くことができます。
