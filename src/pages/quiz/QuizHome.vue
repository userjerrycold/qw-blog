<template>
  <div class="quiz-page">
    <!-- 添加FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <PageLayout>
      <div class="quiz-container">
        <div class="page-header">
          <h1 class="page-title">动态题集</h1>
          
          <!-- 快速操作按钮 -->
          <div class="header-actions">
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
              <!-- 题库分类选择 -->
              <div class="config-section">
                <h3 class="section-title">
                  <i class="fas fa-layer-group"></i>
                  题库分类
                </h3>
                <div class="category-grid">
                  <div 
                    v-for="category in categories" 
                    :key="category.id"
                    class="category-card"
                    :class="{ 'selected': selectedCategories.includes(category.id) }"
                    @click="toggleCategory(category.id)"
                  >
                    <div class="category-icon">
                      <i :class="category.icon"></i>
                    </div>
                    <div class="category-info">
                      <h4 class="category-name">{{ category.name }}</h4>
                      <p class="category-desc">{{ category.description }}</p>
                    </div>
                    <div v-if="selectedCategories.includes(category.id)" class="selected-indicator">
                      <i class="fas fa-check"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 知识领域选择 -->
              <div class="config-section">
                <h3 class="section-title">
                  <i class="fas fa-book"></i>
                  知识领域
                  <span v-if="selectedCategories.length === 0" class="hint-text">请先选择题库分类</span>
                </h3>
                <div v-if="filteredSubjects.length > 0" class="subject-grid">
                  <div 
                    v-for="subject in filteredSubjects" 
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
                      
                      <!-- 子领域展示 -->
                      <div v-if="subject.subDomains && subject.subDomains.length > 0" class="sub-domains">
                        <div class="sub-domains-header">
                          <i class="fas fa-sitemap"></i>
                          <span>子领域：</span>
                        </div>
                        <div class="sub-domain-tags">
                          <span 
                            v-for="subDomain in subject.subDomains" 
                            :key="subDomain.id"
                            class="sub-domain-tag"
                            :class="{ 'selected': selectedSubDomains.includes(subDomain.id) }"
                            @click.stop="toggleSubDomain(subDomain.id)"
                            :title="subDomain.description"
                          >
                            {{ subDomain.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div v-if="selectedSubjects.includes(subject.id)" class="selected-indicator">
                      <i class="fas fa-check"></i>
                    </div>
                  </div>
                </div>
                <div v-else-if="selectedCategories.length > 0" class="empty-state">
                  <i class="fas fa-info-circle"></i>
                  <span>所选分类下暂无可用的知识领域</span>
                </div>
              </div>
              
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
                  <i class="fas fa-layer-group"></i>
                  <span>{{ selectedCategories.length }} 个分类</span>
                </div>
                <div class="summary-item">
                  <i class="fas fa-book"></i>
                  <span>{{ selectedSubjects.length }} 个领域</span>
                </div>
                <div class="summary-item" v-if="selectedSubDomains.length > 0">
                  <i class="fas fa-sitemap"></i>
                  <span>{{ selectedSubDomains.length }} 个子领域</span>
                </div>
                <div class="summary-item">
                  <i class="fas fa-tags"></i>
                  <span>{{ selectedQuestionTypes.length }} 种题型</span>
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
        <div v-else class="quiz-interface" :class="{ 'focus-mode-active': focusMode }">
          <!-- 背景模糊遮罩 -->
          <div v-if="focusMode" class="quiz-background-blur"></div>
          
          <div class="quiz-progress" :class="{ 'focus-compact': focusMode }">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
            </div>
            <div class="progress-text">
              {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
            </div>
          </div>
          
          <!-- 专注模式控制按钮 -->
          <div class="focus-mode-controls">
            <button 
              class="focus-mode-toggle" 
              :class="{ 'active': focusMode }"
              @click="toggleFocusMode"
              :title="focusMode ? '退出专注模式 (Esc)' : '进入专注模式 (Ctrl+F)'"
            >
              <i :class="focusMode ? 'fas fa-compress' : 'fas fa-expand'"></i>
              <span>{{ focusMode ? '退出专注' : '专注答题' }}</span>
            </button>
          </div>
          
          <div class="question-card" :class="{ 'focus-enhanced': focusMode }">
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
              
              <!-- 题目倒计时器 -->
              <div class="question-countdown">
                <div class="countdown-circle" :class="timerColorClass">
                  <svg class="countdown-ring" width="60" height="60">
                    <circle
                      class="countdown-ring-bg"
                      stroke="rgba(0, 0, 0, 0.1)"
                      stroke-width="4"
                      fill="transparent"
                      r="26"
                      cx="30"
                      cy="30"
                    />
                    <circle
                      class="countdown-ring-progress"
                      stroke-width="4"
                      fill="transparent"
                      r="26"
                      cx="30"
                      cy="30"
                      :stroke-dasharray="`${163} ${163}`"
                      :stroke-dashoffset="163 * (1 - timerPercentage / 100)"
                      stroke-linecap="round"
                    />
                  </svg>
                  <div class="countdown-text">
                    <span class="countdown-number">{{ questionTimer }}</span>
                  </div>
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
        <div :class="{ 'sidebar-blurred': focusMode }">
          <QuizRightSidebar 
            :quiz-config="quizConfig"
            :current-question="currentQuestion"
            :quiz-started="quizStarted"
            :statistics="quizStatistics"
            @start-quiz="handleStartQuiz"
            @reset-quiz="resetQuiz"
          />
        </div>
      </template>
    </PageLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue'
import QuizRightSidebar from '@/components/layout/QuizRightSidebar.vue'

// 响应式数据
const quizStarted = ref(false)
const currentQuestionIndex = ref(0)
const focusMode = ref(false) // 新增：专注模式状态

// 为不同题型使用不同的答案存储
const selectedMultipleAnswer = ref<number[]>([])  // 多选题答案
const selectedSingleAnswer = ref<number | null>(null)  // 单选题答案
const selectedBooleanAnswer = ref<boolean | null>(null)  // 判断题答案
const selectedTextAnswer = ref('')  // 填空题/简答题答案

const remainingTime = ref(300) // 5分钟
const questionTimer = ref(0) // 新增：单题倒计时
const questionTimerInterval = ref<NodeJS.Timeout | null>(null) // 新增：倒计时定时器
const selectedCategories = ref<number[]>([])  // 选中的题库分类
const selectedSubjects = ref<number[]>([])  // 选中的知识领域
const selectedSubDomains = ref<number[]>([])  // 新增：选中的子领域
const selectedQuestionTypes = ref<number[]>([])  // 选中的题目类型
const minDifficulty = ref(1)
const maxDifficulty = ref(5)
const questionCount = ref(20)
const selectedMode = ref('normal')

// 题库分类
const categories = [
  {
    id: 1,
    name: 'Java基础',
    description: 'Java语言核心特性与基础知识',
    icon: 'fab fa-java'
  },
  {
    id: 2,
    name: '数据库',
    description: 'MySQL、Redis等数据存储技术',
    icon: 'fas fa-database'
  },
  {
    id: 3,
    name: '中间件',
    description: 'Spring、消息队列等中间件技术',
    icon: 'fas fa-server'
  },
  {
    id: 4,
    name: '系统设计',
    description: '架构设计与分布式系统',
    icon: 'fas fa-sitemap'
  },
  {
    id: 5,
    name: '算法',
    description: '数据结构与算法设计',
    icon: 'fas fa-project-diagram'
  }
]

// 题目分类
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

// 知识领域（重新设计，增加分类关联和子领域）
const subjects = [
  // Java基础分类
  {
    id: 1,
    name: 'Java基础语法',
    categoryId: 1,
    description: '数据类型、流程控制、面向对象基础',
    icon: 'fab fa-java',
    questionCount: 80,
    color: '#f89820',
    subDomains: [
      { id: 1, name: '数据类型', description: '基本类型、包装类、类型转换' },
      { id: 2, name: '流程控制', description: 'if/for/while/switch语句' },
      { id: 3, name: '面向对象', description: '类、对象、封装、继承、多态' },
      { id: 4, name: '异常机制', description: 'try-catch-finally、自定义异常' }
    ]
  },
  {
    id: 2,
    name: 'Java集合框架',
    categoryId: 1,
    description: 'List、Set、Map、Iterator、Collections',
    icon: 'fas fa-layer-group',
    questionCount: 65,
    color: '#10b981',
    subDomains: [
      { id: 5, name: 'List集合', description: 'ArrayList、LinkedList、Vector' },
      { id: 6, name: 'Set集合', description: 'HashSet、TreeSet、LinkedHashSet' },
      { id: 7, name: 'Map集合', description: 'HashMap、TreeMap、LinkedHashMap' },
      { id: 8, name: '并发集合', description: 'ConcurrentHashMap、CopyOnWriteArrayList' }
    ]
  },
  {
    id: 3,
    name: 'Java多线程',
    categoryId: 1,
    description: 'Thread、synchronized、volatile、线程池、并发工具',
    icon: 'fas fa-cogs',
    questionCount: 75,
    color: '#ef4444',
    subDomains: [
      { id: 9, name: '线程基础', description: 'Thread类、Runnable接口、线程状态' },
      { id: 10, name: '同步机制', description: 'synchronized、volatile、Lock' },
      { id: 11, name: '线程池', description: 'Executor框架、ThreadPoolExecutor' },
      { id: 12, name: '并发工具', description: 'CountDownLatch、Semaphore、CyclicBarrier' }
    ]
  },
  {
    id: 4,
    name: 'JVM与性能调优',
    categoryId: 1,
    description: 'JVM结构、类加载、垃圾回收、性能调优',
    icon: 'fas fa-memory',
    questionCount: 60,
    color: '#8b5cf6',
    subDomains: [
      { id: 13, name: 'JVM结构', description: '堆、栈、方法区、程序计数器' },
      { id: 14, name: '类加载', description: '类加载器、双亲委派模型' },
      { id: 15, name: '垃圾回收', description: 'GC算法、收集器、调优参数' },
      { id: 16, name: '性能调优', description: '内存分析、性能监控工具' }
    ]
  },
  
  // 数据库分类
  {
    id: 5,
    name: 'MySQL数据库',
    categoryId: 2,
    description: '索引、事务、锁机制、查询优化、主从复制',
    icon: 'fas fa-database',
    questionCount: 90,
    color: '#00758f',
    subDomains: [
      { id: 17, name: '基础语法', description: 'DDL、DML、DCL语句' },
      { id: 18, name: '索引优化', description: 'B+树、聚簇索引、查询优化' },
      { id: 19, name: '事务处理', description: 'ACID、隔离级别、锁机制' },
      { id: 20, name: '主从复制', description: '复制原理、读写分离、分库分表' }
    ]
  },
  {
    id: 6,
    name: 'Redis缓存',
    categoryId: 2,
    description: '数据类型、持久化、集群、缓存策略',
    icon: 'fas fa-memory',
    questionCount: 55,
    color: '#dc382d',
    subDomains: [
      { id: 21, name: '数据结构', description: 'String、List、Set、Hash、ZSet' },
      { id: 22, name: '持久化', description: 'RDB、AOF、混合持久化' },
      { id: 23, name: '集群部署', description: '主从复制、哨兵、集群' },
      { id: 24, name: '缓存策略', description: '缓存穿透、击穿、雪崩' }
    ]
  },
  
  // 中间件分类
  {
    id: 7,
    name: 'Spring框架',
    categoryId: 3,
    description: 'IoC、AOP、SpringBoot、SpringMVC',
    icon: 'fas fa-leaf',
    questionCount: 85,
    color: '#6db33f',
    subDomains: [
      { id: 25, name: 'IoC容器', description: '依赖注入、Bean生命周期' },
      { id: 26, name: 'AOP切面', description: '切点、通知、代理模式' },
      { id: 27, name: 'SpringBoot', description: '自动配置、Starter、监控' },
      { id: 28, name: 'SpringMVC', description: '请求处理、视图解析、拦截器' }
    ]
  },
  {
    id: 8,
    name: 'Spring Cloud微服务',
    categoryId: 3,
    description: '注册中心、网关、熔断、配置中心、链路追踪',
    icon: 'fas fa-cloud',
    questionCount: 70,
    color: '#0ea5e9',
    subDomains: [
      { id: 29, name: '服务发现', description: 'Eureka、Nacos、Consul' },
      { id: 30, name: '服务网关', description: 'Gateway、路由、过滤器' },
      { id: 31, name: '熔断限流', description: 'Hystrix、Sentinel、Resilience4j' },
      { id: 32, name: '配置管理', description: '配置中心、动态配置、加密' }
    ]
  },
  {
    id: 9,
    name: '消息队列',
    categoryId: 3,
    description: 'Kafka、RabbitMQ、消息可靠性、顺序消息',
    icon: 'fas fa-exchange-alt',
    questionCount: 50,
    color: '#f59e0b',
    subDomains: [
      { id: 33, name: '消息模型', description: '发布订阅、点对点、主题分区' },
      { id: 34, name: '可靠性', description: '消息确认、持久化、重试机制' },
      { id: 35, name: '性能优化', description: '批量处理、压缩、分区策略' },
      { id: 36, name: '监控运维', description: '集群管理、监控告警、故障恢复' }
    ]
  },
  
  // 系统设计分类
  {
    id: 10,
    name: '分布式系统',
    categoryId: 4,
    description: '分布式事务、一致性、CAP理论、分布式锁',
    icon: 'fas fa-sitemap',
    questionCount: 45,
    color: '#84cc16',
    subDomains: [
      { id: 37, name: '分布式理论', description: 'CAP、BASE、一致性算法' },
      { id: 38, name: '分布式事务', description: '2PC、TCC、SAGA、消息事务' },
      { id: 39, name: '分布式锁', description: 'Redis锁、Zookeeper锁、数据库锁' },
      { id: 40, name: '负载均衡', description: '算法策略、健康检查、故障转移' }
    ]
  },
  {
    id: 11,
    name: '高并发架构',
    categoryId: 4,
    description: '秒杀系统、限流策略、缓存架构、异步处理',
    icon: 'fas fa-tachometer-alt',
    questionCount: 40,
    color: '#ec4899',
    subDomains: [
      { id: 41, name: '限流策略', description: '令牌桶、漏桶、滑动窗口' },
      { id: 42, name: '缓存架构', description: '多级缓存、缓存更新、一致性' },
      { id: 43, name: '异步处理', description: '消息队列、事件驱动、CQRS' },
      { id: 44, name: '系统监控', description: '链路追踪、性能监控、告警机制' }
    ]
  },
  
  // 算法分类
  {
    id: 12,
    name: '算法与数据结构',
    categoryId: 5,
    description: '排序、查找、树、图、动态规划',
    icon: 'fas fa-project-diagram',
    questionCount: 65,
    color: '#06b6d4',
    subDomains: [
      { id: 45, name: '基础数据结构', description: '数组、链表、栈、队列' },
      { id: 46, name: '树结构', description: '二叉树、AVL树、红黑树、B+树' },
      { id: 47, name: '图算法', description: 'DFS、BFS、最短路径、最小生成树' },
      { id: 48, name: '动态规划', description: '背包问题、最长子序列、状态转移' }
    ]
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

// 当前题目模拟数据
const currentQuestion = ref({
  id: 1,
  text: 'Java中String类的特点是什么？',
  type: '单选题',
  difficulty: 3,
  tags: ['Java基础', 'String类'],
  module: 'Java基础',
  options: [
    'String是可变的',
    'String是不可变的',
    'String可以被继承',
    'String是基本数据类型'
  ],
  correctAnswer: 1
})

// 计算属性
const filteredSubjects = computed(() => {
  if (selectedCategories.value.length === 0) {
    return []
  }
  return subjects.filter(subject => selectedCategories.value.includes(subject.categoryId))
})

const canStart = computed(() => {
  return selectedCategories.value.length > 0 &&
         selectedSubjects.value.length > 0 && 
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

// 新增：根据难度计算题目时间
const questionTimeLimit = computed(() => {
  const difficulty = currentQuestion.value.difficulty
  return difficulty * 60 // 1星60秒，2星120秒，以此类推
})

// 新增：倒计时百分比（用于圆圈进度）
const timerPercentage = computed(() => {
  if (questionTimeLimit.value === 0) return 0
  // 计算剩余时间的百分比，用于顺时针流失效果
  return (questionTimer.value / questionTimeLimit.value) * 100
})

// 新增：倒计时颜色状态
const timerColorClass = computed(() => {
  const percentage = timerPercentage.value
  if (percentage > 66) return 'timer-green'
  if (percentage > 33) return 'timer-yellow'
  return 'timer-red'
})

const quizConfig = computed(() => ({
  categories: selectedCategories.value,
  subjects: selectedSubjects.value,
  subDomains: selectedSubDomains.value,  // 新增
  questionTypes: selectedQuestionTypes.value,
  difficulty: { min: minDifficulty.value, max: maxDifficulty.value },
  count: questionCount.value,
  mode: selectedMode.value
}))

const quizStatistics = computed(() => ({
  total: questionCount.value,
  answered: currentQuestionIndex.value,
  correct: 0,
  timeSpent: 0
}))

// 方法
function toggleCategory(id: number) {
  const index = selectedCategories.value.indexOf(id)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
    // 当取消选择分类时，同时清空相关的知识领域和子领域
    const relatedSubjects = subjects.filter(s => s.categoryId === id).map(s => s.id)
    selectedSubjects.value = selectedSubjects.value.filter(subjectId => !relatedSubjects.includes(subjectId))
    
    // 清空相关子领域
    const relatedSubDomains = subjects
      .filter(s => s.categoryId === id)
      .flatMap(s => s.subDomains?.map(sd => sd.id) || [])
    selectedSubDomains.value = selectedSubDomains.value.filter(subDomainId => !relatedSubDomains.includes(subDomainId))
  } else {
    selectedCategories.value.push(id)
  }
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
    // 当取消选择知识领域时，同时清空相关的子领域
    const subject = subjects.find(s => s.id === id)
    if (subject && subject.subDomains) {
      const subDomainIds = subject.subDomains.map(sd => sd.id)
      selectedSubDomains.value = selectedSubDomains.value.filter(subDomainId => !subDomainIds.includes(subDomainId))
    }
  } else {
    selectedSubjects.value.push(id)
  }
}

function toggleSubDomain(id: number) {
  const index = selectedSubDomains.value.indexOf(id)
  if (index > -1) {
    selectedSubDomains.value.splice(index, 1)
  } else {
    selectedSubDomains.value.push(id)
  }
}

// 判断选项是否被选中
function isOptionSelected(index: number): boolean {
  const questionType = currentQuestion.value.type
  if (questionType === '单选题') {
    return selectedSingleAnswer.value === index
  } else if (questionType === '多选题') {
    return selectedMultipleAnswer.value.includes(index)
  }
  return false
}

// 选择选项的方法
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

// 新增：开始题目倒计时
function startQuestionTimer() {
  // 清除之前的定时器
  if (questionTimerInterval.value) {
    clearInterval(questionTimerInterval.value)
  }
  
  // 设置初始时间
  questionTimer.value = questionTimeLimit.value
  
  // 开始倒计时
  questionTimerInterval.value = setInterval(() => {
    if (questionTimer.value > 0) {
      questionTimer.value--
    } else {
      // 时间到，自动跳到下一题
      clearInterval(questionTimerInterval.value!)
      questionTimerInterval.value = null
      skipQuestion()
    }
  }, 1000)
}

// 新增：停止题目倒计时
function stopQuestionTimer() {
  if (questionTimerInterval.value) {
    clearInterval(questionTimerInterval.value)
    questionTimerInterval.value = null
  }
}

function startQuiz() {
  if (canStart.value) {
    quizStarted.value = true
    currentQuestionIndex.value = 0
    focusMode.value = true // 默认进入专注模式
    resetAnswers()
    startQuestionTimer() // 开始第一题倒计时
  }
}

function startQuickQuiz() {
  // 快速开始，使用默认配置
  selectedCategories.value = [1, 2] // 默认选择Java基础和数据库
  selectedSubjects.value = [1, 5] // 默认选择Java基础语法和MySQL数据库
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
  focusMode.value = false // 重置时退出专注模式
  stopQuestionTimer() // 停止倒计时
  resetAnswers()
  selectedCategories.value = []
  selectedSubjects.value = []
  selectedSubDomains.value = []
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
    stopQuestionTimer() // 停止当前题目倒计时
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
  startQuestionTimer() // 开始新题目倒计时
  // 这里应该加载下一题的数据
}

function skipQuestion() {
  stopQuestionTimer() // 停止当前题目倒计时
  nextQuestion()
}

function completeQuiz() {
  stopQuestionTimer() // 停止倒计时
  focusMode.value = false // 完成时退出专注模式
  // 答题完成逻辑
  console.log('Quiz completed!')
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

// 新增：切换专注模式
function toggleFocusMode() {
  focusMode.value = !focusMode.value
}

// 新增：键盘快捷键支持
function handleKeyPress(event: KeyboardEvent) {
  if (!quizStarted.value) return
  
  switch(event.key) {
    case 'f':
    case 'F':
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        toggleFocusMode()
      }
      break
    case 'Escape':
      if (focusMode.value) {
        focusMode.value = false
      }
      break
  }
}

// 生命周期
onMounted(() => {
  console.log('Quiz page mounted')
  // 添加键盘监听
  document.addEventListener('keydown', handleKeyPress)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopQuestionTimer()
  // 移除键盘监听
  document.removeEventListener('keydown', handleKeyPress)
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  padding: 16px 0 12px 0;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0;
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

.header-actions {
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

.content-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.08);
  margin: 0;
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

.hint-text {
  font-size: 12px;
  color: #999;
  font-weight: 400;
  margin-left: 8px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  color: #666;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
}

/* 题库分类选择样式 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.category-card {
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

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.category-card.selected {
  border-color: rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.05);
}

.category-icon {
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

.category-info {
  flex: 1;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.category-desc {
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* 题目类型选择样式 */
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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
  align-items: flex-start;
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
  margin-bottom: 12px;
}

.stat-item {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 子领域样式 */
.sub-domains {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.sub-domains-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.sub-domain-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.sub-domain-tag {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.sub-domain-tag:hover {
  background: rgba(99, 102, 241, 0.15);
  transform: translateY(-1px);
}

.sub-domain-tag.selected {
  background: rgba(99, 102, 241, 0.9);
  color: white;
  border-color: rgba(99, 102, 241, 0.9);
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
  position: relative;
  transition: all 0.3s ease;
}

.quiz-interface.focus-mode-active {
  padding: 40px 0;
}

/* 专注模式背景模糊 - 深度高斯模糊版 */
.quiz-background-blur {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1;
  pointer-events: none;
  will-change: opacity;
}

/* 专注模式控制按钮 */
.focus-mode-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
}

.focus-mode-toggle {
  background: rgba(59, 130, 246, 0.95);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  will-change: background-color;
}

.focus-mode-toggle:hover {
  background: rgba(37, 99, 235, 0.95);
}

.focus-mode-toggle.active {
  background: rgba(239, 68, 68, 0.95);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.focus-mode-toggle.active:hover {
  background: rgba(220, 38, 38, 0.95);
}

/* 专注模式时紧凑进度条 */
.quiz-progress.focus-compact {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1002;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 8px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  will-change: transform;
}

.quiz-progress.focus-compact .progress-bar {
  width: 200px;
  height: 4px;
}

.quiz-progress.focus-compact .progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-left: 12px;
}

/* 专注模式固定答题卡片 - 性能优化版 */
.question-card.focus-enhanced {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  will-change: transform;
  animation: focusPulse 3s ease-in-out infinite;
}

/* 轻量级脉动动画 */
@keyframes focusPulse {
  0%, 100% {
    border-color: rgba(59, 130, 246, 0.3);
  }
  50% {
    border-color: rgba(59, 130, 246, 0.5);
  }
}

/* 侧边栏模糊效果 - 性能优化版 */
.sidebar-blurred {
  opacity: 0.4;
  pointer-events: none;
  transition: opacity 0.2s ease;
  will-change: opacity;
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

/* 题目倒计时器 */
.question-countdown {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdown-circle {
  position: relative;
  width: 60px;
  height: 60px;
}

.countdown-ring {
  transform: rotate(-90deg) scaleY(-1);
}

.countdown-ring-bg {
  opacity: 0.3;
}

.countdown-ring-progress {
  transition: stroke-dashoffset 0.3s ease, stroke 0.3s ease;
}

.countdown-circle.timer-green .countdown-ring-progress {
  stroke: #10b981;
}

.countdown-circle.timer-yellow .countdown-ring-progress {
  stroke: #f59e0b;
}

.countdown-circle.timer-red .countdown-ring-progress {
  stroke: #ef4444;
}

.countdown-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: 1;
}

.countdown-number {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

.countdown-unit {
  display: block;
  font-size: 10px;
  color: #666;
  margin-top: 2px;
}

.countdown-circle.timer-red .countdown-number {
  color: #ef4444;
}

.countdown-circle.timer-red .countdown-unit {
  color: #ef4444;
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

/* 专注模式样式 */
.focus-mode-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.focus-mode-overlay.active {
  opacity: 1;
  visibility: visible;
}

.focus-mode-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 90%;
  text-align: center;
  position: relative;
}

.focus-mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.focus-mode-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.focus-mode-close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.focus-mode-close-btn:hover {
  color: #333;
}

.focus-mode-body {
  margin-bottom: 20px;
}

.focus-mode-text {
  font-size: 18px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
}

.focus-mode-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.focus-mode-footer button {
  background: rgba(59, 130, 246, 0.9);
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

.focus-mode-footer button:hover {
  background: rgba(37, 99, 235, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.focus-mode-footer button:disabled {
  background: rgba(156, 163, 175, 0.5);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .category-grid,
  .question-type-grid {
    grid-template-columns: 1fr;
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
  
  .config-summary {
    flex-direction: column;
    gap: 8px;
  }
  
  .summary-item {
    justify-content: center;
  }
  
  .card-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .judgment-options {
    flex-direction: column;
  }
  
  .question-actions {
    flex-direction: column;
  }
  
  /* 专注模式移动端优化 */
  .focus-mode-controls {
    top: 10px;
    right: 10px;
  }
  
  .focus-mode-toggle {
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 20px;
  }
  
  .focus-mode-toggle span {
    display: none;
  }
  
  .quiz-progress.focus-compact {
    top: 10px;
    width: 180px;
    padding: 6px 12px;
  }
  
  .quiz-progress.focus-compact .progress-bar {
    width: 120px;
    height: 3px;
  }
  
  .quiz-progress.focus-compact .progress-text {
    font-size: 11px;
    margin-left: 8px;
  }
  
  .question-card.focus-enhanced {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 95%;
    max-width: none;
    max-height: 85vh;
    margin: 0;
  }
  
  .quiz-interface.focus-mode-active {
    padding: 20px 0;
  }
}
</style>

