<template>
  <div class="quiz-container">
    <!-- 主要内容区域 -->
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
      <!-- 左侧菜单图标 -->
      <div class="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-6">
        <div class="flex flex-col items-center mb-10">
          <div class="w-10 h-10 flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-700 dark:text-gray-300" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M814.51008 94.60736H209.46432c-42.47552 0-76.90752 34.3552-76.90752 76.71808v681.344c0 42.37312 34.432 76.7232 76.90752 76.7232h605.04576c42.47552 0 76.928-34.35008 76.928-76.7232V171.32544c0-42.368-34.44736-76.71808-76.928-76.71808zM313.01632 208.72704h397.88032c15.80032 0 28.53888 16.83456 28.53888 37.57568 0 20.75136-12.77952 37.57568-28.53888 37.57568H313.01632c-15.80032 0-28.544-16.82432-28.544-37.57568 0.00512-20.74112 12.74368-37.57568 28.544-37.57568z m170.39872 644.0448H313.61536c-16.01024 0-28.99456-16.82432-28.99456-37.62688 0-20.74624 12.9792-37.52448 28.99456-37.52448h169.79456c16.03072 0 28.99456 16.77824 28.99456 37.52448 0.00512 20.80256-12.99456 37.62688-28.98944 37.62688z m76.96384-188.66688H311.89504c-15.4624 0-27.96544-17.17248-27.96544-38.38976 0-21.1968 12.50304-38.3232 27.96544-38.3232h248.48384c15.47776 0 27.9808 17.1264 27.9808 38.3232 0.00512 21.21728-12.50304 38.38976-27.9808 38.38976zM313.01632 398.3616h397.88032c15.80032 0 28.53888 16.82944 28.53888 37.59104 0 20.74112-12.77952 37.56544-28.53888 37.56544H313.01632c-15.80032 0-28.544-16.82432-28.544-37.56544 0.00512-20.7616 12.74368-37.59104 28.544-37.59104z m351.33952 419.66592l-73.0624 37.22752 1.54624-81.41312 209.19296-333.62432 71.49568 44.96384-209.17248 332.84608z" fill="currentColor"></path>
            </svg>
          </div>
          <span class="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">题集</span>
        </div>
      </div>
      
      <!-- 中间部分 - 题集配置区域 -->
      <div class="flex-1 overflow-hidden">
        <!-- 顶部标题栏 -->
        <div class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <h1 class="text-xl font-bold text-gray-800 dark:text-gray-200">动态题集配置</h1>
          <div class="flex items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400 mr-4">{{ currentDate }}</span>
            <button class="flex items-center justify-center rounded-full w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400">
              <i class="fas fa-cog"></i>
            </button>
          </div>
        </div>
        
        <!-- 主内容区域 - 题集配置 -->
        <div class="p-6 h-[calc(100%-4rem)] overflow-y-auto">
          <!-- 题集配置卡片 -->
          <div v-if="!quizStarted" class="bg-white dark:bg-gray-800 rounded-xl shadow-md backdrop-filter backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- 卡片标题 -->
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                <i class="fas fa-random mr-2"></i> 随机出题规则配置
              </h2>
            </div>
            
            <!-- 卡片内容 -->
            <div class="px-6 py-4 space-y-6">
              <!-- 题目类型选择 -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">题目类型</label>
                <div class="flex flex-wrap gap-3">
                  <button 
                    v-for="type in questionTypes" 
                    :key="type.id" 
                    @click="toggleSelectedType(type.id)"
                    class="px-4 py-2 rounded-full text-sm font-medium transition-colors backdrop-filter backdrop-blur-lg"
                    :class="selectedTypes.includes(type.id) ? 
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-600' : 
                      'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'"
                  >
                    <i :class="type.icon + ' mr-1'"></i>
                    {{ type.name }}
                  </button>
                </div>
              </div>
              
              <!-- 难度选择 -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">难度范围</label>
                <div class="flex items-center space-x-4">
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">最低难度</span>
                      <div class="flex">
                        <span v-for="i in 5" :key="`min-${i}`" 
                          @click="minDifficulty = i"
                          class="cursor-pointer text-xl"
                          :class="i <= minDifficulty ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'"
                        >★</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">最高难度</span>
                      <div class="flex">
                        <span v-for="i in 5" :key="`max-${i}`" 
                          @click="maxDifficulty = i"
                          class="cursor-pointer text-xl"
                          :class="i <= maxDifficulty ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'"
                        >★</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 知识点选择 -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">知识点选择</label>
                <div class="grid grid-cols-2 gap-4">
                  <div 
                    v-for="category in knowledgeCategories" 
                    :key="category.id"
                    class="border rounded-lg p-4 transition-all backdrop-filter backdrop-blur-lg"
                    :class="selectedCategories.includes(category.id) ? 
                      'border-blue-300 dark:border-blue-600 bg-blue-50/80 dark:bg-blue-900/30' : 
                      'border-gray-200 dark:border-gray-600'"
                  >
                    <div class="flex justify-between items-center mb-3">
                      <h3 class="font-medium text-gray-800 dark:text-gray-200">{{ category.name }}</h3>
                      <button
                        @click="toggleCategory(category.id)"
                        class="px-3 py-1 rounded-full text-xs font-medium backdrop-filter backdrop-blur-lg"
                        :class="selectedCategories.includes(category.id) ? 
                          'bg-blue-500 text-white hover:bg-blue-600' : 
                          'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
                      >
                        {{ selectedCategories.includes(category.id) ? '已选择' : '选择' }}
                      </button>
                    </div>
                    
                    <!-- 子知识点 -->
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="point in category.points" 
                        :key="point.id"
                        @click="toggleKnowledgePoint(point.id)"
                        class="px-2 py-1 text-xs rounded-md transition-colors backdrop-filter backdrop-blur-lg"
                        :class="[
                          selectedCategories.includes(category.id) ? '' : 'opacity-50 cursor-not-allowed',
                          selectedPoints.includes(point.id) ? 
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-700' : 
                            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                        ]"
                        :disabled="!selectedCategories.includes(category.id)"
                      >
                        {{ point.name }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 题目数量滑块 -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  题目数量: {{ questionCount }}
                </label>
                <input 
                  type="range" 
                  v-model="questionCount" 
                  min="5" 
                  max="30" 
                  step="5"
                  class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                  <span>25</span>
                  <span>30</span>
                </div>
              </div>
              
              <!-- 时间限制设置 -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  时间限制
                </label>
                <div class="flex items-center space-x-4">
                  <select 
                    v-model="timeLimit"
                    class="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="0">不限时</option>
                    <option value="600">10分钟</option>
                    <option value="1200">20分钟</option>
                    <option value="1800">30分钟</option>
                    <option value="2700">45分钟</option>
                    <option value="3600">60分钟</option>
                  </select>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ timeLimit == 0 ? '不限时' : `${Math.floor(timeLimit/60)}分钟` }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 底部操作栏 -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <div class="flex items-center">
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="saveHistory" class="sr-only peer">
                  <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                  <span class="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">保存答题记录</span>
                </label>
              </div>
              <div class="flex space-x-3">
                <button class="px-4 py-2 bg-gray-100 dark:bg-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors backdrop-filter backdrop-blur-lg">
                  重置
                </button>
                <button 
                  @click="startQuiz"
                  class="px-6 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-md backdrop-filter backdrop-blur-lg"
                  :disabled="!isConfigValid"
                  :class="{'opacity-50 cursor-not-allowed': !isConfigValid}"
                >
                  <i class="fas fa-play mr-1"></i> 开始答题
                </button>
              </div>
            </div>
          </div>
          
          <!-- 答题区域 - 当开始答题后显示 -->
          <div v-else class="quiz-content bg-white dark:bg-gray-800 rounded-xl shadow-md backdrop-filter backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 border border-gray-200 dark:border-gray-700">
            <div class="p-6">
              <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">题目区域</h2>
              <p class="text-gray-600 dark:text-gray-400">这里将展示动态生成的题目内容和答题界面</p>
              <button 
                @click="quizStarted = false"
                class="mt-6 px-6 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-md"
              >
                返回配置
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧边栏 -->
      <div class="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-screen overflow-hidden flex flex-col">
        <!-- 右侧边栏标题 -->
        <div class="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
          <h2 class="text-lg font-medium text-gray-800 dark:text-gray-200">题集信息</h2>
        </div>
        
        <!-- 右侧边栏内容区域 -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- 规则卡片 -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm backdrop-filter backdrop-blur-lg border border-gray-200 dark:border-gray-600">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <i class="fas fa-book mr-1"></i> 规则说明
            </h3>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <p>根据您选择的条件，系统将随机生成一套题目。题目将根据难度、知识点进行匹配，确保覆盖您需要练习的内容。</p>
            </div>
          </div>
          
          <!-- 题目信息卡片 -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm backdrop-filter backdrop-blur-lg border border-gray-200 dark:border-gray-600">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <i class="fas fa-list-alt mr-1"></i> 题目信息
            </h3>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex justify-between">
                <span>选择题</span>
                <span>{{ questionTypeCounts.choice }} 题</span>
              </div>
              <div class="flex justify-between">
                <span>判断题</span>
                <span>{{ questionTypeCounts.boolean }} 题</span>
              </div>
              <div class="flex justify-between">
                <span>问答题</span>
                <span>{{ questionTypeCounts.text }} 题</span>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                <div class="flex justify-between font-medium">
                  <span>总题数</span>
                  <span>{{ questionCount }} 题</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 难度分布卡片 -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm backdrop-filter backdrop-blur-lg border border-gray-200 dark:border-gray-600">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <i class="fas fa-chart-bar mr-1"></i> 难度分布
            </h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <div class="text-sm text-gray-600 dark:text-gray-400 w-20">简单</div>
                <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div class="h-full bg-green-500 rounded-full" :style="`width: ${difficultyDistribution.easy}%`"></div>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{{ difficultyDistribution.easy }}%</div>
              </div>
              <div class="flex items-center">
                <div class="text-sm text-gray-600 dark:text-gray-400 w-20">中等</div>
                <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div class="h-full bg-yellow-500 rounded-full" :style="`width: ${difficultyDistribution.medium}%`"></div>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{{ difficultyDistribution.medium }}%</div>
              </div>
              <div class="flex items-center">
                <div class="text-sm text-gray-600 dark:text-gray-400 w-20">困难</div>
                <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div class="h-full bg-red-500 rounded-full" :style="`width: ${difficultyDistribution.hard}%`"></div>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{{ difficultyDistribution.hard }}%</div>
              </div>
            </div>
          </div>
          
          <!-- 历史记录卡片 -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm backdrop-filter backdrop-blur-lg border border-gray-200 dark:border-gray-600">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <i class="fas fa-history mr-1"></i> 历史记录
            </h3>
            <div class="space-y-3">
              <div v-if="quizHistory.length === 0" class="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                暂无答题记录
              </div>
              <div 
                v-for="(record, index) in quizHistory.slice(0, 3)" 
                :key="index"
                class="p-3 rounded-lg bg-white dark:bg-gray-600 shadow-sm"
              >
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ record.date }}</span>
                  <span class="text-xs px-2 py-1 rounded-full" :class="getScoreClass(record.score)">{{ record.score }}分</span>
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300 mt-1">{{ record.name }}</div>
              </div>
              <button class="w-full py-2 mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                查看更多历史记录
              </button>
            </div>
          </div>
          
          <!-- 账户信息卡片 -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm backdrop-filter backdrop-blur-lg border border-gray-200 dark:border-gray-600">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-500 dark:text-blue-300">
                <i class="fas fa-user"></i>
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-800 dark:text-gray-200">用户名</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">连续学习 3 天</div>
              </div>
              <div class="ml-auto">
                <button class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  <i class="fas fa-cog"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 用户数据
