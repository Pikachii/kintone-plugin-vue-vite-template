<template>
  <div class="config-container">
    <h1>プラグイン設定</h1>
    
    <div class="form-group">
      <label for="sample-config">
        サンプル設定項目:
      </label>
      <input
        id="sample-config"
        v-model="sampleConfig"
        type="text"
        placeholder="設定値を入力"
      >
    </div>

    <div class="form-group">
      <label for="display-limit">
        表示件数:
      </label>
      <input
        id="display-limit"
        v-model="displayLimit"
        type="number"
        min="1"
        max="500"
      >
    </div>

    <div class="button-group">
      <button
        class="btn-primary"
        @click="handleSave"
      >
        保存
      </button>
      <button
        class="btn-secondary"
        @click="handleCancel"
      >
        キャンセル
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ConfigService } from '@/application/ConfigService'

const props = defineProps<{
  configService: ConfigService
}>()

const sampleConfig = ref('')
const displayLimit = ref(100)

onMounted(() => {
  const config = props.configService.getConfig()
  sampleConfig.value = config.sampleConfig || ''
  displayLimit.value = parseInt(config.displayLimit || '100', 10)
})

const handleSave = () => {
  props.configService.setConfig({
    sampleConfig: sampleConfig.value,
    displayLimit: displayLimit.value.toString()
  })
  alert('設定を保存しました')
  window.location.href = '/k/admin/app/flow?app=' + new URLSearchParams(window.location.search).get('app')
}

const handleCancel = () => {
  history.back()
}
</script>

<style scoped>
.config-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

.button-group {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}
</style>
