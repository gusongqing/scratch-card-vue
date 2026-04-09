<template>
  <div class="app-container">
    <div class="app-content">
      <ScratchCardInput @result="handleResult" />
      <ResultDisplay :code="currentCode" :type="currentType" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ScratchCardInput from './components/ScratchCardInput.vue'
import ResultDisplay from './components/ResultDisplay.vue'

const currentCode = ref('')
const currentType = ref('sports')

const handleResult = (data) => {
  currentCode.value = data.code || ''
  currentType.value = data.type || 'sports'
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.app-content {
  max-width: 600px;
  margin: 0 auto;
}
</style>