const quizStarted = ref(false);
const selectedTypes = ref([1, 2]); // 默认选中选择题和判断题
const minDifficulty = ref(1);
const maxDifficulty = ref(5);
const questionCount = ref(10);
const selectedCategories = ref([]);
const selectedPoints = ref([]);
const timeLimit = ref(1800); // 默认30分钟
const saveHistory = ref(true);

// 日期显示
const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// 题目类型数据
const questionTypes = [
  { id: 1, name: '选择题', icon: 'fas fa-list-ul' },
  { id: 2, name: '判断题', icon: 'fas fa-check-circle' },
  { id: 3, name: '问答题', icon: 'fas fa-pencil-alt' },
  { id: 4, name: '编程题', icon: 'fas fa-code' }
];

// 知识分类数据
const knowledgeCategories = [
  { 
    id: 1, 
    name: 'Java基础', 
    points: [
      { id: 101, name: '语法基础' },
      { id: 102, name: '面向对象' },
      { id: 103, name: '集合' },
      { id: 104, name: '异常处理' },
      { id: 105, name: 'IO/NIO' }
    ]
  },
  { 
    id: 2, 
    name: 'Java高级', 
    points: [
      { id: 201, name: '并发编程' },
      { id: 202, name: 'JVM' },
      { id: 203, name: '反射' },
      { id: 204, name: '泛型' },
      { id: 205, name: 'Lambda表达式' }
    ]
  },
  { 
    id: 3, 
    name: '框架', 
    points: [
      { id: 301, name: 'Spring' },
      { id: 302, name: 'SpringBoot' },
      { id: 303, name: 'MyBatis' },
      { id: 304, name: 'SpringCloud' },
      { id: 305, name: 'Hibernate' }
    ]
  },
  { 
    id: 4, 
    name: '数据库', 
    points: [
      { id: 401, name: 'MySQL' },
      { id: 402, name: 'Redis' },
      { id: 403, name: 'MongoDB' },
      { id: 404, name: 'SQL优化' }
    ]
  }
];

