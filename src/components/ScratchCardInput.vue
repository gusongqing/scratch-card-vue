<template>
  <div class="input-section">
    <h2>刮刮乐识别系统</h2>
    
    <!-- 彩票类型选择 -->
    <div class="type-selector">
      <button 
        class="type-btn" 
        :class="{ active: lotteryType === 'sports' }"
        @click="lotteryType = 'sports'"
      >
        🏃 体彩
      </button>
      <button 
        class="type-btn" 
        :class="{ active: lotteryType === 'welfare' }"
        @click="lotteryType = 'welfare'"
      >
        ❤️ 福彩
      </button>
    </div>

    <div class="input-wrapper">
      <input
        v-model="inputCode"
        type="text"
        placeholder="请输入3位字母代码"
        class="code-input"
        @keyup.enter="handleCheck"
        maxlength="3"
      />
      <button @click="handleCheck" class="check-btn" :disabled="loading">
        {{ loading ? '识别中...' : '识别' }}
      </button>
    </div>

    <!-- 中奖规则显示 -->
    <div class="rules-hint">
      <div class="rules-header">
        <p class="hint-title">{{ lotteryType === 'sports' ? '体彩' : '福彩' }}中奖规则</p>
        <button class="toggle-btn" @click="showAllRules = !showAllRules">
          {{ showAllRules ? '收起' : '展开全部' }}
        </button>
      </div>
      
      <!-- 简要显示 -->
      <div v-if="!showAllRules" class="rules-summary">
        <div class="prize-range" v-for="(range, index) in prizeRanges" :key="index">
          <span class="range-amount" :style="{ color: range.color }">{{ range.label }}</span>
          <span class="range-count">{{ range.count }}个组合</span>
        </div>
      </div>
      
      <!-- 详细列表 -->
      <div v-else class="rules-list">
        <div class="list-grid">
          <div v-for="prize in prizeList" :key="prize.code" class="prize-item">
            <span class="prize-code" :style="{ background: prize.color }">{{ prize.code }}</span>
            <span class="prize-amount">¥{{ prize.amount }}</span>
          </div>
        </div>
      </div>
      
      <p class="hint-note">💡 提示：字母顺序不影响识别（如 ABC = BAC = CAB）</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getPrizeList } from '../utils/lottery.js'

const inputCode = ref('')
const loading = ref(false)
const lotteryType = ref('sports')
const showAllRules = ref(false)

const emit = defineEmits(['result'])

const prizeList = computed(() => getPrizeList(lotteryType.value))

const prizeRanges = computed(() => {
  const list = prizeList.value
  return [
    { 
      label: '¥3000以上', 
      count: list.filter(p => p.amount >= 3000).length,
      color: '#FFD700'
    },
    { 
      label: '¥1000-¥2000', 
      count: list.filter(p => p.amount >= 1000 && p.amount < 3000).length,
      color: '#FF6B6B'
    },
    { 
      label: '¥500-¥900', 
      count: list.filter(p => p.amount >= 500 && p.amount < 1000).length,
      color: '#FF8C00'
    },
    { 
      label: '¥200-¥400', 
      count: list.filter(p => p.amount >= 200 && p.amount < 500).length,
      color: '#CD7F32'
    },
    { 
      label: '¥200以下', 
      count: list.filter(p => p.amount < 200).length,
      color: '#4CAF50'
    }
  ].filter(r => r.count > 0)
})

const handleCheck = async () => {
  if (!inputCode.value.trim()) {
    emit('result', {
      isWinning: false,
      prize: null,
      message: '请输入彩票代码',
      type: lotteryType.value
    })
    return
  }

  loading.value = true
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const code = inputCode.value.trim()
  emit('result', { code, type: lotteryType.value })
  
  loading.value = false
}
</script>

<style scoped>
.input-section {
  background: white;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

.type-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.type-btn {
  flex: 1;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  background: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.type-btn:hover {
  background: #eee;
}

.type-btn.active {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.code-input {
  flex: 1;
  padding: 14px 18px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-align: center;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s;
}

.code-input:focus {
  border-color: #667eea;
}

.code-input::placeholder {
  letter-spacing: normal;
  font-weight: normal;
  text-transform: none;
}

.check-btn {
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.check-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.check-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rules-hint {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 16px;
}

.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.hint-title {
  font-weight: 600;
  color: #555;
  margin: 0;
}

.toggle-btn {
  padding: 4px 10px;
  font-size: 12px;
  color: #667eea;
  background: white;
  border: 1px solid #667eea;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #667eea;
  color: white;
}

.rules-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.prize-range {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
}

.range-amount {
  font-weight: 600;
  font-size: 13px;
}

.range-count {
  color: #999;
  font-size: 12px;
}

.rules-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 12px;
}

.list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.prize-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 6px;
  transition: transform 0.2s;
}

.prize-item:hover {
  transform: scale(1.05);
}

.prize-code {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.prize-amount {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.hint-note {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #ddd;
  color: #888;
  font-size: 12px;
  text-align: center;
}

@media (max-width: 500px) {
  .input-section {
    padding: 20px 16px;
  }
  
  h2 {
    font-size: 20px;
    margin-bottom: 16px;
  }
  
  .rules-summary {
    grid-template-columns: 1fr;
  }
  
  .type-btn {
    font-size: 14px;
    padding: 10px;
  }
  
  .input-wrapper {
    flex-direction: column;
    gap: 10px;
  }
  
  .code-input {
    font-size: 20px;
    padding: 16px;
  }
  
  .check-btn {
    width: 100%;
    padding: 16px;
    font-size: 16px;
  }
  
  .list-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .rules-hint {
    padding: 12px;
  }
  
  .prize-item {
    padding: 6px;
  }
  
  .prize-code {
    font-size: 11px;
    padding: 3px 8px;
  }
  
  .prize-amount {
    font-size: 12px;
  }
}
</style>
