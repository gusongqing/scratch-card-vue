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
  min-height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 16px;
  padding-top: max(20px, env(safe-area-inset-top));
  padding-bottom: max(20px, env(safe-area-inset-bottom));
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
}

.app-content {
  max-width: 600px;
  margin: 0 auto;
}
</style>
