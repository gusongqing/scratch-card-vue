import prizeData from './lottery-prizes.json'

// 将字母代码排序（用于忽略顺序匹配）
function sortLetters(code) {
  return code.toUpperCase().split('').sort().join('')
}

// 获取奖金对应的颜色
function getAmountColor(amount) {
  if (amount >= 3000) return '#FFD700'      // 金色
  if (amount >= 1000) return '#FF6B6B'      // 红色
  if (amount >= 500) return '#FF8C00'       // 橙色
  if (amount >= 200) return '#CD7F32'       // 铜色
  if (amount >= 100) return '#4CAF50'       // 绿色
  if (amount >= 50) return '#2196F3'        // 蓝色
  if (amount >= 25) return '#9C27B0'        // 紫色
  if (amount >= 15) return '#00BCD4'        // 青色
  return '#607D8B'                          // 灰色
}

/**
 * 识别彩票代码并返回中奖结果
 * @param {string} code - 彩票代码（3个字母）
 * @param {string} type - 彩票类型：'sports'(体彩) 或 'welfare'(福彩)
 * @returns {object} 中奖结果
 */
export function checkLottery(code, type = 'sports') {
  if (!code || typeof code !== 'string') {
    return {
      isWinning: false,
      prize: null,
      message: '请输入有效的彩票代码',
      type: null
    }
  }

  const upperCode = code.toUpperCase().trim()
  
  // 验证是否为3个字母
  if (!/^[A-Z]{3}$/i.test(upperCode)) {
    return {
      isWinning: false,
      prize: null,
      message: '彩票代码应为3个字母组合',
      type: null
    }
  }

  const lotteryConfig = prizeData[type]
  if (!lotteryConfig) {
    return {
      isWinning: false,
      prize: null,
      message: '未知的彩票类型',
      type: null
    }
  }

  const sortedCode = sortLetters(upperCode)
  const prizes = lotteryConfig.prizes
  
  // 遍历所有中奖组合（字母排序后比较）
  for (const [pattern, amount] of Object.entries(prizes)) {
    const sortedPattern = sortLetters(pattern)
    if (sortedCode === sortedPattern) {
      return {
        isWinning: true,
        prize: {
          amount: amount,
          color: getAmountColor(amount),
          code: upperCode,
          matchedPattern: pattern
        },
        type: type,
        typeName: lotteryConfig.name,
        message: `恭喜中奖！奖金：¥${amount.toLocaleString()}`
      }
    }
  }

  return {
    isWinning: false,
    prize: null,
    type: type,
    typeName: lotteryConfig.name,
    message: '很遗憾，未中奖。再接再厉！'
  }
}

/**
 * 获取所有中奖组合（用于显示规则）
 * @param {string} type - 彩票类型
 * @returns {array} 中奖组合列表
 */
export function getPrizeList(type) {
  const lotteryConfig = prizeData[type]
  if (!lotteryConfig) return []
  
  const prizeList = Object.entries(lotteryConfig.prizes).map(([code, amount]) => ({
    code,
    amount,
    color: getAmountColor(amount)
  }))
  
  // 按奖金金额降序排列
  return prizeList.sort((a, b) => b.amount - a.amount)
}

/**
 * 保存查询记录到本地存储
 * @param {object} result - 查询结果
 */
export function saveHistory(result) {
  const history = getHistory()
  const record = {
    ...result,
    timestamp: new Date().toLocaleString('zh-CN')
  }
  history.unshift(record)
  if (history.length > 20) {
    history.pop()
  }
  localStorage.setItem('lottery_history', JSON.stringify(history))
}

/**
 * 获取查询历史记录
 * @returns {array} 历史记录列表
 */
export function getHistory() {
  try {
    const history = localStorage.getItem('lottery_history')
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

/**
 * 清空历史记录
 */
export function clearHistory() {
  localStorage.removeItem('lottery_history')
}
