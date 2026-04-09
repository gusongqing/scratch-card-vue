<template>
  <div class="result-section">
    <transition name="fade">
      <div v-if="result" class="result-card" :class="result.isWinning ? 'winning' : 'losing'">
        <div class="result-icon">
          <span v-if="result.isWinning">🎉</span>
          <span v-else>😢</span>
        </div>
        <div class="result-content">
          <!-- 显示彩票类型 -->
          <p class="lottery-type" v-if="result.typeName">
            <span class="type-badge" :class="result.type">
              {{ result.typeName }}
            </span>
          </p>
          <h3 :style="{ color: result.prize?.color || '#666' }">
            {{ result.isWinning ? '恭喜中奖！' : '未中奖' }}
          </h3>
          <p class="prize-info" v-if="result.isWinning && result.prize">
            <span class="prize-amount">¥{{ result.prize.amount.toLocaleString() }}</span>
          </p>
          <p class="message">{{ result.message }}</p>
          <p class="code-display" v-if="result.prize?.code">
            彩票代码：<code>{{ result.prize.code }}</code>
          </p>
        </div>
      </div>
    </transition>

    <!-- 历史记录 -->
    <div class="history-section" v-if="history.length > 0">
      <div class="history-header">
        <h4>查询记录</h4>
        <button @click="handleClearHistory" class="clear-btn">清空</button>
      </div>
      <div class="history-list">
        <div v-for="(item, index) in history" :key="index" class="history-item">
          <div class="history-info">
            <span class="history-type" :class="item.type">{{ item.typeName?.charAt(0) || '-' }}</span>
            <span class="history-code">{{ item.prize?.code || '-' }}</span>
            <span class="history-status" :style="{ color: item.prize?.color || '#999' }">
              {{ item.isWinning ? `¥${item.prize?.amount}` : '未中奖' }}
            </span>
          </div>
          <span class="history-time">{{ item.timestamp }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { checkLottery, saveHistory, getHistory, clearHistory } from '../utils/lottery.js'

const props = defineProps({
  code: String,
  type: String
})

const result = ref(null)
const history = ref([])

// 加载历史记录
history.value = getHistory()

// 监听代码变化，执行识别
watch(() => [props.code, props.type], ([newCode, newType]) => {
  if (newCode) {
    const checkResult = checkLottery(newCode, newType || 'sports')
    result.value = checkResult
    saveHistory(checkResult)
    history.value = getHistory()
  }
}, { immediate: false })

const handleClearHistory = () => {
  if (confirm('确定要清空所有查询记录吗？')) {
    clearHistory()
    history.value = []
  }
}
</script>

<style scoped>
.result-section {
  margin-top: 20px;
}

.result-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.result-card.winning {
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
  border: 2px solid #FFD700;
}

.result-card.losing {
  background: #f8f9fa;
}

.result-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.lottery-type {
  margin-bottom: 8px;
}

.type-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.type-badge.sports {
  background: linear-gradient(135deg, #FF6B6B 0%, #ee5a5a 100%);
}

.type-badge.welfare {
  background: linear-gradient(135deg, #4ECDC4 0%, #44b3aa 100%);
}

.result-content h3 {
  font-size: 24px;
  margin-bottom: 12px;
}

.prize-info {
  margin-bottom: 12px;
}

.prize-amount {
  font-size: 36px;
  font-weight: 700;
}

.message {
  color: #666;
  margin-bottom: 8px;
}

.code-display {
  color: #999;
  font-size: 14px;
}

.code-display code {
  background: #e9ecef;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: 600;
}

/* 历史记录样式 */
.history-section {
  margin-top: 24px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.history-header h4 {
  color: #333;
  margin: 0;
}

.clear-btn {
  padding: 4px 12px;
  font-size: 12px;
  color: #999;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  color: #f44336;
  border-color: #f44336;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.history-type {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: white;
}

.history-type.sports {
  background: #FF6B6B;
}

.history-type.welfare {
  background: #4ECDC4;
}

.history-code {
  font-family: monospace;
  color: #555;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}

.history-status {
  font-weight: 600;
  font-size: 14px;
}

.history-time {
  color: #999;
  font-size: 12px;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
