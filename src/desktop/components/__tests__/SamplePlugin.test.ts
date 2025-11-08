import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SamplePlugin from '../SamplePlugin.vue'

describe('SamplePlugin', () => {
  it('should render loading state initially', () => {
    const mockRecordService = {
      fetchRecords: () => new Promise(() => {}) // Never resolves
    }

    const wrapper = mount(SamplePlugin, {
      props: {
        appId: '1',
        recordService: mockRecordService
      }
    })

    expect(wrapper.text()).toContain('読み込み中')
  })

  it('should render records after loading', async () => {
    const mockRecords = [
      { $id: { value: '1' } },
      { $id: { value: '2' } }
    ]

    const mockRecordService = {
      fetchRecords: () => Promise.resolve(mockRecords)
    }

    const wrapper = mount(SamplePlugin, {
      props: {
        appId: '1',
        recordService: mockRecordService
      }
    })

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('レコード数: 2')
    expect(wrapper.text()).toContain('Record ID: 1')
    expect(wrapper.text()).toContain('Record ID: 2')
  })

  it('should render error state on failure', async () => {
    const mockRecordService = {
      fetchRecords: () => Promise.reject(new Error('Test error'))
    }

    const wrapper = mount(SamplePlugin, {
      props: {
        appId: '1',
        recordService: mockRecordService
      }
    })

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('エラー: Test error')
  })
})
