<template>
  <div class="sample-plugin">
    <h2>{{ title }}</h2>
    <div v-if="loading" class="loading">
      読み込み中...
    </div>
    <div v-else-if="error" class="error">
      エラー: {{ error }}
    </div>
    <div v-else class="records">
      <p>レコード数: {{ records.length }}</p>
      <ul>
        <li v-for="record in records" :key="record.$id.value">
          Record ID: {{ record.$id.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Record } from '@/domain/repositories'

const props = defineProps<{
  appId: string
  recordService: any
}>()

const title = ref('サンプルプラグイン')
const records = ref<Record[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    records.value = await props.recordService.fetchRecords(props.appId)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '不明なエラー'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.sample-plugin {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin: 10px 0;
}

.loading,
.error {
  padding: 10px;
  margin: 10px 0;
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 4px;
}

.records ul {
  list-style: none;
  padding: 0;
}

.records li {
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}
</style>
