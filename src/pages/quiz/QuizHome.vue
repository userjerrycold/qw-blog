<template>
  <div class="quiz-page">
    <!-- 添加FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <PageLayout>
      <div class="quiz-container">
        <div class="page-header">
          <h1 class="page-title">动态题集</h1>
          
          <!-- 搜索栏和统计 -->
          <div class="search-and-stats">
            <div class="search-and-buttons">
              <!-- 搜索框 -->
              <div class="search-container">
                <div class="search-box">
                  <div class="search-icon">
                    <i class="fas fa-search"></i>
                  </div>
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="搜索题目内容..." 
                    class="search-input"
                    @keyup.enter="handleSearch"
                  />
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="action-buttons">
                <button class="action-button" @click="showHistory" title="答题历史">
                  <i class="fas fa-history"></i>
                </button>
                <button class="action-button" @click="showAnalytics" title="学习分析">
                  <i class="fas fa-chart-line"></i>
                </button>
                <button class="action-button primary" @click="startQuickQuiz" title="快速开始">
                  <i class="fas fa-play"></i>
                </button>
              </div>
            </div>
            
            <!-- 题目类型筛选 -->
            <div class="type-filters">
              <div class="filter-tags">
                <div 
                  v-for="type in quizTypes" 
                  :key="type.code"
                  class="filter-tag"
                  :class="[
                    { 'active': activeTypeCode === type.code },
                    `tag-${type.code}`
                  ]"
                  @click="setActiveType(type.code)"
                >
                  <i :class="getTypeIcon(type.code)"></i> {{ type.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-divider"></div>
        
        <!-- 主要内容区域 -->
        <div v-if="!quizStarted" class="quiz-setup">
          <!-- 配置卡片 -->
          <div class="setup-card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-cog"></i>
                题目配置
              </h2>
              <p class="card-subtitle">根据您的需求定制专属题集</p>
            </div>
            
            <div class="card-content">
              <!-- 题目分类选择 -->
              <div class="config-section">
                <h3 class="section-title">
                  <i class="fas fa-tags"></i>
                  题目类型
                </h3>
                <div class="question-type-grid">
                  <div 
                    v-for="type in questionTypes" 
                    :key="type.id"
                    class="type-card"
                    :class="{ 'selected': selectedQuestionTypes.includes(type.id) }"
                    @click="toggleQuestionType(type.id)"
                  >
                    <div class="type-icon">
                      <i :class="type.icon"></i>
                    </div>
                    <div class="type-info">
                      <h4 class="type-name">{{ type.name }}</h4>
                      <p class="type-desc">{{ type.description }}</p>
                    </div>
                    <div v-if="selectedQuestionTypes.includes(type.id)" class="selected-indicator">
                      <i class="fas fa-check"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 知识点选择 -->
              <div class="config-section">
                <h3 class="section-title">
                  <i class="fas fa-book"></i>
                  知识领域
                </h3>
                <div class="subject-grid">
                  <div 
                    v-for="subject in subjects" 
                    :key="subject.id"
                    class="subject-card"
                    :class="{ 'selected': selectedSubjects.includes(subject.id) }"
                    @click="toggleSubject(subject.id)"
                  >
                    <div class="subject-icon">
                      <i :class="subject.icon"></i>
                    </div>
                    <div class="subject-info">
                      <h4 class="subject-name">{{ subject.name }}</h4>
                      <p class="subject-desc">{{ subject.description }}</p>
                      <div class="subject-stats">
                        <span class="stat-item">
                          <i class="fas fa-question-circle"></i>
                          {{ subject.questionCount }} 题
                        </span>
                      </div>
                    </div>
                    <div v-if="selectedSubjects.includes(subject.id)" class="selected-indicator">
                      <i class="fas fa-check"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 难度配置 -->
              <div class="config-section">
                <h3 class="section-title">
                  <i class="fas fa-signal"></i>
                  难度设置
                </h3>
                <div class="difficulty-config">
                  <div class="difficulty-range">
                    <div class="range-item">
                      <label class="range-label">最低难度</label>
                      <div class="difficulty-stars">
                        <span 
                          v-for="i in 5" 
                          :key="`min-${i}`"
                          class="star"
                          :class="{ 'active': i <= minDifficulty }"
                          @click="minDifficulty = i"
                        >
                          <i class="fas fa-star"></i>
                        </span>
                      </div>
                    </div>
                    <div class="range-divider">至</div>
                    <div class="range-item">
                      <label class="range-label">最高难度</label>
                      <div class="difficulty-stars">
                        <span 
                          v-for="i in 5" 
                          :key="`max-${i}`"
                          class="star"
                          :class="{ 'active': i <= maxDifficulty }"
                          @click="maxDifficulty = i"
                        >
                          <i class="fas fa-star"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 题目数量 -->
              <div class="config-section">
                <h3 class="section-title">
                  <i class="fas fa-list-ol"></i>
                  题目数量
                </h3>
                <div class="quantity-config">
                  <div class="quantity-slider">
                    <input 
                      type="range" 
                      v-model="questionCount" 
                      min="5" 
                      max="50" 
                      step="5"
                      class="slider"
                    />
                    <div class="slider-info">
                      <span class="current-value">{{ questionCount }} 道题</span>
                      <div class="slider-marks">
                        <span>50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 答题模式 -->
              <div class="config-section">
                <h3 class="section-title">
                  <i class="fas fa-clock"></i>
                  答题模式
                </h3>
                <div class="mode-config">
                  <div class="mode-options">
                    <div 
                      v-for="mode in answerModes" 
                      :key="mode.value"
                      class="mode-option"
                      :class="{ 'selected': selectedMode === mode.value }"
                      @click="selectedMode = mode.value"
                    >
                      <div class="mode-icon">
                        <i :class="mode.icon"></i>
                      </div>
                      <div class="mode-info">
                        <h4 class="mode-name">{{ mode.name }}</h4>
                        <p class="mode-desc">{{ mode.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <div class="config-summary">
                <div class="summary-item">
                  <i class="fas fa-tags"></i>
                  <span>{{ selectedQuestionTypes.length }} 种题型</span>
                </div>
                <div class="summary-item">
                  <i class="fas fa-layer-group"></i>
                  <span>{{ selectedSubjects.length }} 个领域</span>
                </div>
                <div class="summary-item">
                  <i class="fas fa-star"></i>
                  <span>{{ minDifficulty }}-{{ maxDifficulty }} 星难度</span>
                </div>
                <div class="summary-item">
                  <i class="fas fa-list-ol"></i>
                  <span>{{ questionCount }} 道题</span>
                </div>
              </div>
              <button 
                class="start-button"
                :disabled="!canStart"
                @click="startQuiz"
              >
                <i class="fas fa-rocket"></i>
                开始答题
              </button>
            </div>
          </div>
        </div>
        
        <!-- 答题界面 -->
        <div v-else class="quiz-interface">
          <div class="quiz-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
            </div>
            <div class="progress-text">
              {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
            </div>
          </div>
          
          <div class="question-card">
            <div class="question-header">
              <div class="question-meta">
                <span class="question-type">{{ currentQuestion.type }}</span>
                <div class="question-difficulty">
                  <span v-for="i in currentQuestion.difficulty" :key="i" class="star active">
                    <i class="fas fa-star"></i>
                  </span>
                  <span v-for="i in (5 - currentQuestion.difficulty)" :key="`empty-${i}`" class="star">
                    <i class="far fa-star"></i>
                  </span>
                </div>
                <div class="question-tags" v-if="currentQuestion.tags">
                  <span 
                    v-for="tag in currentQuestion.tags" 
                    :key="tag" 
                    class="tag-badge"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="question-timer" v-if="selectedMode === 'timed'">
                <i class="fas fa-clock"></i>
                {{ formatTime(remainingTime) }}
              </div>
            </div>
            
            <div class="question-content">
              <h3 class="question-text">{{ currentQuestion.text }}</h3>
              
              <!-- 选择题选项 -->
              <div v-if="currentQuestion.type === '单选题' || currentQuestion.type === '多选题'" class="options-list">
                <div 
                  v-for="(option, index) in currentQuestion.options" 
                  :key="index"
                  class="option-item"
                  :class="{ 'selected': isOptionSelected(index) }"
                  @click="selectOption(index)"
                >
                  <div class="option-marker">{{ String.fromCharCode(65 + index) }}</div>
                  <div class="option-text">{{ option }}</div>
                </div>
              </div>
              
              <!-- 判断题 -->
              <div v-else-if="currentQuestion.type === '判断题'" class="judgment-options">
                <div 
                  class="judgment-option"
                  :class="{ 'selected': selectedBooleanAnswer === true }"
                  @click="selectedBooleanAnswer = true"
                >
                  <i class="fas fa-check"></i>
                  <span>正确</span>
                </div>
                <div 
                  class="judgment-option"
                  :class="{ 'selected': selectedBooleanAnswer === false }"
                  @click="selectedBooleanAnswer = false"
                >
                  <i class="fas fa-times"></i>
                  <span>错误</span>
                </div>
              </div>
              
              <!-- 填空题/简答题 -->
              <div v-else-if="currentQuestion.type === '简答题' || currentQuestion.type === '填空题'" class="fill-blank">
                <textarea 
                  v-model="selectedTextAnswer"
                  placeholder="请输入您的答案..."
                  class="answer-input"
                ></textarea>
              </div>
            </div>
            
            <div class="question-actions">
              <button class="action-btn secondary" @click="skipQuestion">
                <i class="fas fa-step-forward"></i>
                跳过
              </button>
              <button 
                class="action-btn primary" 
                :disabled="!hasAnswer"
                @click="submitAnswer"
              >
                <i class="fas fa-check"></i>
                {{ isLastQuestion ? '完成答题' : '下一题' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <template #rightSidebar>
        <QuizRightSidebar 
          :quiz-config="quizConfig"
          :current-question="currentQuestion"
          :quiz-started="quizStarted"
          :statistics="quizStatistics"
          @start-quiz="handleStartQuiz"
          @reset-quiz="resetQuiz"
        />
      </template>
    </PageLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue'
import QuizRightSidebar from '@/components/layout/QuizRightSidebar.vue'

// 响应式数据
const searchQuery = ref('')
const activeTypeCode = ref(0)
const quizStarted = ref(false)
const currentQuestionIndex = ref(0)

// 为不同题型使用不同的答案存储
const selectedMultipleAnswer = ref<number[]>([])  // 多选题答案
const selectedSingleAnswer = ref<number | null>(null)  // 单选题答案
const selectedBooleanAnswer = ref<boolean | null>(null)  // 判断题答案
const selectedTextAnswer = ref('')  // 填空题/简答题答案

const remainingTime = ref(300) // 5分钟
const selectedSubjects = ref<number[]>([])
const selectedQuestionTypes = ref<number[]>([])  // 新增：选中的题目类型
const minDifficulty = ref(1)
const maxDifficulty = ref(5)
const questionCount = ref(20)
const selectedMode = ref('normal')

// 题目分类（按照优化建议添加）
const questionTypes = [
  {
    id: 1,
    name: '单选题',
    description: '四选一，考察基础概念',
    icon: 'fas fa-dot-circle'
  },
  {
    id: 2,
    name: '多选题',
    description: '多项选择，考察综合理解',
    icon: 'fas fa-check-square'
  },
  {
    id: 3,
    name: '判断题',
    description: '对错判断，快速检验知识点',
    icon: 'fas fa-question-circle'
  },
  {
    id: 4,
    name: '简答题',
    description: '文字表述，考察深度理解',
    icon: 'fas fa-edit'
  },
  {
    id: 5,
    name: '填空题',
    description: '填空补充，精准考察',
    icon: 'fas fa-pen'
  },
  {
    id: 6,
    name: '代码题',
    description: '代码分析，实践能力',
    icon: 'fas fa-code'
  }
]

// 题目类型
const quizTypes = [
  { code: 0, name: '全部', icon: 'fas fa-globe' },
  { code: 1, name: 'Java基础', icon: 'fab fa-java' },
  { code: 2, name: '数据库', icon: 'fas fa-database' },
  { code: 3, name: '中间件', icon: 'fas fa-server' },
  { code: 4, name: '系统设计', icon: 'fas fa-sitemap' },
  { code: 5, name: '算法', icon: 'fas fa-project-diagram' }
]

// 知识领域（按照优化建议扩展）
const subjects = [
  {
    id: 1,
    name: 'Java基础',
    description: '面向对象、数据类型、流程控制、异常处理',
    icon: 'fab fa-java',
    questionCount: 120,
    color: '#f89820'
  },
  {
    id: 2,
    name: 'Java集合框架',
    description: 'List、Set、Map、Iterator、Collections',
    icon: 'fas fa-layer-group',
    questionCount: 85,
    color: '#10b981'
  },
  {
    id: 3,
    name: 'Java多线程',
    description: 'Thread、synchronized、volatile、线程池、并发工具',
    icon: 'fas fa-cogs',
    questionCount: 95,
    color: '#ef4444'
  },
  {
    id: 4,
    name: 'JVM与性能调优',
    description: 'JVM结构、类加载、垃圾回收、性能调优',
    icon: 'fas fa-memory',
    questionCount: 78,
    color: '#8b5cf6'
  },
  {
    id: 5,
    name: 'Spring框架',
    description: 'IoC、AOP、SpringBoot、SpringMVC',
    icon: 'fas fa-leaf',
    questionCount: 105,
    color: '#6db33f'
  },
  {
    id: 6,
    name: 'MySQL数据库',
    description: '索引、事务、锁机制、查询优化、主从复制',
    icon: 'fas fa-database',
    questionCount: 90,
    color: '#00758f'
  },
  {
    id: 7,
    name: 'Redis缓存',
    description: '数据类型、持久化、集群、缓存策略',
    icon: 'fas fa-memory',
    questionCount: 65,
    color: '#dc382d'
  },
  {
    id: 8,
    name: 'Spring Cloud微服务',
    description: '注册中心、网关、熔断、配置中心、链路追踪',
    icon: 'fas fa-cloud',
    questionCount: 75,
    color: '#0ea5e9'
  },
  {
    id: 9,
    name: '消息队列',
    description: 'Kafka、RabbitMQ、消息可靠性、顺序消息',
    icon: 'fas fa-exchange-alt',
    questionCount: 60,
    color: '#f59e0b'
  },
  {
    id: 10,
    name: '分布式系统',
    description: '分布式事务、一致性、CAP理论、分布式锁',
    icon: 'fas fa-sitemap',
    questionCount: 55,
    color: '#84cc16'
  },
  {
    id: 11,
    name: '算法与数据结构',
    description: '排序、查找、树、图、动态规划',
    icon: 'fas fa-project-diagram',
    questionCount: 80,
    color: '#06b6d4'
  },
  {
    id: 12,
    name: '系统设计',
    description: '高并发、高可用、秒杀系统、短链接系统',
    icon: 'fas fa-drafting-compass',
    questionCount: 45,
    color: '#ec4899'
  }
]

// 答题模式
const answerModes = [
  {
    value: 'normal',
    name: '练习模式',
    description: '不限时间，重点学习',
    icon: 'fas fa-book-open'
  },
  {
    value: 'timed',
    name: '限时模式',
    description: '模拟考试，提升效率',
    icon: 'fas fa-stopwatch'
  },
  {
    value: 'challenge',
    name: '挑战模式',
    description: '错题重做，突破弱点',
    icon: 'fas fa-trophy'
  }
]

// 当前题目模拟数据（扩展属性）
const currentQuestion = ref({
  id: 1,
  text: 'Java中String类的特点是什么？',
  type: '单选题',
  difficulty: 3,
  tags: ['Java基础', 'String类'],  // 新增：知识点标签
  module: 'Java基础',  // 新增：所属模块
  options: [
    'String是可变的',
    'String是不可变的',
    'String可以被继承',
    'String是基本数据类型'
  ],
  correctAnswer: 1
})

// 计算属性
const canStart = computed(() => {
  return selectedSubjects.value.length > 0 && 
         selectedQuestionTypes.value.length > 0 && 
         minDifficulty.value <= maxDifficulty.value
})

const hasAnswer = computed(() => {
  const questionType = currentQuestion.value.type
  if (questionType === '单选题') {
    return selectedSingleAnswer.value !== null
  } else if (questionType === '多选题') {
    return selectedMultipleAnswer.value.length > 0
  } else if (questionType === '判断题') {
    return selectedBooleanAnswer.value !== null
  } else if (questionType === '简答题' || questionType === '填空题') {
    return selectedTextAnswer.value.trim() !== ''
  }
  return false
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value >= questionCount.value - 1
})

const progressPercentage = computed(() => {
  return ((currentQuestionIndex.value + 1) / questionCount.value) * 100
})

const totalQuestions = computed(() => {
  return questionCount.value
})

const quizConfig = computed(() => ({
  subjects: selectedSubjects.value,
  questionTypes: selectedQuestionTypes.value,  // 新增
  difficulty: { min: minDifficulty.value, max: maxDifficulty.value },
  count: questionCount.value,
  mode: selectedMode.value
}))

const quizStatistics = computed(() => ({
  total: questionCount.value,
  answered: currentQuestionIndex.value,
  correct: 0, // 这里需要根据实际答题情况计算
  timeSpent: 0
}))

// 方法
function setActiveType(code: number) {
  activeTypeCode.value = code
}

function getTypeIcon(code: number): string {
  const type = quizTypes.find(t => t.code === code)
  return type ? type.icon : 'fas fa-question'
}

function toggleQuestionType(id: number) {
  const index = selectedQuestionTypes.value.indexOf(id)
  if (index > -1) {
    selectedQuestionTypes.value.splice(index, 1)
  } else {
    selectedQuestionTypes.value.push(id)
  }
}

function toggleSubject(id: number) {
  const index = selectedSubjects.value.indexOf(id)
  if (index > -1) {
    selectedSubjects.value.splice(index, 1)
  } else {
    selectedSubjects.value.push(id)
  }
}

// 新增：判断选项是否被选中
function isOptionSelected(index: number): boolean {
  const questionType = currentQuestion.value.type
  if (questionType === '单选题') {
    return selectedSingleAnswer.value === index
  } else if (questionType === '多选题') {
    return selectedMultipleAnswer.value.includes(index)
  }
  return false
}

// 新增：选择选项的方法
function selectOption(index: number) {
  const questionType = currentQuestion.value.type
  if (questionType === '单选题') {
    selectedSingleAnswer.value = index
  } else if (questionType === '多选题') {
    const currentIndex = selectedMultipleAnswer.value.indexOf(index)
    if (currentIndex > -1) {
      selectedMultipleAnswer.value.splice(currentIndex, 1)
    } else {
      selectedMultipleAnswer.value.push(index)
    }
  }
}

function startQuiz() {
  if (canStart.value) {
    quizStarted.value = true
    currentQuestionIndex.value = 0
    resetAnswers()
  }
}

function startQuickQuiz() {
  // 快速开始，使用默认配置
  selectedSubjects.value = [1, 2] // 默认选择前两个科目
  selectedQuestionTypes.value = [1, 2] // 默认选择单选题和多选题
  startQuiz()
}

function handleStartQuiz(config: any) {
  // 从右侧边栏触发的开始答题
  Object.assign(quizConfig.value, config)
  startQuiz()
}

function resetQuiz() {
  quizStarted.value = false
  currentQuestionIndex.value = 0
  resetAnswers()
  selectedSubjects.value = []
  selectedQuestionTypes.value = []
}

function resetAnswers() {
  selectedSingleAnswer.value = null
  selectedMultipleAnswer.value = []
  selectedBooleanAnswer.value = null
  selectedTextAnswer.value = ''
}

function submitAnswer() {
  if (hasAnswer.value) {
    if (isLastQuestion.value) {
      // 完成答题，显示结果
      completeQuiz()
    } else {
      // 下一题
      nextQuestion()
    }
  }
}

function nextQuestion() {
  currentQuestionIndex.value++
  resetAnswers()
  // 这里应该加载下一题的数据
}

function skipQuestion() {
  nextQuestion()
}

function completeQuiz() {
  // 答题完成逻辑
  console.log('Quiz completed!')
}

function handleSearch() {
  console.log('Searching:', searchQuery.value)
}

function showHistory() {
  console.log('Show history')
}

function showAnalytics() {
  console.log('Show analytics')
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 生命周期
onMounted(() => {
  console.log('Quiz page mounted')
})
</script>

<style scoped>
.quiz-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  position: relative;
}

.quiz-container {
  padding: 0 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 60px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 4px;
  padding: 16px 0 12px 0;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title::before {
  content: '';
  width: 24px;
  height: 24px;
  background: url('@/assets/question.svg') no-repeat center;
  background-size: contain;
  opacity: 0.8;
}

.content-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.08);
  margin: 0;
}

/* 搜索和筛选区域 */
.search-and-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-and-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-box {
  position: relative;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.search-box:hover,
.search-box:focus-within {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.search-input {
  width: 100%;
  height: 100%;
  padding: 0 16px 0 44px;
  border: none;
  border-radius: 12px;
  background: transparent;
  font-size: 14px;
  color: #333;
}

.search-input:focus {
  outline: none;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: #666;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-button {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 16px;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-button.primary {
  background: rgba(59, 130, 246, 0.9);
  color: white;
  border-color: rgba(59, 130, 246, 0.3);
}

.action-button.primary:hover {
  background: rgba(37, 99, 235, 0.9);
}

/* 筛选标签 */
.type-filters {
  margin-top: 8px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  cursor: pointer;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  color: #666;
  font-size: 14px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-tag:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-tag.active {
  background: rgba(59, 130, 246, 0.9);
  color: white;
  border-color: rgba(59, 130, 246, 0.3);
}

/* 配置界面 */
.quiz-setup {
  padding: 20px 0;
}

.setup-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.card-content {
  padding: 24px;
}

.config-section {
  margin-bottom: 32px;
}

.config-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 题目类型选择 */
.question-type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.type-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.type-card.selected {
  border-color: rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.05);
}

.type-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #3b82f6;
  flex-shrink: 0;
}

.type-info {
  flex: 1;
}

.type-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.type-desc {
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* 知识点标签样式 */
.question-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.tag-badge {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
}

/* 知识领域选择 */
.subject-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.subject-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.subject-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.subject-card.selected {
  border-color: rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.05);
}

.subject-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #3b82f6;
  flex-shrink: 0;
}

.subject-info {
  flex: 1;
}

.subject-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.subject-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.subject-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
}

.selected-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

/* 难度设置 */
.difficulty-config {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.difficulty-range {
  display: flex;
  align-items: center;
  gap: 20px;
}

.range-item {
  flex: 1;
  text-align: center;
}

.range-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.difficulty-stars {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.star {
  cursor: pointer;
  font-size: 20px;
  color: #ddd;
  transition: all 0.2s ease;
}

.star.active {
  color: #fbbf24;
}

.star:hover {
  transform: scale(1.1);
}

.range-divider {
  font-size: 14px;
  color: #666;
  padding: 0 8px;
}

/* 题目数量 */
.quantity-config {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.quantity-slider {
  text-align: center;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  margin-bottom: 16px;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.slider-marks {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #888;
}

/* 答题模式 */
.mode-config {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.mode-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.mode-option {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.mode-option:hover {
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.mode-option.selected {
  border-color: rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.05);
}

.mode-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #3b82f6;
  flex-shrink: 0;
}

.mode-info {
  flex: 1;
}

.mode-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.mode-desc {
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* 卡片底部 */
.card-footer {
  padding: 20px 24px;
  background: rgba(248, 250, 252, 0.8);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-summary {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.start-button {
  background: rgba(59, 130, 246, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.start-button:hover {
  background: rgba(37, 99, 235, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.start-button:disabled {
  background: rgba(156, 163, 175, 0.5);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 答题界面 */
.quiz-interface {
  padding: 20px 0;
}

.quiz-progress {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: 80px;
  text-align: right;
}

.question-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.question-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.question-type {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.question-difficulty {
  display: flex;
  gap: 2px;
}

.question-timer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #ef4444;
}

.question-content {
  padding: 24px;
}

.question-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

/* 选择题选项 */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
}

.option-item:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.05);
}

.option-item.selected {
  border-color: rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.1);
}

.option-marker {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.option-item.selected .option-marker {
  background: #3b82f6;
  color: white;
}

.option-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

/* 判断题 */
.judgment-options {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.judgment-option {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.judgment-option:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.05);
}

.judgment-option.selected {
  border-color: rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.1);
}

.judgment-option i {
  font-size: 24px;
  color: #3b82f6;
}

.judgment-option span {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 填空题 */
.fill-blank {
  width: 100%;
}

.answer-input {
  width: 100%;
  min-height: 120px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: #333;
  resize: vertical;
  transition: all 0.3s ease;
}

.answer-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.6);
  background: rgba(255, 255, 255, 0.95);
}

.answer-input::placeholder {
  color: #999;
}

/* 题目操作按钮 */
.question-actions {
  padding: 20px 24px;
  background: rgba(248, 250, 252, 0.8);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn.secondary {
  color: #666;
}

.action-btn.secondary:hover {
  border-color: rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.95);
}

.action-btn.primary {
  background: rgba(59, 130, 246, 0.9);
  color: white;
  border-color: rgba(59, 130, 246, 0.3);
}

.action-btn.primary:hover {
  background: rgba(37, 99, 235, 0.9);
}

.action-btn:disabled {
  background: rgba(156, 163, 175, 0.3);
  color: #999;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-and-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .subject-grid {
    grid-template-columns: 1fr;
  }
  
  .difficulty-range {
    flex-direction: column;
    gap: 16px;
  }
  
  .range-divider {
    order: 1;
  }
  
  .mode-options {
    grid-template-columns: 1fr;
  }
  
  .judgment-options {
    flex-direction: column;
  }
  
  .question-actions {
    flex-direction: column;
  }
}
</style>