// 历史记录数据
const quizHistory = ref([
  { date: '2023-05-15', score: 85, name: 'Java基础知识测试' },
  { date: '2023-05-10', score: 72, name: 'Spring框架实战题' },
  { date: '2023-05-05', score: 90, name: '数据结构与算法' }
]);

// 计算题目类型分布
const questionTypeCounts = computed(() => {
  const total = questionCount.value;
  
  // 根据选择的题型计算分布
  if (selectedTypes.value.length === 0) {
    return { choice: 0, boolean: 0, text: 0 };
  }
  
  const perType = Math.floor(total / selectedTypes.value.length);
  const remainder = total % selectedTypes.value.length;
  
  const result = { choice: 0, boolean: 0, text: 0 };
  
  if (selectedTypes.value.includes(1)) result.choice = perType;
  if (selectedTypes.value.includes(2)) result.boolean = perType;
  if (selectedTypes.value.includes(3)) result.text = perType;
  
  // 将余数分配到第一个选中的类型
  if (remainder > 0 && selectedTypes.value.includes(1)) {
    result.choice += remainder;
  } else if (remainder > 0 && selectedTypes.value.includes(2)) {
    result.boolean += remainder;
  } else if (remainder > 0 && selectedTypes.value.includes(3)) {
    result.text += remainder;
  }
  
  return result;
});

