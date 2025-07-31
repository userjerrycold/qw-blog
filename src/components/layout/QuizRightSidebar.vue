<template>
  <aside class="sidebar-container">
    <!-- 答题规则 -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-clipboard-list"></i>
        答题规则
      </h3>
      <div class="rules-card">
        <div class="rule-item">
          <div class="rule-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="rule-content">
            <h4 class="rule-title">时间限制</h4>
            <p class="rule-desc">{{ getModeDescription(quizConfig.mode) }}</p>
          </div>
        </div>
        <div class="rule-item">
          <div class="rule-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="rule-content">
            <h4 class="rule-title">难度范围</h4>
            <p class="rule-desc">
              {{ quizConfig.difficulty?.min || 1 }} - {{ quizConfig.difficulty?.max || 5 }} 星
            </p>
          </div>
        </div>
        <div class="rule-item">
          <div class="rule-icon">
            <i class="fas fa-list-ol"></i>
          </div>
          <div class="rule-content">
            <h4 class="rule-title">题目数量</h4>
            <p class="rule-desc">共 {{ quizConfig.count || 20 }} 道题</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 当前题目信息 -->
    <div v-if="quizStarted && currentQuestion" class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-question-circle"></i>
        当前题目
      </h3>
      <div class="current-question-card">
        <div class="question-info">
          <div class="question-type-badge">
            <i class="fas fa-tag"></i>
            {{ currentQuestion.type }}
          </div>
          <div class="question-difficulty">
            <span class="difficulty-label">难度：</span>
            <div class="difficulty-stars">
              <span 
                v-for="i in 5" 
                :key="i"
                class="star"
                :class="{ 'active': i <= (currentQuestion.difficulty || 1) }"
              >
                <i class="fas fa-star"></i>
              </span>
            </div>
          </div>
        </div>
        
        <div class="question-progress">
          <div class="progress-circle">
            <svg class="progress-ring" width="60" height="60">
              <circle
                class="progress-ring-circle"
                stroke="rgba(59, 130, 246, 0.2)"
                stroke-width="4"
                fill="transparent"
                r="26"
                cx="30"
                cy="30"
              />
              <circle
                class="progress-ring-circle progress-ring-fill"
                stroke="#3b82f6"
                stroke-width="4"
                fill="transparent"
                r="26"
                cx="30"
                cy="30"
                :stroke-dasharray="`${progressCircumference} ${progressCircumference}`"
                :stroke-dashoffset="progressOffset"
              />
            </svg>
            <div class="progress-text">
              <span class="progress-percentage">{{ Math.round(progressPercentage) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 答题统计 -->
    <div v-if="quizStarted" class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-chart-bar"></i>
        答题统计
      </h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon correct">
            <i class="fas fa-check"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ statistics.correct || 0 }}</div>
            <div class="stat-label">答对</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon wrong">
            <i class="fas fa-times"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ statistics.wrong || 0 }}</div>
            <div class="stat-label">答错</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ statistics.remaining || statistics.total || 0 }}</div>
            <div class="stat-label">剩余</div>
          </div>
        </div>
      </div>
      
      <div class="accuracy-meter">
        <div class="meter-header">
          <span class="meter-label">正确率</span>
          <span class="meter-value">{{ accuracyPercentage }}%</span>
        </div>
        <div class="meter-bar">
          <div 
            class="meter-fill" 
            :style="{ 
              width: `${accuracyPercentage}%`,
              backgroundColor: getAccuracyColor(accuracyPercentage)
            }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 难度简介 -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-info-circle"></i>
        难度说明
      </h3>
      <div class="difficulty-guide">
        <div 
          v-for="level in difficultyLevels" 
          :key="level.stars"
          class="difficulty-level"
          :class="{ 'highlighted': isCurrentDifficulty(level.stars) }"
        >
          <div class="level-stars">
            <span v-for="i in level.stars" :key="i" class="star active">
              <i class="fas fa-star"></i>
            </span>
            <span v-for="i in (5 - level.stars)" :key="`empty-${i}`" class="star">
              <i class="far fa-star"></i>
            </span>
          </div>
          <div class="level-info">
            <div class="level-name">{{ level.name }}</div>
            <div class="level-desc">{{ level.description }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 快速操作 -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-rocket"></i>
        快速操作
      </h3>
      <div class="quick-actions">
        <button 
          v-if="!quizStarted" 
          class="action-btn primary full-width"
          @click="startQuickQuiz"
        >
          <i class="fas fa-play"></i>
          快速开始
        </button>
        
        <template v-else>
          <button class="action-btn secondary" @click="pauseQuiz">
            <i class="fas fa-pause"></i>
            暂停
          </button>
          <button class="action-btn danger" @click="resetQuiz">
            <i class="fas fa-redo"></i>
            重新开始
          </button>
        </template>
        
        <button class="action-btn info" @click="showHelp">
          <i class="fas fa-question-circle"></i>
          答题帮助
        </button>
      </div>
    </div>
    
    <!-- 学习提示 -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-lightbulb"></i>
        学习提示
      </h3>
      <div class="tips-card">
        <div class="tip-item">
          <i class="fas fa-target"></i>
          <span>专注答题，避免分心</span>
        </div>
        <div class="tip-item">
          <i class="fas fa-think"></i>
          <span>仔细审题，理解题意</span>
        </div>
        <div class="tip-item">
          <i class="fas fa-clock"></i>
          <span>合理分配答题时间</span>
        </div>
        <div class="tip-item">
          <i class="fas fa-check-double"></i>
          <span>答完后检查答案</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

// 定义props类型
interface QuizConfig {
  subjects: number[]
  difficulty: { min: number; max: number }
  count: number
  mode: string
}

interface CurrentQuestion {
  id: number
  text: string
  type: string
  difficulty: number
  options?: string[]
  correctAnswer?: number | boolean
}

interface Statistics {
  total: number
  answered: number
  correct: number
  wrong?: number
  remaining?: number
  timeSpent: number
}

const props = defineProps<{
  quizConfig: QuizConfig
  currentQuestion?: CurrentQuestion
  quizStarted: boolean
  statistics: Statistics
}>()

const emit = defineEmits<{
  'start-quiz': [config: QuizConfig]
  'reset-quiz': []
  'pause-quiz': []
  'show-help': []
}>()

// 难度级别配置
const difficultyLevels = [
  {
    stars: 1,
    name: '入门',
    description: '基础概念，适合初学者'
  },
  {
    stars: 2,
    name: '简单',
    description: '基本应用，掌握核心知识'
  },
  {
    stars: 3,
    name: '中等',
    description: '综合运用，考察理解深度'
  },
  {
    stars: 4,
    name: '困难',
    description: '复杂场景，需要深入思考'
  },
  {
    stars: 5,
    name: '专家',
    description: '高级应用，挑战专业水平'
  }
]

// 计算属性
const progressPercentage = computed(() => {
  if (!props.statistics.total) return 0
  return (props.statistics.answered / props.statistics.total) * 100
})

const progressCircumference = computed(() => {
  return 2 * Math.PI * 26 // 半径26的圆周长
})

const progressOffset = computed(() => {
  const percentage = progressPercentage.value
  return progressCircumference.value - (percentage / 100) * progressCircumference.value
})

const accuracyPercentage = computed(() => {
  if (!props.statistics.answered) return 0
  return Math.round((props.statistics.correct / props.statistics.answered) * 100)
})

// 方法
function getModeDescription(mode: string): string {
  const modeDescriptions: Record<string, string> = {
    normal: '不限时间，专注学习',
    timed: '限时作答，模拟考试',
    challenge: '错题重做，提升能力'
  }
  return modeDescriptions[mode] || '自由练习模式'
}

function isCurrentDifficulty(stars: number): boolean {
  if (!props.currentQuestion) return false
  return props.currentQuestion.difficulty === stars
}

function getAccuracyColor(percentage: number): string {
  if (percentage >= 80) return '#10b981' // green
  if (percentage >= 60) return '#f59e0b' // yellow
  return '#ef4444' // red
}

function startQuickQuiz() {
  emit('start-quiz', props.quizConfig)
}

function resetQuiz() {
  emit('reset-quiz')
}

function pauseQuiz() {
  emit('pause-quiz')
}

function showHelp() {
  emit('show-help')
}
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 14px 80px 0;
  height: auto;
  min-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
  max-height: none !important;
}