// 计算难度分布
const difficultyDistribution = computed(() => {
  if (minDifficulty.value > maxDifficulty.value) {
    return { easy: 0, medium: 0, hard: 0 };
  }
  
  const range = maxDifficulty.value - minDifficulty.value + 1;
  
  // 简单：难度1-2，中等：难度3，困难：难度4-5
  let easy = 0, medium = 0, hard = 0;
  
  for (let i = minDifficulty.value; i <= maxDifficulty.value; i++) {
    if (i <= 2) easy++;
    else if (i === 3) medium++;
    else hard++;
  }
  
  return {
    easy: Math.round((easy / range) * 100),
    medium: Math.round((medium / range) * 100),
    hard: Math.round((hard / range) * 100)
  };
});

// 配置是否有效
const isConfigValid = computed(() => {
  return selectedTypes.value.length > 0 && 
         selectedCategories.value.length > 0 && 
         selectedPoints.value.length > 0 && 
         minDifficulty.value <= maxDifficulty.value;
});

// 方法
function toggleSelectedType(typeId) {
  const index = selectedTypes.value.indexOf(typeId);
  if (index === -1) {
    selectedTypes.value.push(typeId);
  } else {
    selectedTypes.value.splice(index, 1);
  }
}

function toggleCategory(categoryId) {
  const index = selectedCategories.value.indexOf(categoryId);
  if (index === -1) {
    selectedCategories.value.push(categoryId);
  } else {
    selectedCategories.value.splice(index, 1);
    
    // 移除该分类下已选择的知识点
    const categoryPoints = knowledgeCategories.find(c => c.id === categoryId)?.points || [];
    const pointIds = categoryPoints.map(p => p.id);
    selectedPoints.value = selectedPoints.value.filter(id => !pointIds.includes(id));
  }
}

function toggleKnowledgePoint(pointId) {
  if (!selectedCategories.value.some(catId => {
    const category = knowledgeCategories.find(c => c.id === catId);
    return category?.points.some(p => p.id === pointId);
  })) {
    return; // 如果该知识点所属的分类未被选中，则不执行任何操作
  }
  
  const index = selectedPoints.value.indexOf(pointId);
  if (index === -1) {
    selectedPoints.value.push(pointId);
  } else {
    selectedPoints.value.splice(index, 1);
  }
}

function startQuiz() {
  if (!isConfigValid.value) return;
  quizStarted.value = true;
}

function getScoreClass(score) {
  if (score >= 90) {
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
  } else if (score >= 70) {
    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
  } else if (score >= 60) {
    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
  } else {
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
  }
}
</script>

<style scoped>
/* 毛玻璃效果 */
.backdrop-filter {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.7);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background-color: rgba(75, 85, 99, 0.7);
}

/* 确保渐变过渡效果顺滑 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* 自定义输入范围样式 */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 5px;
  background: #e5e7eb;
}

.dark input[type="range"] {
  background: #4b5563;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark input[type="range"]::-webkit-slider-thumb {
  border-color: #374151;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* 增加按钮的触感效果 */
button {
  user-select: none;
}

button:active:not(:disabled) {
  transform: translateY(1px);
}
</style> 