.sidebar-container::-webkit-scrollbar {
  display: none;
}

.sidebar-section {
  background: transparent;
  backdrop-filter: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  border: none;
  max-width: 100%;
  box-sizing: border-box;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 12px;
  color: #333;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 24px;
  height: 2px;
  background-color: #3b82f6;
  border-radius: 2px;
}

/* 规则卡片 */
.rules-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rule-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 14px;
  flex-shrink: 0;
}

.rule-content {
  flex: 1;
}

.rule-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 0 0 2px 0;
}

.rule-desc {
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* 当前题目卡片 */
.current-question-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-type-badge {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
}

.question-difficulty {
  display: flex;
  align-items: center;
  gap: 8px;
}

.difficulty-label {
  font-size: 12px;
  color: #666;
}

.difficulty-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 12px;
  color: #ddd;
}

.star.active {
  color: #fbbf24;
}

.question-progress {
  display: flex;
  justify-content: center;
}

.progress-circle {
  position: relative;
  width: 60px;
  height: 60px;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-fill {
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-percentage {
  font-size: 12px;
  font-weight: 600;
  color: #3b82f6;
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 8px;
  padding: 12px 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
}

.stat-icon.correct {
  background: #10b981;
}

.stat-icon.wrong {
  background: #ef4444;
}

.stat-icon.pending {
  background: #f59e0b;
}

.stat-info {
  text-align: center;
}

.stat-number {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 10px;
  color: #666;
  margin-top: 2px;
}

/* 正确率仪表 */
.accuracy-meter {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.meter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.meter-label {
  font-size: 12px;
  color: #666;
}

.meter-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.meter-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 难度指南 */
.difficulty-guide {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.difficulty-level {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.difficulty-level.highlighted {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.level-stars {
  display: flex;
  gap: 2px;
}

.level-info {
  flex: 1;
}

.level-name {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.level-desc {
  font-size: 10px;
  color: #666;
}

/* 快速操作 */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn.primary {
  background: rgba(59, 130, 246, 0.9);
  color: white;
  border-color: rgba(59, 130, 246, 0.3);
}

.action-btn.primary:hover {
  background: rgba(37, 99, 235, 0.9);
}

.action-btn.secondary {
  color: #666;
}

.action-btn.secondary:hover {
  border-color: rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.95);
}

.action-btn.danger {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border-color: rgba(239, 68, 68, 0.3);
}

.action-btn.danger:hover {
  background: rgba(220, 38, 38, 0.9);
}

.action-btn.info {
  background: rgba(14, 165, 233, 0.9);
  color: white;
  border-color: rgba(14, 165, 233, 0.3);
}

.action-btn.info:hover {
  background: rgba(2, 132, 199, 0.9);
}

.action-btn.full-width {
  width: 100%;
}

/* 学习提示 */
.tips-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.tip-item i {
  color: #3b82f6;
  font-size: 10px;
  width: 12px;
  flex-shrink: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  
  .stat-card {
    flex-direction: row;
    justify-content: flex-start;
    padding: 8px 12px;
  }
  
  .difficulty-level {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style> 