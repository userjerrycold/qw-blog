<template>
  <div class="space-y-6">
    <!-- 顶部导航区域 -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">编程面试题库</h1>
      <div class="flex items-center space-x-3">
        <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          <CalendarIcon class="h-4 w-4 mr-1" />
          {{ formattedDate }}
        </div>
        <div class="flex space-x-2">
          <button 
            @click="toggleHistoryPanel"
            class="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-100 dark:hover:bg-blue-800/30 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            历史
          </button>
          <button 
            @click="showWrongQuestionsPanel"
            class="px-2 py-1 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm hover:bg-red-100 dark:hover:bg-red-800/30 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M12 20h.01M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
            </svg>
            错题集
          </button>
          <button 
            @click="showLearningAnalysis"
            class="px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm hover:bg-green-100 dark:hover:bg-green-800/30 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            分析
          </button>
          <button 
            @click="showTrainingPlan"
            class="px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm hover:bg-purple-100 dark:hover:bg-purple-800/30 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            计划
          </button>
        </div>
      </div>
    </div>
    
    <!-- Configuration Panel (shown before quiz starts) -->
    <div v-if="!quizStarted" class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b border-gray-100 dark:border-gray-600">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">题库配置</h2>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- 重新设计的技能分类和深度选择 -->
        <div class="space-y-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300 border-b pb-2">技能树选择</h3>
          
          <!-- 分类卡片列表 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="type in subjectTypes" 
              :key="type.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
              :class="selectedSubjectTypes.includes(type.id) ? 
                'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 
                'border-gray-200 dark:border-gray-600'"
            >
              <!-- 类别标题和选择按钮 -->
              <div class="flex justify-between items-center mb-3">
                <h4 class="font-medium text-gray-800 dark:text-gray-200">{{ type.name }}</h4>
                <button
                  @click="toggleSubjectType(type.id)"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="selectedSubjectTypes.includes(type.id) ? 
                    'bg-blue-500 text-white hover:bg-blue-600' : 
                    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
                >
                  {{ selectedSubjectTypes.includes(type.id) ? '已选择' : '选择' }}
                </button>
              </div>
              
              <!-- 该类别下的子主题列表 -->
              <div class="flex flex-wrap gap-2 mt-2">
                <button
                  v-for="topic in subtopics[type.id] || []" 
                  :key="topic.id"
                  @click="toggleSubtopic(topic.id)"
                  class="px-2 py-1 text-xs rounded-md transition-colors"
                  :class="[
                    selectedSubjectTypes.includes(type.id) ? '' : 'opacity-50 cursor-not-allowed',
                    selectedSubtopics.includes(topic.id) ? 
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                  :disabled="!selectedSubjectTypes.includes(type.id)"
                >
                  {{ topic.name }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- 已选择的内容摘要 -->
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mt-3" v-if="selectedSubjectTypes.length > 0 && selectedContentBySubject.length > 0">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">已选择的内容</h4>
            <div class="space-y-2">
              <div v-for="(group, index) in selectedContentBySubject" :key="`group-${index}`" class="space-y-1">
                <div class="text-sm text-blue-700 dark:text-blue-400 font-medium">
                  {{ group.subject }}：<span class="font-normal text-green-600 dark:text-green-400">{{ group.subtopics.join('、') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Number of Questions Slider -->
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
            class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
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
        
        <!-- Difficulty Range - Updated to 5 stars -->
        <div class="space-y-2">
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
      </div>
      
      <!-- Start Button -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-600 flex justify-end">
        <button 
          @click="confirmStartQuiz"
          class="px-6 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          :disabled="!isConfigValid"
          :class="{'opacity-50 cursor-not-allowed': !isConfigValid}"
        >
          开始答题
        </button>
      </div>
    </div>
    
    <!-- Quiz Question Card (shown after configuration) -->
    <div v-if="quizStarted" class="bg-white dark:bg-gray-700 rounded-lg shadow-md flex h-[calc(100vh-180px)]">
      <!-- 左侧栏 - 答题状态和已答题列表 -->
      <div class="w-1/4 border-r border-gray-200 dark:border-gray-600 flex flex-col">
        <!-- 统计信息 -->
        <div class="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-600">
          <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">答题统计</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">已答题目：</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ stats.totalAnswered }}/{{ quizQuestions.length }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">答对题数：</span>
              <span class="font-medium text-green-600 dark:text-green-400">{{ stats.correct }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">正确率：</span>
              <span class="font-medium text-blue-600 dark:text-blue-400">{{ correctRate }}%</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">剩余时间：</span>
              <span class="font-medium" :class="remainingTime < 30 ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'">
                {{ formatTime(remainingTime) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 已答题目列表 -->
        <div class="flex-1 overflow-y-auto p-4">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">题目导航</h3>
          
          <div class="grid grid-cols-4 gap-2">
            <button 
              v-for="(question, index) in quizQuestions" 
              :key="index"
              @click="navigateToQuestion(index)"
              class="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all"
              :class="[
                // 当前题目
                currentQuestionIndex === index ? 'ring-2 ring-blue-500' : '',
                // 已答题目 - 正确
                question.type === 'choice' && question.selectedOption === question.correctAnswer || 
                question.type === 'boolean' && question.userAnswer === question.correctAnswer ? 
                  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/40' : 
                // 已答题目 - 错误或问答题  
                (question.type === 'choice' && question.selectedOption !== undefined && question.selectedOption !== question.correctAnswer) || 
                (question.type === 'boolean' && question.userAnswer !== undefined && question.userAnswer !== question.correctAnswer) ? 
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/40' : 
                // 问答题 - 已回答
                question.type === 'text' && question.userAnswer ? 
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40' :
                // 未答题目  
                'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              {{ index + 1 }}
            </button>
          </div>
          
          <div class="flex justify-between text-xs mt-3 text-gray-500 dark:text-gray-400">
            <div class="flex items-center">
              <span class="w-2 h-2 inline-block rounded-full bg-green-500 mr-1"></span>
              <span>正确</span>
            </div>
            <div class="flex items-center">
              <span class="w-2 h-2 inline-block rounded-full bg-red-500 mr-1"></span>
              <span>错误</span>
            </div>
            <div class="flex items-center">
              <span class="w-2 h-2 inline-block rounded-full bg-gray-400 mr-1"></span>
              <span>未答</span>
            </div>
          </div>
          
          <!-- 科目信息 -->
          <div class="mt-6 border-t border-gray-200 dark:border-gray-600 pt-4">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">当前科目</div>
            <div class="px-2 py-1 rounded-md text-xs inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              {{ getSubjectName(currentQuestion.subject) }}-{{ getSubtopicName(currentQuestion.subtopic) }}
            </div>
            
            <!-- 难度 -->
            <div class="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">难度级别</div>
            <div class="flex mt-1">
              <span 
                v-for="i in (currentQuestion.difficultyLevel || 0)" 
                :key="i" 
                class="text-yellow-500"
              >★</span>
              <span 
                v-for="i in (5 - (currentQuestion.difficultyLevel || 0))" 
                :key="`empty-${i}`" 
                class="text-gray-300 dark:text-gray-600"
              >★</span>
            </div>
          </div>
        </div>
        
        <!-- 答题记录按钮 -->
        <div class="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
          <button 
            @click="showAnswerRecords"
            class="w-full py-2 bg-blue-100 dark:bg-blue-900/30 rounded-md text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 flex justify-center items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            答题记录
          </button>
        </div>
      </div>
      
      <!-- 右侧栏 - 题目内容和解析 -->
      <div class="w-3/4 flex flex-col">
        <!-- 题目标题 -->
        <div class="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-600">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
              题目 {{ currentQuestionIndex + 1 }}/{{ quizQuestions.length }}
            </h3>
            <button 
              @click="toggleQuestionComments"
              class="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              评论 ({{ getQuestionCommentsCount(currentQuestion.id) }})
            </button>
          </div>
        </div>
        
        <!-- 题目内容区域 -->
        <div class="flex-1 overflow-y-auto">
          <!-- 问题文本 -->
          <div class="p-6">
            <!-- 题目分类和难度信息 -->
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center">
                <span class="px-2 py-1 rounded-md text-xs inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mr-2">
                  {{ getSubjectName(currentQuestion.subject) }}-{{ getSubtopicName(currentQuestion.subtopic) }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">题型: {{ 
                  currentQuestion.type === 'choice' ? '选择题' : 
                  currentQuestion.type === 'boolean' ? '判断题' : '问答题' 
                }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-xs text-gray-600 dark:text-gray-400 mr-1">难度:</span>
                <span>
                  <span 
                    v-for="i in (currentQuestion.difficultyLevel || 0)" 
                    :key="i" 
                    class="text-yellow-500"
                  >★</span>
                  <span 
                    v-for="i in (5 - (currentQuestion.difficultyLevel || 0))" 
                    :key="`empty-${i}`" 
                    class="text-gray-300 dark:text-gray-600"
                  >★</span>
                </span>
              </div>
            </div>
            
            <p class="text-base font-medium text-gray-800 dark:text-gray-200 mb-6">{{ currentQuestion.question }}</p>
            
            <!-- 选择题 -->
            <div v-if="currentQuestion.type === 'choice'" class="space-y-3">
              <div 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                @click="selectOption(index)"
                class="p-3 rounded-lg border transition-all duration-200"
                :class="[
                  getOptionClass(index),
                  {'cursor-pointer': !timeExpired && !answered && !questionAnswered(currentQuestionIndex), 
                  'cursor-not-allowed': timeExpired || answered || questionAnswered(currentQuestionIndex)}
                ]"
                style="user-select: none;"
              >
                <div class="flex items-center">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center mr-3"
                      :class="getOptionCircleClass(index)">
                    {{ ['A', 'B', 'C', 'D'][index] }}
                  </div>
                  <span :class="{
                    'text-red-600 dark:text-red-400': questionAnswered(currentQuestionIndex) && currentQuestion.selectedOption === index && index !== currentQuestion.correctAnswer,
                    'text-green-600 dark:text-green-400': questionAnswered(currentQuestionIndex) && index === currentQuestion.correctAnswer
                  }">{{ option }}</span>
                </div>
              </div>
              
              <!-- 题目解析按钮 - 只在选择题回答后显示 -->
              <div v-if="questionAnswered(currentQuestionIndex) || timeExpired" class="flex justify-end mt-4">
                <button 
                  @click="openExplanationModal"
                  class="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-md text-sm font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  查看解析
                </button>
              </div>
            </div>
            
            <!-- 判断题 -->
            <div v-else-if="currentQuestion.type === 'boolean'" class="space-y-3">
              <div 
                v-for="(option, index) in [true, false]" 
                :key="index"
                @click="selectBooleanAnswer(option)"
                class="p-3 rounded-lg border transition-all duration-200"
                :class="[
                  getBooleanOptionClass(option),
                  {'cursor-pointer': !timeExpired && !answered && !questionAnswered(currentQuestionIndex), 
                  'cursor-not-allowed': timeExpired || answered || questionAnswered(currentQuestionIndex)}
                ]"
                style="user-select: none;"
              >
                <div class="flex items-center">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center mr-3"
                      :class="getBooleanOptionCircleClass(option)">
                    {{ index === 0 ? '√' : '×' }}
                  </div>
                  <span :class="{
                    'text-red-600 dark:text-red-400': questionAnswered(currentQuestionIndex) && currentQuestion.userAnswer === option && option !== currentQuestion.correctAnswer,
                    'text-green-600 dark:text-green-400': questionAnswered(currentQuestionIndex) && option === currentQuestion.correctAnswer
                  }">{{ index === 0 ? '正确' : '错误' }}</span>
                </div>
              </div>
              
              <!-- 题目解析按钮 - 只在判断题回答后显示 -->
              <div v-if="questionAnswered(currentQuestionIndex) || timeExpired" class="flex justify-end mt-4">
                <button 
                  @click="openExplanationModal"
                  class="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-md text-sm font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  查看解析
                </button>
              </div>
            </div>
            
            <!-- 问答题 -->
            <div v-else-if="currentQuestion.type === 'text'" class="space-y-3">
              <textarea 
                v-model="textAnswer"
                :disabled="timeExpired || answered || questionAnswered(currentQuestionIndex)"
                class="w-full p-3 border rounded-lg min-h-[120px] text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                :class="{
                  'bg-gray-50 dark:bg-gray-800': timeExpired || answered || questionAnswered(currentQuestionIndex)
                }"
                placeholder="请在这里输入您的答案..."
              ></textarea>
              
              <!-- 答题结果提示 -->
              <div v-if="currentQuestion.aiProcessed" class="mt-4 p-4 rounded-lg flex items-center" 
                :class="currentQuestion.isCorrect ? 
                  'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 
                  'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'">
                <div class="flex-shrink-0 mr-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center"
                    :class="currentQuestion.isCorrect ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      :class="currentQuestion.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        :d="currentQuestion.isCorrect ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="font-medium" 
                    :class="currentQuestion.isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'">
                    {{ currentQuestion.isCorrect ? '回答正确' : '回答错误' }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ currentQuestion.aiSummary }}</p>
                </div>
                <div class="flex-shrink-0 ml-3">
                  <button @click="openAiAnalysisModal" 
                    class="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-md text-sm font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    查看AI分析
                  </button>
                </div>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button 
                  @click="submitTextAnswer"
                  class="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  :disabled="textAnswer.trim() === '' || timeExpired || answered || questionAnswered(currentQuestionIndex)"
                  :class="{
                    'opacity-50 cursor-not-allowed': textAnswer.trim() === '' || timeExpired || answered || questionAnswered(currentQuestionIndex)
                  }"
                >
                  提交答案
                </button>
                <button 
                  @click="nextQuestion"
                  class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  :disabled="!questionAnswered(currentQuestionIndex) || !currentQuestion.aiProcessed"
                  :class="{
                    'opacity-50 cursor-not-allowed': !questionAnswered(currentQuestionIndex) || !currentQuestion.aiProcessed
                  }"
                >
                  下一题
                </button>
              </div>
            </div>
          </div>
          
          <!-- 添加底部空白，确保内容不被底部操作栏遮挡 -->
          <div class="h-16"></div>
        </div>
        
        <!-- 底部操作栏 -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 flex justify-between items-center">
          <div class="flex items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ answered || timeExpired ? '已作答' : '请选择答案' }}</span>
          </div>
          
          <div class="flex space-x-3">
            <!-- 跳过题目 -->
            <button 
              v-if="!isLastQuestion"
              @click="skipQuestion" 
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              跳过此题
            </button>
            
            <!-- 下一题/查看结果按钮 -->
            <button 
              @click="nextQuestion" 
              class="px-6 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              :class="{'opacity-70 cursor-not-allowed': isLastQuestion && !allQuestionsAnswered}"
              :disabled="isLastQuestion && !allQuestionsAnswered"
            >
              <span v-if="isLastQuestion && !allQuestionsAnswered">
                还有{{ remainingQuestionsCount }}题未作答
              </span>
              <span v-else>
                {{ isLastQuestion ? '查看结果' : '下一题' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quiz Stats (shown after quiz starts) - fixed at bottom of screen -->
    <div v-if="quizStarted" class="flex justify-between bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 mt-2 hidden">
      <div class="text-center px-4">
        <div class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ stats.totalAnswered }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">已答题数</div>
      </div>
      <div class="text-center px-4 border-x border-gray-100 dark:border-gray-600">
        <div class="text-xl font-bold text-green-600">{{ stats.correct }}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">答对题数</div>
      </div>
      <div class="text-center px-4">
        <div class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ correctRate }}%</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">正确率</div>
      </div>
      <div class="text-center px-4">
        <div class="text-xl font-bold text-purple-600 dark:text-purple-400">{{ formatTime(totalQuizTime) }}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">答题用时</div>
      </div>
    </div>
    
    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-0 max-w-lg w-full mx-4 overflow-hidden">
        <!-- 标题栏 -->
        <div class="bg-blue-600 dark:bg-blue-700 p-4 text-white">
          <h3 class="text-xl font-bold">开始答题确认</h3>
          <p class="text-blue-100 text-sm mt-1">请确认以下题目配置</p>
        </div>
        
        <!-- 内容区域 -->
        <div class="p-6">
          <!-- 知识点选择卡片 -->
          <div class="mb-6">
            <div class="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h4 class="font-semibold text-gray-800 dark:text-gray-200">知识点</h4>
            </div>
            
            <div class="rounded-lg border border-blue-100 dark:border-blue-900/50 overflow-hidden">
              <div class="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 border-b border-blue-100 dark:border-blue-900/50">
                <span class="text-sm font-medium text-blue-700 dark:text-blue-400">已选择 {{ selectedContentForConfirmation.length }} 个主题</span>
              </div>
              
              <div class="p-3 bg-white dark:bg-gray-800">
                <div v-for="(group, index) in selectedContentForConfirmation" :key="`confirm-${index}`" 
                  class="mb-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 last:mb-0">
                  <div class="flex flex-wrap items-center">
                    <span class="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium mr-2">
                      {{ group.subject }}
                    </span>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span v-for="(subtopic, idx) in group.subtopics" :key="`subtopic-${idx}`" 
                        class="px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs">
                        {{ subtopic }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 设置参数卡片 -->
          <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            <div class="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">答题设置</span>
            </div>
            
            <div class="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
              <!-- 题目数量 -->
              <div class="p-4">
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">题目数量</div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ questionCount }}</span>
                </div>
              </div>
              
              <!-- 难度范围 -->
              <div class="p-4">
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">难度范围</div>
                <div class="flex items-center">
                  <div class="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md">
                    <div class="flex">
                      <span v-for="i in Math.min(5, minDifficulty)" :key="`dialog-min-${i}`" class="text-yellow-500">★</span>
                    </div>
                    <span class="mx-2 text-gray-500 dark:text-gray-400">至</span>
                    <div class="flex">
                      <span v-for="i in Math.min(5, maxDifficulty)" :key="`dialog-max-${i}`" class="text-yellow-500">★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 提示信息 -->
          <div class="mb-6 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-md border-l-4 border-blue-500">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-blue-700 dark:text-blue-400">
                系统将从您选择的题目类型和细分中，按照难度范围随机生成题目。祝您答题愉快！
              </p>
            </div>
          </div>
        </div>
        
        <!-- 按钮区域 -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
          <button 
            @click="showConfirmDialog = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
          <button 
            @click="startQuiz"
            class="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            开始答题
          </button>
        </div>
      </div>
    </div>
    
    <!-- Quiz Results as Modal Dialog -->
    <div v-if="quizCompleted" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">答题结果</h3>
        
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="text-3xl font-bold text-blue-600">{{ correctRate }}%</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">正确率</div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="text-3xl font-bold text-green-600">{{ stats.correct }}/{{ quizQuestions.length }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">答对题数</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <button 
              @click="analyzeErrorsWithAI" 
              class="w-full py-3 bg-blue-100 dark:bg-blue-900/30 rounded-md text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 flex items-center justify-center"
              :disabled="isAiAnalyzing"
            >
              <span v-if="isAiAnalyzing" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isAiAnalyzing ? '分析中...' : 'AI分析错题' }}
            </button>
            
            <button 
              @click="resetQuiz" 
              class="w-full py-3 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
            >
              重新配置题目
            </button>
            
            <button 
              @click="quizCompleted = false; showAnswerRecords()" 
              class="w-full py-3 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              查看答题记录
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Analysis Modal -->
    <div v-if="isAiAnalyzing || aiAnalysisResult" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">AI分析结果</h3>
        
        <div class="space-y-6">
          <!-- 加载中状态 -->
          <div v-if="isAiAnalyzing" class="flex flex-col items-center justify-center py-8">
            <svg class="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-600 dark:text-gray-300">AI正在分析您的答题情况，请稍候...</p>
          </div>
          
          <!-- 分析结果 -->
          <div v-else class="text-gray-600 dark:text-gray-300" v-html="aiAnalysisResult"></div>
          
          <div class="space-y-3">
            <button 
              @click="aiAnalysisResult = ''" 
              class="w-full py-3 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史答题记录面板 -->
    <div v-if="showHistoryPanel" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">历史答题记录</h3>
          <div class="flex items-center space-x-2">
            <button 
              @click="resetUserData"
              class="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-md text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/40"
            >
              清空记录
            </button>
            <button 
              @click="toggleHistoryPanel"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="overflow-auto flex-grow">
          <div class="space-y-4">
            <div v-if="quizHistory.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
              暂无历史记录
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="record in quizHistory" 
                :key="record.id" 
                class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                @click="viewHistoryRecord(record)"
              >
                <div class="flex justify-between items-center mb-2">
                  <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ new Date(record.date).toLocaleString() }}
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm px-2 py-1 rounded-full"
                      :class="record.stats.correctRate >= 80 ? 
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        record.stats.correctRate >= 60 ?
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'"
                    >
                      {{ record.stats.correctRate }}%
                    </span>
                    <button 
                      @click.stop="deleteHistoryRecord(record.id)"
                      class="ml-2 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div class="flex justify-between">
                    <span>答题数量:</span>
                    <span>{{ record.stats.total }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>答对题数:</span>
                    <span>{{ record.stats.correct }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>用时:</span>
                    <span>{{ formatTime(record.duration || 0) }}</span>
                  </div>
                </div>
                
                <!-- 显示答题类型标签 -->
                <div class="flex flex-wrap gap-1 mt-2">
                  <span 
                    v-for="(group, idx) in record.selectedSubjects || []" 
                    :key="`tag-${idx}`"
                    class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    {{ group.subject }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 历史记录详情 -->
    <div v-if="selectedHistoryRecord" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">答题详情</h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ selectedHistoryRecord.date ? new Date(selectedHistoryRecord.date).toLocaleString() : '' }}
            </span>
            <button 
              @click="closeHistoryDetail"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 统计信息 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="text-xl font-bold text-blue-600">{{ selectedHistoryRecord.stats?.correctRate || 0 }}%</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">正确率</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="text-xl font-bold text-green-600">{{ selectedHistoryRecord.stats?.correct || 0 }}/{{ selectedHistoryRecord.stats?.total || 0 }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">答对题数</div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatTime(selectedHistoryRecord.duration || 0) }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">答题用时</div>
          </div>
        </div>
        
        <!-- 题目列表 -->
        <div class="overflow-auto flex-grow">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  题目
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  类别
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  你的答案
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  正确答案
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  结果
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  用时
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(question, idx) in selectedHistoryRecord.questions || []" :key="`q-${idx}`" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-normal">
                  <div class="text-sm text-gray-900 dark:text-gray-200">
                    {{ question.question }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    正确答案: {{ question.options[question.correctAnswer] }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ getSubjectName(question.subject) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getSubtopicName(question.subtopic) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-normal text-sm">
                  <div :class="question.selectedOption === question.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    {{ 
                      question.type === 'choice' ? 
                        (question.selectedOption !== undefined ? getOptionLabel(question.selectedOption) + ': ' + question.options[question.selectedOption] : '未作答') : 
                      question.type === 'boolean' ?
                        (question.userAnswer === true ? '正确' : 
                         question.userAnswer === false ? '错误' : '未作答') :
                        (question.userAnswer || '未作答') 
                    }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-normal text-sm text-green-600 dark:text-green-400">
                  {{ 
                    question.type === 'choice' ? 
                      getOptionLabel(question.correctAnswer) + ': ' + question.options[question.correctAnswer] : 
                    question.type === 'boolean' ?
                      (question.correctAnswer ? '正确' : '错误') :
                      '参考答案请查看解析'
                  }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="
                      question.type === 'choice' ? 
                        (question.selectedOption === question.correctAnswer ? 
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400') :
                      question.type === 'boolean' ?
                        (question.userAnswer === question.correctAnswer ? 
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400') :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    "
                  >
                    {{ 
                      question.type === 'choice' ? 
                        (question.selectedOption === question.correctAnswer ? '正确' : '错误') :
                      question.type === 'boolean' ? 
                        (question.userAnswer === question.correctAnswer ? '正确' : '错误') : 
                        '需人工评分'
                    }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  {{ formatTime(question.answerTime || 0) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-4 flex justify-between">
          <button 
            @click="createTrainingFromRecord(selectedHistoryRecord, 'wrong')"
            class="px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700"
          >
            错题训练
          </button>
          <button 
            @click="closeHistoryDetail"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
    
    <!-- 错题集面板 -->
    <div v-if="showWrongQuestionsList" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">错题集</h3>
          <button 
            @click="closeWrongQuestionsPanel"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- 错题分组 -->
        <div class="space-y-4 overflow-auto flex-grow">
          <div v-if="wrongQuestionsBySubject.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            暂无错题记录
          </div>
          <div v-else>
            <div v-for="(group, idx) in wrongQuestionsBySubject" :key="`wq-${idx}`" class="mb-6">
              <div class="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">
                {{ group.subject }}
                <span class="text-sm text-gray-500 dark:text-gray-400">({{ group.total }}题)</span>
              </div>
              
              <div class="space-y-3">
                <div v-for="(subtopic, sidx) in group.subtopics" :key="`wq-st-${sidx}`" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div class="flex justify-between items-center mb-2">
                    <div class="text-md font-medium text-green-700 dark:text-green-400">
                      {{ subtopic.name }}
                      <span class="text-sm text-gray-500 dark:text-gray-400">({{ subtopic.questions.length }}题)</span>
                    </div>
                    <button
                      @click="createTrainingFromQuestions(subtopic.questions)"
                      class="px-3 py-1 bg-blue-600 rounded-md text-xs font-medium text-white hover:bg-blue-700"
                    >
                      专项训练
                    </button>
                  </div>
                  
                  <div class="space-y-2">
                    <div v-for="(question, qidx) in subtopic.questions.slice(0, 3)" :key="`wq-q-${qidx}`" class="text-sm text-gray-700 dark:text-gray-300">
                      &bull; {{ question.question.substring(0, 50) }}...
                    </div>
                    <div v-if="subtopic.questions.length > 3" class="text-xs text-gray-500 dark:text-gray-400">
                      以及其他 {{ subtopic.questions.length - 3 }} 题...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end space-x-3">
          <button 
            @click="startWrongQuestionTraining"
            class="px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700"
            :disabled="!hasWrongQuestions"
            :class="{'opacity-50 cursor-not-allowed': !hasWrongQuestions}"
          >
            开始错题训练
          </button>
          <button 
            @click="closeWrongQuestionsPanel"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 评论面板 -->
    <div v-if="showComments" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">题目讨论</h3>
          <button 
            @click="showComments = false"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- 已有评论列表 -->
        <div class="overflow-auto flex-grow mb-4">
          <div v-if="!questionComments[currentQuestion.id] || questionComments[currentQuestion.id].length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
            暂无评论，成为第一个发表评论的人吧！
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="comment in questionComments[currentQuestion.id]" 
              :key="comment.id" 
              class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              :class="{'border-l-4 border-green-500': comment.isNote}"
            >
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                  <div class="font-medium text-gray-700 dark:text-gray-300">{{ comment.author }}</div>
                  <div v-if="comment.isNote" class="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                    个人笔记
                  </div>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ new Date(comment.time).toLocaleString() }}
                </div>
              </div>
              
              <div class="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{{ comment.content }}</div>
              
              <div class="flex justify-between items-center mt-3">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="likeComment(comment.id, currentQuestion.id)"
                    class="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    v-if="!comment.isNote"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    {{ comment.likes || 0 }}
                  </button>
                </div>
                <button 
                  @click="deleteComment(comment.id, currentQuestion.id)"
                  class="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 添加评论表单 -->
        <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div class="mb-3">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">发表评论</div>
            <div class="flex space-x-2 mb-2">
              <input 
                v-model="userDisplayName" 
                placeholder="你的昵称" 
                class="flex-1 p-2 border rounded-md dark:bg-gray-600 dark:text-gray-300"
              />
              <div class="flex items-center space-x-2">
                <input type="checkbox" id="isNote" v-model="isNote" class="rounded text-blue-500" />
                <label for="isNote" class="text-sm text-gray-600 dark:text-gray-400">个人笔记</label>
              </div>
            </div>
            <textarea 
              v-model="currentComment" 
              placeholder="分享你的见解或提示..." 
              class="w-full h-20 p-2 border rounded-md dark:bg-gray-600 dark:text-gray-300"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="showComments = false"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              取消
            </button>
            <button 
              @click="submitComment"
              class="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
              :disabled="!currentComment.trim()"
              :class="{'opacity-50 cursor-not-allowed': !currentComment.trim()}"
            >
              {{ isNote ? '保存笔记' : '发表评论' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习分析面板 -->
    <div v-if="showAnalysisPanel" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">学习分析</h3>
          <button 
            @click="showAnalysisPanel = false"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- 学习统计概览 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center">
            <div class="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ totalAnsweredQuestions }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">已答题数</div>
            </div>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-center">
            <div class="bg-green-100 dark:bg-green-900/40 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ totalCorrectRate }}%</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">平均正确率</div>
            </div>
          </div>
          
          <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg flex items-center">
            <div class="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ studyStreakDays }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">连续学习天数</div>
            </div>
          </div>
          <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div class="text-xl font-bold text-purple-600 dark:text-purple-400">{{ formatTime(totalQuizTime) }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">答题用时</div>
          </div>
        </div>
        
        <!-- 学习进度分析图表 -->
        <div class="flex-grow overflow-auto">
          <!-- 主题掌握度分析 -->
          <div class="mb-8">
            <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">知识点掌握程度</h4>
            
            <div class="space-y-4">
              <div v-if="subjectMastery.length === 0" class="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
                暂无学习数据，请完成一些题目后查看
              </div>
              
              <div v-for="(mastery, index) in subjectMastery" :key="`mastery-${index}`" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <div class="font-medium text-gray-700 dark:text-gray-300">{{ mastery.subject }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ mastery.correct }}/{{ mastery.total }} 题 ({{ mastery.percentage }}%)
                  </div>
                </div>
                
                <div class="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full"
                    :style="`width: ${mastery.percentage}%`"
                    :class="[
                      mastery.percentage >= 80 ? 'bg-green-500' : 
                      mastery.percentage >= 60 ? 'bg-blue-500' : 
                      mastery.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    ]"
                  ></div>
                </div>
                
                <!-- 子主题掌握程度 -->
                <div class="mt-3 pl-4 space-y-3">
                  <div v-for="(subtopic, idx) in mastery.subtopics" :key="`st-${index}-${idx}`" class="text-sm">
                    <div class="flex justify-between items-center mb-1">
                      <div class="text-gray-600 dark:text-gray-400">{{ subtopic.name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ subtopic.correct }}/{{ subtopic.total }} 题 ({{ subtopic.percentage }}%)
                      </div>
                    </div>
                    
                    <div class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        class="h-full rounded-full"
                        :style="`width: ${subtopic.percentage}%`"
                        :class="[
                          subtopic.percentage >= 80 ? 'bg-green-500' : 
                          subtopic.percentage >= 60 ? 'bg-blue-500' : 
                          subtopic.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        ]"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 弱项分析 -->
          <div class="mb-8">
            <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">薄弱项分析</h4>
            
            <div class="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
              <div class="font-medium text-gray-700 dark:text-gray-300 mb-3">需要加强的知识点</div>
              
              <div class="space-y-2">
                <div v-for="(weak, index) in weakPoints" :key="`weak-${index}`" class="flex items-center">
                  <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ weak.subject }}: {{ weak.subtopic }} ({{ weak.percentage }}% 正确率)
                  </div>
                </div>
                
                <div v-if="weakPoints.length === 0" class="text-sm text-gray-500 dark:text-gray-400 italic">
                  暂无明显薄弱项，请继续保持学习！
                </div>
              </div>
            </div>
          </div>
          
          <!-- 学习建议 -->
          <div>
            <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">学习建议</h4>
            
            <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
              <p class="text-gray-600 dark:text-gray-400">{{ studyRecommendation }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end">
          <button 
            @click="showAnalysisPanel = false"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 学习计划面板 -->
    <div v-if="showPlanningPanel" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">学习计划</h3>
          <button 
            @click="showPlanningPanel = false"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- 已创建的计划 -->
        <div class="mb-6">
          <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">当前学习计划</h4>
          
          <div v-if="studyPlans.length === 0" class="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
            您还没有创建学习计划
          </div>
          
          <div v-else class="space-y-4 overflow-auto max-h-[30vh]">
            <div v-for="(plan, index) in studyPlans" :key="`plan-${index}`" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <div class="font-medium text-gray-700 dark:text-gray-300">{{ plan.name }}</div>
                <div class="flex items-center space-x-2">
                  <div class="text-sm" :class="plan.completed ? 'text-green-600' : 'text-blue-600'">
                    {{ plan.completed ? '已完成' : `${plan.progress}%` }}
                  </div>
                  <button 
                    @click="startPlan(plan)"
                    class="px-2 py-1 bg-blue-600 rounded-md text-xs font-medium text-white hover:bg-blue-700"
                    :disabled="plan.completed"
                    :class="{'opacity-50 cursor-not-allowed': plan.completed}"
                  >
                    {{ plan.completed ? '已完成' : '开始' }}
                  </button>
                </div>
              </div>
              
              <div class="space-y-2 mb-3">
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ plan.description }}</p>
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ new Date(plan.createdAt).toLocaleDateString() }} - {{ plan.deadline ? new Date(plan.deadline).toLocaleDateString() : '无截止日期' }}
                </div>
              </div>
              
              <div class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-blue-500 rounded-full"
                  :style="`width: ${plan.progress}%`"
                  :class="{'bg-green-500': plan.completed}"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 创建新计划 -->
        <div class="border-t border-gray-200 dark:border-gray-600 pt-4 overflow-auto">
          <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">创建新计划</h4>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">计划名称</label>
              <input 
                v-model="newPlan.name" 
                type="text" 
                placeholder="例如: 掌握Java并发编程"
                class="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">计划描述</label>
              <textarea 
                v-model="newPlan.description" 
                placeholder="描述你的学习目标..."
                class="w-full h-20 p-2 border rounded-md dark:bg-gray-600 dark:text-gray-300"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">目标题目数</label>
                <input 
                  v-model.number="newPlan.targetCount" 
                  type="number" 
                  min="1"
                  class="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-300"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">目标完成日期</label>
                <input 
                  v-model="newPlan.deadline" 
                  type="date"
                  class="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-300"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">选择知识点</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label 
                  v-for="type in subjectTypes" 
                  :key="`plan-${type.id}`" 
                  class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <input 
                    type="checkbox" 
                    v-model="newPlan.selectedSubjects" 
                    :value="type.id"
                    class="rounded text-blue-500"
                  />
                  <span>{{ type.name }}</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button 
              @click="showPlanningPanel = false"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              取消
            </button>
            <button 
              @click="createStudyPlan"
              class="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
              :disabled="!isPlanValid"
              :class="{'opacity-50 cursor-not-allowed': !isPlanValid}"
            >
              创建计划
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 答题记录弹窗 -->
    <div v-if="showAnswerRecordsPanel" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-40" @click="closeAnswerRecords"></div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] z-10 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">本次答题记录</h3>
          <button 
            @click="closeAnswerRecords"
            class="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="!hasAnsweredQuestions || quizQuestions.length === 0" class="flex-grow flex items-center justify-center">
          <div class="text-center py-12 text-gray-500 dark:text-gray-400">
            暂无答题记录，请完成答题后查看
          </div>
        </div>
        
        <template v-else>
          <!-- 统计信息 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ correctRate }}%</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">正确率</div>
            </div>
            <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div class="text-xl font-bold text-green-600 dark:text-green-400">{{ stats.correct }}/{{ quizQuestions.length }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">答对题数</div>
            </div>
            <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div class="text-xl font-bold text-purple-600 dark:text-purple-400">{{ formatTime(totalQuizTime) }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">答题用时</div>
            </div>
          </div>
          
          <!-- 题目记录表 -->
          <div class="flex-grow overflow-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                    序号
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    题目
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    你的选择
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    正确答案
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                    结果
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    用时
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="(question, idx) in quizQuestions" :key="`rec-q-${idx}`" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ idx + 1 }}
                  </td>
                  <td class="px-6 py-4 whitespace-normal text-sm text-gray-700 dark:text-gray-300 max-w-md">
                    <div>
                      <span class="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded-md mb-1">
                        {{ question.type === 'choice' ? '选择题' : question.type === 'boolean' ? '判断题' : '问答题' }}
                      </span>
                      <div>{{ question.question }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-normal text-sm">
                    <div :class="
                      question.type === 'choice' ? 
                        (question.selectedOption === question.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') :
                    question.type === 'boolean' ? 
                      (question.userAnswer === question.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') :
                      'text-gray-700 dark:text-gray-300'
                    ">
                      {{ 
                        question.type === 'choice' ? 
                          (question.selectedOption !== undefined ? getOptionLabel(question.selectedOption) + ': ' + question.options[question.selectedOption] : '未作答') : 
                        question.type === 'boolean' ?
                          (question.userAnswer === true ? '正确' : 
                           question.userAnswer === false ? '错误' : '未作答') :
                          (question.userAnswer || '未作答') 
                      }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-normal text-sm text-green-600 dark:text-green-400">
                    {{ 
                      question.type === 'choice' ? 
                        getOptionLabel(question.correctAnswer) + ': ' + question.options[question.correctAnswer] : 
                      question.type === 'boolean' ?
                        (question.correctAnswer ? '正确' : '错误') :
                        '参考答案请查看解析'
                    }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="
                        question.type === 'choice' ? 
                          (question.selectedOption === question.correctAnswer ? 
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400') :
                        question.type === 'boolean' ?
                          (question.userAnswer === question.correctAnswer ? 
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400') :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      "
                    >
                      {{ 
                        question.type === 'choice' ? 
                          (question.selectedOption === question.correctAnswer ? '正确' : '错误') :
                        question.type === 'boolean' ? 
                          (question.userAnswer === question.correctAnswer ? '正确' : '错误') : 
                          '需人工评分'
                      }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {{ formatTime(question.answerTime || 0) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        
        <div class="mt-4 flex justify-end">
          <button 
            @click="closeAnswerRecords"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 题目解析弹窗 -->
    <div v-if="showExplanationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">题目解析</h3>
          <button 
            @click="showExplanationModal = false"
            class="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="overflow-auto flex-grow">
          <!-- 用户选择与正确答案对比 - 选择题 -->
          <div class="mb-4" v-if="currentQuestion.type === 'choice' && (selectedOption !== null || questionAnswered(currentQuestionIndex))">
            <div class="flex flex-col space-y-2 mb-3">
              <!-- 用户选择 -->
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">您的选择：</span>
                <div class="flex items-center">
                  <span class="w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm font-medium"
                    :class="questionUserOptionCorrect ? 
                      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-400' : 
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-400'"
                  >
                    {{ getOptionLabel(userSelectedOptionIdx) }}
                  </span>
                  <span class="text-gray-700 dark:text-gray-300">
                    {{ currentQuestion.options[userSelectedOptionIdx] || '未作答' }}
                  </span>
                </div>
              </div>
              
              <!-- 正确答案，只有当用户答错或未答时显示 -->
              <div class="flex items-center" v-if="!questionUserOptionCorrect">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">正确答案：</span>
                <div class="flex items-center">
                  <span class="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-400 text-sm font-medium">
                    {{ getOptionLabel(currentQuestion.correctAnswer) }}
                  </span>
                  <span class="text-gray-700 dark:text-gray-300">
                    {{ currentQuestion.options[currentQuestion.correctAnswer] }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 用户选择与正确答案对比 - 判断题 -->
          <div class="mb-4" v-if="currentQuestion.type === 'boolean' && (userBooleanAnswer !== null || questionAnswered(currentQuestionIndex))">
            <div class="flex flex-col space-y-2 mb-3">
              <!-- 用户选择 -->
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">您的选择：</span>
                <div class="flex items-center">
                  <span class="w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm font-medium"
                    :class="currentQuestion.userAnswer === currentQuestion.correctAnswer ? 
                      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-400' : 
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-400'"
                  >
                    {{ currentQuestion.userAnswer === true ? '√' : '×' }}
                  </span>
                  <span class="text-gray-700 dark:text-gray-300">
                    {{ currentQuestion.userAnswer === true ? '正确' : currentQuestion.userAnswer === false ? '错误' : '未作答' }}
                  </span>
                </div>
              </div>
              
              <!-- 正确答案，只有当用户答错或未答时显示 -->
              <div class="flex items-center" v-if="currentQuestion.userAnswer !== currentQuestion.correctAnswer">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">正确答案：</span>
                <div class="flex items-center">
                  <span class="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-400 text-sm font-medium">
                    {{ currentQuestion.correctAnswer === true ? '√' : '×' }}
                  </span>
                  <span class="text-gray-700 dark:text-gray-300">
                    {{ currentQuestion.correctAnswer === true ? '正确' : '错误' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 问答题答案对比 -->
          <div class="mb-4" v-if="currentQuestion.type === 'text' && questionAnswered(currentQuestionIndex)">
            <div class="flex flex-col space-y-4 mb-3">
              <!-- 用户答案 -->
              <div>
                <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">您的回答：</div>
                <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {{ currentQuestion.userAnswer || '未作答' }}
                </div>
              </div>
              
              <!-- 参考答案 -->
              <div>
                <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">参考答案：</div>
                <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-md text-gray-700 dark:text-gray-300 whitespace-pre-wrap border-l-4 border-green-500">
                  {{ currentQuestion.modelAnswer }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 题目解析 -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 class="font-medium text-indigo-700 dark:text-indigo-300">题目解析</h4>
            </div>
            <p class="text-gray-700 dark:text-gray-300 ml-7 text-sm leading-relaxed">{{ currentQuestion.explanation }}</p>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button 
            @click="showExplanationModal = false"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- AI分析详情弹窗 -->
    <div v-if="showAiAnalysisModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">AI 详细分析</h3>
          <button 
            @click="showAiAnalysisModal = false"
            class="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="overflow-auto flex-grow">
          <!-- 当前问题 -->
          <div class="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h4 class="text-gray-700 dark:text-gray-300">题目</h4>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ currentQuestion.question }}</p>
          </div>
          
          <!-- 用户回答 -->
          <div class="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h4 class="text-gray-700 dark:text-gray-300">我的回答</h4>
            <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {{ currentQuestion.userAnswer || '未作答' }}
            </div>
          </div>
          
          <!-- AI分析内容 - 直接显示HTML内容 -->
          <div v-html="currentQuestion.aiHtmlAnalysis" class="analysis-content"></div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button 
            @click="showAiAnalysisModal = false"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { CalendarIcon, EyeIcon } from '@heroicons/vue/24/outline';

// 组件生命周期钩子
onMounted(() => {
  initializeQuizData();
  startStudyStreak();
  
  // 添加计时器
  const timer = setInterval(() => {
    if (quizStarted.value && !quizCompleted.value && !timeExpired.value && !showExplanation.value) {
      if (remainingTime.value > 0) {
        remainingTime.value--;
      } else {
        timeExpired.value = true;
        showExplanation.value = true;
      }
    }
  }, 1000);
  
  // 在组件销毁时清除计时器
  onBeforeUnmount(() => {
    clearInterval(timer);
  });
});

function initializeQuizData() {
  // 在真实应用中，这些数据可能来自API，这里我们模拟一些基本数据
  allQuestions.value = [
    {
      id: 1,
      type: 'choice', // 选择题
      question: 'Java中，以下哪个不是基本数据类型?',
      options: ['int', 'char', 'String', 'boolean'],
      correctAnswer: 2,
      explanation: 'String是引用类型，其他选项都是基本数据类型。',
      subject: 1,
      subtopic: 101,
      difficultyLevel: 1
    },
    {
      id: 2,
      type: 'choice', // 选择题
      question: '以下哪个接口定义了可变长度的队列?',
      options: ['List', 'Queue', 'Set', 'Map'],
      correctAnswer: 1,
      explanation: 'Queue接口定义了队列的基本操作，如添加、移除和检查元素。',
      subject: 1,
      subtopic: 103,
      difficultyLevel: 2
    },
    {
      id: 3,
      type: 'choice', // 选择题
      question: 'Java中用于处理多线程同步的关键字是?',
      options: ['final', 'static', 'synchronized', 'volatile'],
      correctAnswer: 2,
      explanation: 'synchronized关键字用于提供对共享资源的互斥访问。',
      subject: 2,
      subtopic: 201,
      difficultyLevel: 3
    },
    {
      id: 4,
      type: 'boolean', // 判断题
      question: 'Java中，String类是不可变的（immutable）。',
      correctAnswer: true, // true代表"是"，false代表"否"
      explanation: '在Java中，String类是不可变的，一旦创建，其值就不能被修改。每次对String的操作都会创建一个新的String对象。',
      subject: 1,
      subtopic: 102,
      difficultyLevel: 1
    },
    {
      id: 5,
      type: 'boolean', // 判断题
      question: 'Java中的HashMap是线程安全的。',
      correctAnswer: false,
      explanation: 'HashMap不是线程安全的。如果需要线程安全的实现，应该使用ConcurrentHashMap或Collections.synchronizedMap()。',
      subject: 2,
      subtopic: 201,
      difficultyLevel: 2
    },
    {
      id: 6,
      type: 'text', // 问答题
      question: '简述Java中的垃圾回收机制原理。',
      modelAnswer: '垃圾回收是Java虚拟机自动回收不再使用的内存的过程。基本原理是识别不可达对象（没有引用指向的对象）并释放它们占用的内存。主要算法包括标记-清除、复制、标记-整理和分代收集。Java使用分代垃圾回收，将内存分为年轻代、老年代和永久代/元空间，针对不同代使用不同的回收策略。',
      explanation: 'Java的垃圾回收机制是JVM内存管理的重要部分，通过自动识别和回收不再使用的对象，避免了内存泄漏问题。',
      subject: 2,
      subtopic: 202,
      difficultyLevel: 4
    },
    {
      id: 7,
      type: 'text', // 问答题
      question: '解释什么是Java中的方法重载（Overloading）和方法重写（Overriding），并说明它们的区别。',
      modelAnswer: '方法重载是在同一个类中定义多个名称相同但参数列表不同的方法。参数列表可以是参数数量不同或参数类型不同。方法重写是子类重新实现父类中已有的方法，方法名、返回类型和参数列表必须与父类方法相同。重载是编译时多态，而重写是运行时多态。',
      explanation: '方法重载和重写是面向对象编程中的重要概念，分别用于增强方法的灵活性和实现多态性。',
      subject: 1,
      subtopic: 102,
      difficultyLevel: 3
    }
  ];
  
  // 初始化学习进度统计
  updateMasteryLevels();
}

function startStudyStreak() {
  // 检查最后一次学习日期
  try {
    const lastStudyDate = localStorage.getItem('javaQuizLastStudyDate');
    if (lastStudyDate) {
      const last = new Date(lastStudyDate);
      const today = new Date();
      
      // 判断是否是连续学习
      if (
        today.getFullYear() === last.getFullYear() &&
        today.getMonth() === last.getMonth() &&
        today.getDate() === last.getDate() + 1
      ) {
        // 连续学习天数+1
        const streak = parseInt(localStorage.getItem('javaQuizStudyStreak') || '0');
        studyStreakDays.value = streak + 1;
      } else if (
        today.getFullYear() === last.getFullYear() &&
        today.getMonth() === last.getMonth() &&
        today.getDate() === last.getDate()
      ) {
        // 今天已经学习过，保持当前连续天数
        studyStreakDays.value = parseInt(localStorage.getItem('javaQuizStudyStreak') || '0');
      } else {
        // 不连续，重置为1
        studyStreakDays.value = 1;
      }
    } else {
      // 首次学习
      studyStreakDays.value = 1;
    }
    
    // 更新学习日期和连续天数
    localStorage.setItem('javaQuizLastStudyDate', new Date().toISOString());
    localStorage.setItem('javaQuizStudyStreak', studyStreakDays.value.toString());
    
  } catch (error) {
    console.error('更新学习连续天数失败:', error);
  }
}

function updateMasteryLevels() {
  // 初始化主题熟练度数据
  subjectMastery.value = subjectTypes.map(subject => {
    // 模拟数据，实际应该从历史记录计算
    const total = Math.floor(Math.random() * 50) + 10;
    const correct = Math.floor(Math.random() * total);
    const percentage = Math.round((correct / total) * 100);
    
    return {
      subject: subject.name,
      total,
      correct,
      percentage,
      subtopics: subtopics[subject.id].map(topic => {
        const stTotal = Math.floor(Math.random() * 20) + 5;
        const stCorrect = Math.floor(Math.random() * stTotal);
        const stPercentage = Math.round((stCorrect / stTotal) * 100);
        
        return {
          id: topic.id,
          name: topic.name,
          total: stTotal,
          correct: stCorrect,
          percentage: stPercentage
        };
      })
    };
  });
  
  // 识别弱点
  weakPoints.value = [];
  subjectMastery.value.forEach(subject => {
    subject.subtopics.forEach(subtopic => {
      if (subtopic.percentage < 60) {
        weakPoints.value.push({
          subject: subject.subject,
          subtopic: subtopic.name,
          percentage: subtopic.percentage
        });
      }
    });
  });
  
  // 根据弱点和整体表现生成学习建议
  if (weakPoints.value.length > 0) {
    studyRecommendation.value = `建议您重点关注以下知识点: ${weakPoints.value.map(w => w.subject + '的' + w.subtopic).join('、')}。可以通过错题训练巩固这些内容。`;
  } else {
    studyRecommendation.value = '您目前的学习进展良好，建议尝试更多高难度题目以提升技能。';
  }
}

// 定义问题相关变量
const allQuestions = ref([]);
const quizHistory = ref([]);
const quizStarted = ref(false);
const quizCompleted = ref(false);
const quizQuestions = ref([]);
const currentQuestionIndex = ref(0);
const showConfirmDialog = ref(false);
const showAnswerRecordsPanel = ref(false);
const showWrongQuestionsList = ref(false);
const showHistoryPanel = ref(false);
const showAnalysisPanel = ref(false);
const showComments = ref(false);
const remainingTime = ref(60); // 默认初始时间为1分钟
const answered = ref(false);
const selectedOption = ref(null);
const textAnswer = ref(''); // 问答题的答案
const userBooleanAnswer = ref(null); // 判断题的答案
const showExplanation = ref(false);
const timeExpired = ref(false);
const stats = ref({
  total: 0,
  totalAnswered: 0,
  correct: 0,
  totalTime: 0,
});
const selectedSubjectTypes = ref([]);
const selectedSubtopics = ref([]);
const questionCount = ref(10);
const minDifficulty = ref(1);
const maxDifficulty = ref(5);
const isAiAnalyzing = ref(false);
const aiAnalysisResult = ref('');
const selectedHistoryRecord = ref(null);
const userDisplayName = ref('匿名用户');
const currentComment = ref('');
const isNote = ref(false);
const questionComments = ref({});

// 其他状态变量
const showPlanningPanel = ref(false);
const studyPlans = ref([]);
const newPlan = ref({
  name: '',
  description: '',
  targetCount: 20,
  deadline: '',
  selectedSubjects: []
});

// 基本配置数据
const subjectTypes = [
  { id: 1, name: 'Java基础' },
  { id: 2, name: 'Java高级' },
  { id: 3, name: '框架' },
  { id: 4, name: '数据库' },
  { id: 5, name: '系统设计' },
  { id: 6, name: '算法' }
];

const subtopics = {
  1: [
    { id: 101, name: '语法基础' },
    { id: 102, name: '面向对象' },
    { id: 103, name: '集合' },
    { id: 104, name: '异常处理' },
    { id: 105, name: 'IO/NIO' }
  ],
  2: [
    { id: 201, name: '并发编程' },
    { id: 202, name: 'JVM' },
    { id: 203, name: '反射' },
    { id: 204, name: '泛型' },
    { id: 205, name: 'Lambda表达式' }
  ],
  3: [
    { id: 301, name: 'Spring' },
    { id: 302, name: 'SpringBoot' },
    { id: 303, name: 'MyBatis' },
    { id: 304, name: 'SpringCloud' },
    { id: 305, name: 'Hibernate' }
  ],
  4: [
    { id: 401, name: 'MySQL' },
    { id: 402, name: 'Redis' },
    { id: 403, name: 'MongoDB' },
    { id: 404, name: 'SQL优化' },
    { id: 405, name: '分布式事务' }
  ],
  5: [
    { id: 501, name: '设计模式' },
    { id: 502, name: '分布式系统' },
    { id: 503, name: '微服务' },
    { id: 504, name: '高并发' },
    { id: 505, name: '高可用' }
  ],
  6: [
    { id: 601, name: '数据结构' },
    { id: 602, name: '排序算法' },
    { id: 603, name: '查找算法' },
    { id: 604, name: '动态规划' },
    { id: 605, name: '贪心算法' }
  ]
};

// 工具函数
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// 计算属性
const formattedDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
});

const correctRate = computed(() => {
  if (stats.value.totalAnswered === 0) return 0;
  
  // 计算所有回答过的题目数量（包括选择题、判断题和问答题）
  const totalAnswered = quizQuestions.value.filter(
    q => (q.selectedOption !== undefined) || 
         (q.userAnswer !== undefined)
  ).length;
  
  // 如果没有回答的题目，返回0
  if (totalAnswered === 0) return 0;
  
  // 计算正确率
  return Math.round((stats.value.correct / totalAnswered) * 100);
});

const currentQuestion = computed(() => {
  if (!quizQuestions.value.length) return {};
  return quizQuestions.value[currentQuestionIndex.value] || {};
});

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === quizQuestions.value.length - 1;
});

const isConfigValid = computed(() => {
  return selectedSubjectTypes.value.length > 0 && 
         selectedSubtopics.value.length > 0 && 
         minDifficulty.value <= maxDifficulty.value;
});

// 是否所有问题都已回答
const allQuestionsAnswered = computed(() => {
  return quizQuestions.value.every(q => q.selectedOption !== undefined || q.userAnswer !== undefined);
});

// 未回答的问题数量
const remainingQuestionsCount = computed(() => {
  return quizQuestions.value.filter(q => q.selectedOption === undefined && q.userAnswer === undefined).length;
});

// 用户选择的选项索引
const userSelectedOptionIdx = computed(() => {
  // 优先使用当前问题的已保存答案
  if (quizQuestions.value[currentQuestionIndex.value] && 
      quizQuestions.value[currentQuestionIndex.value].selectedOption !== undefined) {
    return quizQuestions.value[currentQuestionIndex.value].selectedOption;
  }
  // 否则使用当前选择
  return selectedOption.value;
});

// 用户的选择是否正确
const questionUserOptionCorrect = computed(() => {
  const question = currentQuestion.value;
  
  if (!question) return false;
  
  if (question.type === 'choice') {
    if (userSelectedOptionIdx.value === null || userSelectedOptionIdx.value === undefined) {
      return false;
    }
    return userSelectedOptionIdx.value === question.correctAnswer;
  } 
  else if (question.type === 'boolean') {
    if (question.userAnswer === undefined) {
      return false;
    }
    return question.userAnswer === question.correctAnswer;
  }
  
  // 问答题需要人工判断，默认返回false
  return false;
});

// 学习统计分析相关
const subjectMastery = ref([]);
const weakPoints = ref([]);
const totalAnsweredQuestions = computed(() => {
  return quizHistory.value.reduce((total, record) => total + record.stats.total, 0);
});

const totalCorrectRate = computed(() => {
  if (totalAnsweredQuestions.value === 0) return 0;
  const totalCorrect = quizHistory.value.reduce((total, record) => total + record.stats.correct, 0);
  return Math.round((totalCorrect / totalAnsweredQuestions.value) * 100);
});

const studyStreakDays = ref(0);
const studyRecommendation = ref('继续完成更多练习题，以获取个性化学习建议。');

// 选择内容显示
const selectedContentBySubject = computed(() => {
  const result = [];
  for (const typeId of selectedSubjectTypes.value) {
    const subject = subjectTypes.find(t => t.id === typeId);
    if (subject) {
      const subtopicIds = selectedSubtopics.value.filter(id => {
        const idStr = String(id);
        return idStr.startsWith(String(typeId));
      });
      
      const subtopicNames = subtopicIds.map(id => {
        const topic = (subtopics[typeId] || []).find(t => t.id === id);
        return topic ? topic.name : '';
      }).filter(Boolean);
      
      if (subtopicNames.length > 0) {
        result.push({
          subject: subject.name,
          subtopics: subtopicNames
        });
      }
    }
  }
  return result;
});

const selectedContentForConfirmation = computed(() => {
  return selectedContentBySubject.value;
});

// 错题集相关
const wrongQuestionsBySubject = ref([]);
const hasWrongQuestions = computed(() => wrongQuestionsBySubject.value.length > 0);

// 基本方法
function toggleSubjectType(typeId) {
  const idx = selectedSubjectTypes.value.indexOf(typeId);
  if (idx === -1) {
    selectedSubjectTypes.value.push(typeId);
  } else {
    selectedSubjectTypes.value.splice(idx, 1);
    // 移除该类型下已选择的子主题
    selectedSubtopics.value = selectedSubtopics.value.filter(id => {
      const idStr = String(id);
      return !idStr.startsWith(String(typeId));
    });
  }
}

function toggleSubtopic(topicId) {
  const idx = selectedSubtopics.value.indexOf(topicId);
  if (idx === -1) {
    selectedSubtopics.value.push(topicId);
  } else {
    selectedSubtopics.value.splice(idx, 1);
  }
}

// 辅助方法
function getSubjectName(subjectId) {
  const subject = subjectTypes.find(t => t.id === subjectId);
  return subject ? subject.name : '未知主题';
}

function getSubtopicName(subtopicId) {
  for (const typeId in subtopics) {
    const topic = subtopics[typeId].find(t => t.id === subtopicId);
    if (topic) return topic.name;
  }
  return '未知子主题';
}

function confirmStartQuiz() {
  if (!isConfigValid.value) return;
  showConfirmDialog.value = true;
}

function startQuiz() {
  showConfirmDialog.value = false;
  
  // 根据选择筛选题目
  let filteredQuestions = allQuestions.value.filter(q => {
    // 检查主题是否选中
    if (!selectedSubjectTypes.value.includes(q.subject)) return false;
    
    // 检查子主题是否选中
    if (!selectedSubtopics.value.includes(q.subtopic)) return false;
    
    // 检查难度是否在范围内
    if (q.difficultyLevel < minDifficulty.value || q.difficultyLevel > maxDifficulty.value) return false;
    
    return true;
  });
  
  // 如果筛选后没有题目，使用所有题目
  if (filteredQuestions.length === 0) {
    filteredQuestions = allQuestions.value;
    console.warn('根据选择条件未找到题目，使用所有可用题目');
  }
  
  // 对题目进行深拷贝，确保不会修改原始题库
  filteredQuestions = JSON.parse(JSON.stringify(filteredQuestions));
  
  // 随机排序题目
  filteredQuestions = filteredQuestions.sort(() => 0.5 - Math.random());
  
  // 确保不超过可用题目的数量
  const count = Math.min(questionCount.value, filteredQuestions.length);
  quizQuestions.value = filteredQuestions.slice(0, count);
  
  if (quizQuestions.value.length === 0) {
    console.error('没有可用的题目');
    return;
  }
  
  // 重置状态
  currentQuestionIndex.value = 0;
  stats.value = {
    total: quizQuestions.value.length,
    totalAnswered: 0,
    correct: 0,
    totalTime: 0
  };
  answered.value = false;
  selectedOption.value = null;
  userBooleanAnswer.value = null;
  textAnswer.value = '';
  showExplanation.value = false;
  timeExpired.value = false;
  
  // 根据当前题目的难度设置倒计时
  resetTimer();
  
  // 开始答题
  quizStarted.value = true;
  quizCompleted.value = false;
  console.log('开始答题');
}

// 评论相关
function getQuestionCommentsCount(questionId) {
  return (questionComments.value[questionId] || []).length;
}

function toggleQuestionComments() {
  showComments.value = !showComments.value;
}

function submitComment() {
  // 模拟实现
  console.log('提交评论', currentComment.value);
  currentComment.value = '';
}

// 状态类样式辅助方法
function getQuestionStatusClass(index) {
  // 如果当前题目是正在查看的题目
  if (currentQuestionIndex.value === index) {
    return 'ring-2 ring-blue-500 bg-gray-100 dark:bg-gray-700';
  }
  
  // 如果题目已答并且答对
  if (quizQuestions.value[index] && 
      quizQuestions.value[index].selectedOption === quizQuestions.value[index].correctAnswer) {
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
  }
  
  // 如果题目已答但答错
  if (quizQuestions.value[index] && quizQuestions.value[index].selectedOption !== undefined) {
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  }
  
  // 未答题
  return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
}

function getOptionClass(index) {
  // 如果题目未回答或时间未到，则显示正常样式
  if (!answered.value && !timeExpired.value && !questionAnswered(currentQuestionIndex.value)) {
    return 'border-gray-200 dark:border-gray-600';
  }
  
  // 获取当前题目的用户选择
  const userChoice = quizQuestions.value[currentQuestionIndex.value]?.selectedOption;
  const correctAnswer = currentQuestion.value.correctAnswer;
  
  // 如果是正确答案
  if (index === correctAnswer) {
    return 'border-green-500 bg-green-50 dark:bg-green-900/20';
  }
  
  // 如果是用户选择的错误答案
  if (index === userChoice && index !== correctAnswer) {
    return 'border-red-500 bg-red-50 dark:bg-red-900/20';
  }
  
  // 其他选项保持灰色
  return 'border-gray-200 dark:border-gray-600';
}

function getOptionCircleClass(index) {
  // 如果题目未回答或时间未到，则显示正常样式
  if (!answered.value && !timeExpired.value && !questionAnswered(currentQuestionIndex.value)) {
    return 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300';
  }
  
  // 获取当前题目的用户选择
  const userChoice = quizQuestions.value[currentQuestionIndex.value]?.selectedOption;
  const correctAnswer = currentQuestion.value.correctAnswer;
  
  // 如果是正确答案
  if (index === correctAnswer) {
    return 'bg-green-500 text-white';
  }
  
  // 如果是用户选择的错误答案
  if (index === userChoice && index !== correctAnswer) {
    return 'bg-red-500 text-white';
  }
  
  // 其他选项保持灰色
  return 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300';
}

// 从选定题目创建训练
function createTrainingFromQuestions(questions) {
  if (!questions || questions.length === 0) {
    return;
  }
  
  // 随机排序题目
  const shuffledQuestions = [...questions].sort(() => 0.5 - Math.random());
  
  console.log(`训练已创建，包含${shuffledQuestions.length}道题`);
}

// 学习计划相关方法
function showTrainingPlan() {
  showPlanningPanel.value = true;
  loadStudyPlans();
}

function loadStudyPlans() {
  try {
    const storedPlans = localStorage.getItem('javaQuizStudyPlans');
    if (storedPlans) {
      studyPlans.value = JSON.parse(storedPlans);
    }
  } catch (error) {
    console.error('加载学习计划失败:', error);
  }
}

function createStudyPlan() {
  if (!newPlan.value.name || newPlan.value.selectedSubjects.length === 0 || newPlan.value.targetCount < 1) {
    console.error('创建失败: 请填写计划名称、选择知识点并设置目标数量');
    return;
  }
  
  const plan = {
    id: Date.now(),
    name: newPlan.value.name,
    description: newPlan.value.description || '自定义学习计划',
    targetCount: newPlan.value.targetCount,
    deadline: newPlan.value.deadline || null,
    selectedSubjects: newPlan.value.selectedSubjects,
    createdAt: new Date().toISOString(),
    progress: 0,
    completed: false,
    questionsCompleted: 0
  };
  
  studyPlans.value.push(plan);
  
  try {
    localStorage.setItem('javaQuizStudyPlans', JSON.stringify(studyPlans.value));
  } catch (error) {
    console.error('保存学习计划失败:', error);
  }
  
  newPlan.value = {
    name: '',
    description: '',
    targetCount: 20,
    deadline: '',
    selectedSubjects: []
  };
  
  console.log('计划已创建');
}

function startPlan(plan) {
  if (plan.completed) return;
  
  // 创建一个新题目集合，包含计划中指定的主题
  const filteredQuestions = allQuestions.value.filter(q => plan.selectedSubjects.includes(q.subject));
  
  if (filteredQuestions.length === 0) {
    console.error('开始失败: 未找到符合该计划主题的题目');
    return;
  }
  
  // 随机选择题目
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, Math.min(plan.targetCount, shuffled.length));
  
  // 更新计划的进度
  const planIndex = studyPlans.value.findIndex(p => p.id === plan.id);
  if (planIndex !== -1) {
    studyPlans.value[planIndex].questionsCompleted += 1;
    studyPlans.value[planIndex].progress = Math.round((studyPlans.value[planIndex].questionsCompleted / plan.targetCount) * 100);
    
    if (studyPlans.value[planIndex].progress >= 100) {
      studyPlans.value[planIndex].completed = true;
      console.log('计划已完成');
    }
    
    // 保存更新
    try {
      localStorage.setItem('javaQuizStudyPlans', JSON.stringify(studyPlans.value));
    } catch (error) {
      console.error('更新学习计划失败:', error);
    }
  }
  
  // 开始训练
  createTrainingFromQuestions(selectedQuestions);
  
  // 关闭计划面板
  showPlanningPanel.value = false;
}

function deletePlan(planId) {
  studyPlans.value = studyPlans.value.filter(p => p.id !== planId);
  
  try {
    localStorage.setItem('javaQuizStudyPlans', JSON.stringify(studyPlans.value));
  } catch (error) {
    console.error('删除学习计划失败:', error);
  }
  
  console.log('计划已删除');
}

// 错题管理相关方法
function showWrongQuestionsPanel() {
  showWrongQuestionsList.value = true;
  loadWrongQuestions();
}

function closeWrongQuestionsPanel() {
  showWrongQuestionsList.value = false;
}

function loadWrongQuestions() {
  // 模拟从本地存储加载错题
  wrongQuestionsBySubject.value = [];
}

function startWrongQuestionTraining() {
  // 实现从错题集开始训练的逻辑
  closeWrongQuestionsPanel();
  console.log('开始错题训练');
}

// 历史记录相关方法
function toggleHistoryPanel() {
  showHistoryPanel.value = !showHistoryPanel.value;
  if (showHistoryPanel.value) {
    loadQuizHistory();
  }
}

function loadQuizHistory() {
  try {
    const history = localStorage.getItem('javaQuizHistory');
    if (history) {
      quizHistory.value = JSON.parse(history);
    }
  } catch (error) {
    console.error('加载历史记录失败:', error);
  }
}

function viewHistoryRecord(record) {
  selectedHistoryRecord.value = record;
}

function closeHistoryDetail() {
  selectedHistoryRecord.value = null;
}

function deleteHistoryRecord(recordId) {
  quizHistory.value = quizHistory.value.filter(r => r.id !== recordId);
  
  try {
    localStorage.setItem('javaQuizHistory', JSON.stringify(quizHistory.value.slice(0, 50))); // 只保存最近50条
  } catch (error) {
    console.error('删除历史记录失败:', error);
  }
}

// 从历史记录创建训练
function createTrainingFromRecord(record, type = 'all') {
  if (!record || !record.questions) return;
  
  let questions;
  if (type === 'wrong') {
    // 只训练错题
    questions = record.questions.filter(q => q.selectedOption !== q.correctAnswer);
  } else {
    questions = [...record.questions];
  }
  
  createTrainingFromQuestions(questions);
}

// 答题相关方法
function questionAnswered(index) {
  // 检查指定索引的问题是否已回答
  if (!quizQuestions.value[index]) return false;
  
  const question = quizQuestions.value[index];
  
  // 根据题目类型判断是否已回答
  if (question.type === 'choice') {
    return question.selectedOption !== undefined;
  } else if (question.type === 'boolean' || question.type === 'text') {
    return question.userAnswer !== undefined;
  }
  
  return false;
}

function selectOption(index) {
  // 如果题目已回答或时间已用完，则不做任何操作
  if (answered.value || timeExpired.value || questionAnswered(currentQuestionIndex.value)) return;
  
  answered.value = true;
  selectedOption.value = index;
  
  // 更新当前问题的选择
  if (quizQuestions.value[currentQuestionIndex.value]) {
    quizQuestions.value[currentQuestionIndex.value].selectedOption = index;
    
    // 记录答题时间
    const questionTime = getQuestionTimeByDifficulty(quizQuestions.value[currentQuestionIndex.value].difficultyLevel);
    quizQuestions.value[currentQuestionIndex.value].answerTime = questionTime - remainingTime.value;
  }
  
  // 更新统计信息
  stats.value.totalAnswered++;
  if (index === currentQuestion.value.correctAnswer) {
    stats.value.correct++;
  }
  
  // 显示答案解析
  showExplanation.value = true;
}

// 选择判断题答案
function selectBooleanAnswer(answer) {
  // 如果题目已回答或时间已用完，则不做任何操作
  if (answered.value || timeExpired.value || questionAnswered(currentQuestionIndex.value)) return;
  
  answered.value = true;
  userBooleanAnswer.value = answer;
  
  // 更新当前问题的选择
  if (quizQuestions.value[currentQuestionIndex.value]) {
    quizQuestions.value[currentQuestionIndex.value].userAnswer = answer;
    
    // 记录答题时间
    const questionTime = getQuestionTimeByDifficulty(quizQuestions.value[currentQuestionIndex.value].difficultyLevel);
    quizQuestions.value[currentQuestionIndex.value].answerTime = questionTime - remainingTime.value;
  }
  
  // 更新统计信息
  stats.value.totalAnswered++;
  if (answer === currentQuestion.value.correctAnswer) {
    stats.value.correct++;
  }
  
  // 显示答案解析
  showExplanation.value = true;
}

// 提交问答题答案
function submitTextAnswer() {
  if (!textAnswer.value.trim() || answered.value || timeExpired.value || questionAnswered(currentQuestionIndex.value)) return;
  
  answered.value = true;
  
  // 更新当前问题的答案
  if (quizQuestions.value[currentQuestionIndex.value]) {
    quizQuestions.value[currentQuestionIndex.value].userAnswer = textAnswer.value.trim();
    
    // 调用AI分析函数评估答案
    analyzeTextAnswer(currentQuestionIndex.value);
    
    // 记录答题时间
    const questionTime = getQuestionTimeByDifficulty(quizQuestions.value[currentQuestionIndex.value].difficultyLevel);
    quizQuestions.value[currentQuestionIndex.value].answerTime = questionTime - remainingTime.value;
  }
  
  // 更新统计信息 - 问答题计入已作答
  stats.value.totalAnswered++;
}

// AI分析文本答案的函数
function analyzeTextAnswer(questionIndex) {
  const question = quizQuestions.value[questionIndex];
  const userAnswer = question.userAnswer;
  const modelAnswer = question.modelAnswer;
  
  // 添加加载状态
  question.aiProcessing = true;
  
  // 模拟AI分析过程
  setTimeout(() => {
    // 修复这里: 之前错误地将userAnswer作为第一个参数传递给simulateAIEvaluation
    // 正确的调用方式是传递question对象作为第一个参数
    simulateAIEvaluation(question, userAnswer);
    
    // 在AI评估完成后更新正确答案统计
    if (question.isCorrect) {
      stats.value.correct++;
    }
  }, 800); // 模拟分析延迟
}

// 生成随机问题描述
function generateRandomIssue(question) {
  const issues = [
    "继承与组合的区别",
    "静态方法与实例方法的使用场景",
    "接口与抽象类的选择",
    "线程安全的概念",
    "垃圾回收机制的工作原理",
    "值传递与引用传递",
    "重载与重写的区别",
    "泛型的类型擦除",
    "反射的性能影响",
    "注解的处理机制"
  ];
  return issues[Math.floor(Math.random() * issues.length)];
}

// 生成定义描述
function generateDefinition(question) {
  if (question.includes("垃圾回收")) {
    return "JVM自动识别和清除不再使用的对象，释放内存资源的过程";
  }
  if (question.includes("方法重载")) {
    return "同一个类中定义多个名称相同但参数列表不同的方法";
  }
  if (question.includes("方法重写")) {
    return "子类重新实现父类中已有的方法，使方法有不同的行为";
  }
  return "一种核心Java概念，用于解决特定问题的设计";
}

// 生成应用场景
function generateUseCases(question) {
  if (question.includes("垃圾回收")) {
    return "内存管理、资源释放、防止内存泄漏";
  }
  if (question.includes("方法重载")) {
    return "API设计、构造函数、灵活的方法调用";
  }
  if (question.includes("方法重写")) {
    return "多态实现、行为定制、框架扩展";
  }
  return "系统设计、性能优化、代码复用";
}

// 生成优点
function generateAdvantages(question) {
  if (question.includes("垃圾回收")) {
    return "自动内存管理、减少内存泄漏、简化开发";
  }
  if (question.includes("方法重载")) {
    return "提高代码可读性、接口灵活性、使用方便";
  }
  if (question.includes("方法重写")) {
    return "实现多态、行为定制、代码扩展性";
  }
  return "代码简洁、维护方便、功能强大";
}

// 生成缺点
function generateDisadvantages(question) {
  if (question.includes("垃圾回收")) {
    return "性能开销、不可预测的暂停、无法精确控制";
  }
  if (question.includes("方法重载")) {
    return "可能导致混淆、类型擦除影响、难以跟踪";
  }
  if (question.includes("方法重写")) {
    return "增加耦合度、可能引起父类变更风险、难以理解";
  }
  return "学习曲线较陡、可能过度使用、存在性能隐患";
}

// 生成代码示例
function generateCodeExample(question) {
  if (question.includes("垃圾回收")) {
    return `public class GCDemo {
    public static void main(String[] args) {
        // 创建大量对象使其成为垃圾
        for (int i = 0; i < 100000; i++) {
            new Object();
        }
        
        // 建议JVM进行垃圾回收
        System.gc();
        
        // 使用弱引用示例
        WeakReference<Object> weakRef = 
            new WeakReference<>(new Object());
            
        // 等待回收
        System.out.println("弱引用对象已回收: " 
            + (weakRef.get() == null));
    }
}`;
  }
  if (question.includes("方法重载")) {
    return `public class OverloadingExample {
    // 基本方法
    public void display(int num) {
        System.out.println("显示整数: " + num);
    }
    
    // 重载方法1 - 不同参数类型
    public void display(String text) {
        System.out.println("显示字符串: " + text);
    }
    
    // 重载方法2 - 不同参数数量
    public void display(int num1, int num2) {
        System.out.println("显示两个整数: " + num1 + ", " + num2);
    }
    
    public static void main(String[] args) {
        OverloadingExample example = new OverloadingExample();
        example.display(100);         // 调用第一个方法
        example.display("测试文本");   // 调用第二个方法
        example.display(10, 20);      // 调用第三个方法
    }
}`;
  }
  if (question.includes("方法重写")) {
    return `public class OverridingExample {
    static class Animal {
        public void makeSound() {
            System.out.println("动物发出声音");
        }
    }
    
    static class Dog extends Animal {
        @Override
        public void makeSound() {
            System.out.println("汪汪汪");
        }
    }
    
    static class Cat extends Animal {
        @Override
        public void makeSound() {
            System.out.println("喵喵喵");
        }
    }
    
    public static void main(String[] args) {
        // 多态示例
        Animal myDog = new Dog();
        Animal myCat = new Cat();
        
        myDog.makeSound();  // 输出：汪汪汪
        myCat.makeSound();  // 输出：喵喵喵
    }
}`;
  }
  return `public class Example {
    public static void main(String[] args) {
        System.out.println("这是一个示例代码");
        
        // 创建对象
        MyClass obj = new MyClass();
        
        // 调用方法
        obj.process();
        
        // 输出结果
        System.out.println("处理完成");
    }
    
    static class MyClass {
        public void process() {
            // 实现核心逻辑
            System.out.println("正在处理...");
        }
    }
}`;
}

// 生成图表描述
function generateDiagram(question) {
  return `
💻 由于环境限制，无法展示真实图表，但实际应用中可以包含如下内容：
- 概念的类图结构
- 执行流程图
- 内存分配图
- 状态转换图
- 核心组件关系图
  `;
}

function showAnswer() {
  // 直接显示答案
  showExplanation.value = true;
}

function nextQuestion() {
  // 检查是否已经回答了当前问题（确保问答题在提交后才能点击下一题）
  if (currentQuestion.value.type === 'text' && !questionAnswered(currentQuestionIndex.value)) {
    return;
  }
  
  // 重置状态
  answered.value = false;
  selectedOption.value = null;
  userBooleanAnswer.value = null;
  textAnswer.value = '';
  showExplanation.value = false;
  timeExpired.value = false;
  
  // 进入下一题或显示结果
  if (currentQuestionIndex.value < quizQuestions.value.length - 1) {
    currentQuestionIndex.value++;
    // 根据新题目的难度重置计时器
    resetTimer();
  } else {
    // 检查是否所有题目都已回答
    if (allQuestionsAnswered.value) {
      // 完成所有问题，保存结果
      saveQuizResult();
    } else {
      // 寻找第一个未回答的题目
      const firstUnansweredIndex = quizQuestions.value.findIndex(q => 
        q.selectedOption === undefined && q.userAnswer === undefined
      );
      
      if (firstUnansweredIndex !== -1) {
        currentQuestionIndex.value = firstUnansweredIndex;
        resetTimer();
      }
    }
  }
}

// 跳过当前题目
function skipQuestion() {
  if (currentQuestionIndex.value < quizQuestions.value.length - 1) {
    // 重置状态
    answered.value = false;
    selectedOption.value = null;
    userBooleanAnswer.value = null;
    textAnswer.value = '';
    showExplanation.value = false;
    timeExpired.value = false;
    
    // 进入下一题
    currentQuestionIndex.value++;
    
    // 根据新题目的难度重置计时器
    resetTimer();
  }
}

function saveQuizResult() {
  // 标记测验完成，停止计时
  quizCompleted.value = true;
  timeExpired.value = true;  // 停止计时

  // 计算总用时 - 根据每道题的实际答题时间
  const totalTimeSpent = quizQuestions.value.reduce((total, question) => {
    return total + (question.answerTime || 0);
  }, 0);
  
  // 保存当前测验结果到历史记录
  const result = {
    id: Date.now(),
    date: new Date().toISOString(),
    questions: quizQuestions.value,
    selectedSubjects: selectedContentBySubject.value,
    stats: {
      total: quizQuestions.value.length,
      correct: stats.value.correct,
      totalAnswered: stats.value.totalAnswered,
      correctRate: correctRate.value
    },
    duration: totalTimeSpent
  };
  
  // 保存到历史记录
  quizHistory.value.unshift(result);
  
  // 保存到本地存储
  try {
    localStorage.setItem('javaQuizHistory', JSON.stringify(quizHistory.value.slice(0, 50))); // 只保存最近50条
  } catch (error) {
    console.error('保存测验结果失败:', error);
  }
  
  // 更新错题集
  updateWrongQuestions();
}

function updateWrongQuestions() {
  // 更新错题集
  const wrongQuestions = quizQuestions.value.filter(q => 
    q.selectedOption !== undefined && q.selectedOption !== q.correctAnswer
  );
  
  // 实现错题保存逻辑...
}

// 学习分析相关方法
function showLearningAnalysis() {
  showAnalysisPanel.value = true;
  analyzePerformance();
}

function analyzePerformance() {
  // 分析学习表现
  calculateMasteryLevels();
  identifyWeakPoints();
  generateStudyRecommendation();
}

function calculateMasteryLevels() {
  // 计算掌握程度
  // 实现...
}

function identifyWeakPoints() {
  // 识别弱点
  // 实现...
}

function generateStudyRecommendation() {
  // 生成学习建议
  // 实现...
}

function analyzeErrorsWithAI() {
  isAiAnalyzing.value = true;
  
  // 模拟AI分析过程
  setTimeout(() => {
    aiAnalysisResult.value = `
      <div class="space-y-3">
        <p>分析结果表明，您在以下几个方面需要加强：</p>
        <ol class="list-decimal pl-5">
          <li>Java并发编程：在线程安全和锁机制方面存在理解不足</li>
          <li>Spring框架：对依赖注入和AOP概念理解有误</li>
          <li>MySQL：在索引优化方面需要加强学习</li>
        </ol>
        <p>建议针对性学习相关知识点，并通过重复练习加强记忆。</p>
      </div>
    `;
    isAiAnalyzing.value = false;
  }, 3000);
}

function resetQuiz() {
  // 完全重置所有状态
  quizStarted.value = false;
  quizCompleted.value = false;
  showAnswerRecordsPanel.value = false; // 确保关闭答题记录面板
  currentQuestionIndex.value = 0;
  
  // 清空题目和选择
  quizQuestions.value = [];
  
  // 重置统计信息
  stats.value = {
    total: 0,
    totalAnswered: 0,
    correct: 0,
    totalTime: 0
  };
  
  // 重置问题状态
  answered.value = false;
  selectedOption.value = null;
  userBooleanAnswer.value = null;
  textAnswer.value = '';
  showExplanation.value = false;
  timeExpired.value = false;
  remainingTime.value = 60;
  
  // 清除所有已有答案
  allQuestions.value.forEach(q => {
    if (q.hasOwnProperty('selectedOption')) {
      delete q.selectedOption;
    }
    if (q.hasOwnProperty('userAnswer')) {
      delete q.userAnswer;
    }
  });
}

// 问题导航
function navigateToQuestion(index) {
  if (index >= 0 && index < quizQuestions.value.length) {
    currentQuestionIndex.value = index;
    showAnswerRecordsPanel.value = false;
    
    // 恢复该题的状态
    if (quizQuestions.value[index].selectedOption !== undefined) {
      answered.value = true;
      selectedOption.value = quizQuestions.value[index].selectedOption;
      showExplanation.value = true;
      timeExpired.value = true; // 防止再次选择
    } else {
      answered.value = false;
      selectedOption.value = null;
      showExplanation.value = false;
      timeExpired.value = false;
      // 重置计时器
      resetTimer();
    }
  }
}

// 用户数据重置
function resetUserData() {
  const confirmReset = window.confirm('确定要清空所有历史记录吗？这将无法恢复。');
  if (confirmReset) {
    try {
      localStorage.removeItem('javaQuizHistory');
      localStorage.removeItem('javaQuizWrongQuestions');
      quizHistory.value = [];
      wrongQuestionsBySubject.value = [];
      console.log('用户数据已清空');
    } catch (error) {
      console.error('清空数据失败:', error);
    }
  }
}

// 根据难度级别获取相应的时间
function getQuestionTimeByDifficulty(difficulty) {
  // 1星难度1分钟，依次类推
  const difficultyTime = Math.max(1, Math.min(5, difficulty || 1)) * 60;
  return difficultyTime;
}

// 切换到新题目时重置计时器
function resetTimer() {
  if (currentQuestion.value && currentQuestion.value.difficultyLevel) {
    remainingTime.value = getQuestionTimeByDifficulty(currentQuestion.value.difficultyLevel);
  } else {
    remainingTime.value = 60; // 默认1分钟
  }
  timeExpired.value = false;
}

// 答题记录弹窗
function showAnswerRecords() {
  if (!quizStarted.value || quizQuestions.value.length === 0) {
    console.warn('没有可显示的答题记录');
    return;
  }
  
  showAnswerRecordsPanel.value = true;
}

// 关闭答题记录弹窗
function closeAnswerRecords() {
  showAnswerRecordsPanel.value = false;
}

// 总答题时间
const totalQuizTime = computed(() => {
  // 计算已回答题目的实际耗时总和
  return quizQuestions.value.reduce((total, question) => {
    // 如果题目有记录的答题时间，使用该时间
    if (question.answerTime !== undefined) {
      return total + question.answerTime;
    }
    // 否则使用0（未作答的题目）
    return total;
  }, 0);
});

// 选项标签
const optionLabels = ['A', 'B', 'C', 'D'];

// 获取选项标签
function getOptionLabel(index) {
  return optionLabels[index];
}

// 组件状态变量
const showExplanationModal = ref(false);
const showAiAnalysisModal = ref(false);

// 题目解析弹窗
function openExplanationModal() {
  showExplanationModal.value = true;
}

// 是否有任何题目已经回答
const hasAnsweredQuestions = computed(() => {
  return quizQuestions.value.some(q => 
    q.selectedOption !== undefined || q.userAnswer !== undefined
  );
});

// 判断题选项样式 - 恢复被删除的函数
function getBooleanOptionClass(option) {
  if (!questionAnswered(currentQuestionIndex.value) && !timeExpired.value && !answered.value) {
    // 未答题时，悬停效果
    return 'border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400';
  }
  
  // 已答题，显示正误
  if (currentQuestion.value.userAnswer === option && option === currentQuestion.value.correctAnswer) {
    // 选择正确
    return 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20';
  } else if (currentQuestion.value.userAnswer === option) {
    // 选择错误
    return 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20';
  } else if (option === currentQuestion.value.correctAnswer) {
    // 正确答案（未选）
    return 'border-green-500 dark:border-green-400 border-dashed';
  } else {
    // 其他选项
    return 'border-gray-200 dark:border-gray-600';
  }
}

function getBooleanOptionCircleClass(option) {
  if (!questionAnswered(currentQuestionIndex.value) && !timeExpired.value && !answered.value) {
    // 未答题时
    return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  }
  
  if (currentQuestion.value.userAnswer === option && option === currentQuestion.value.correctAnswer) {
    // 选择正确
    return 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400';
  } else if (currentQuestion.value.userAnswer === option) {
    // 选择错误
    return 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400';
  } else if (option === currentQuestion.value.correctAnswer) {
    // 正确答案（未选）
    return 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400';
  } else {
    // 其他选项
    return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
  }
}

// 打开AI分析详情弹窗
function openAiAnalysisModal() {
  showAiAnalysisModal.value = true;
}

// AI 评估函数
function simulateAIEvaluation(question, userAnswer) {
  // 初始化必要的字段
  question.aiProcessed = true;
  question.aiSummary = "";
  question.aiHtmlAnalysis = "";
  
  // 文本题分析逻辑
  if (question.type === 'text') {
    // 获取模型答案关键词
    const modelAnswer = question.modelAnswer || '';
    const keywords = getKeywords(modelAnswer);
    
    // 评估用户答案 (检查是否为空)
    if (!userAnswer || userAnswer.trim() === '') {
      question.isCorrect = false;
      question.aiSummary = "未提供有效回答";
      question.aiHtmlAnalysis = generateHtmlAnalysis(
        question.question,
        userAnswer,
        modelAnswer,
        "未提供有效回答",
        "请提供一个完整的回答",
        modelAnswer,
        false
      );
      return;
    }
    
    // 长度比较 (用户答案长度至少为模型答案的50%)
    const lengthRatio = userAnswer.length / modelAnswer.length;
    const hasGoodLength = lengthRatio >= 0.5;
    
    // 关键词匹配 (检查用户答案中包含的关键词百分比)
    let matchedKeywords = 0;
    if (keywords.length > 0) {
      keywords.forEach(keyword => {
        if (userAnswer.toLowerCase().includes(keyword.toLowerCase())) {
          matchedKeywords++;
        }
      });
    }
    
    const keywordRatio = keywords.length > 0 ? matchedKeywords / keywords.length : 0;
    const hasKeyKeywords = keywordRatio >= 0.6; // 至少包含60%的关键词
    
    // 确定回答是否正确 (只返回正确或错误，不能有部分正确)
    question.isCorrect = hasGoodLength && hasKeyKeywords;
    
    // 设置AI分析摘要
    if (question.isCorrect) {
      question.aiSummary = "回答包含了关键要点，整体正确";
    } else {
      if (!hasGoodLength) {
        question.aiSummary = "回答过于简短，缺少必要的内容";
      } else if (!hasKeyKeywords) {
        question.aiSummary = "回答缺少一些关键概念或术语";
      } else {
        question.aiSummary = "回答存在一些问题，可查看详细分析";
      }
    }
    
    // 生成详细的HTML分析内容
    const issues = !question.isCorrect ? generateIssuesContent(question, userAnswer, hasGoodLength, hasKeyKeywords, matchedKeywords, keywords) : "回答正确，没有发现问题。";
    const suggestions = generateSuggestionsContent(question, userAnswer, hasGoodLength, hasKeyKeywords);
    question.aiHtmlAnalysis = generateHtmlAnalysis(
      question.question,
      userAnswer,
      modelAnswer,
      issues,
      suggestions,
      modelAnswer,
      question.isCorrect
    );
  } else if (question.type === 'single' || question.type === 'multiple') {
    // 单选和多选题的评估
    question.isCorrect = checkOptionAnswer(question);
    question.aiSummary = question.isCorrect ? "选择了正确答案" : "未选择正确答案";
    
    // 生成多选/单选题的HTML分析
    question.aiHtmlAnalysis = generateOptionHtmlAnalysis(question);
  } else if (question.type === 'boolean') {
    // 判断题的评估
    question.isCorrect = (question.userAnswer === question.answer);
    question.aiSummary = question.isCorrect ? "判断正确" : "判断错误";
    
    // 生成判断题的HTML分析
    question.aiHtmlAnalysis = generateBooleanHtmlAnalysis(question);
  }
}

// 生成HTML格式分析
function generateHtmlAnalysis(question, userAnswer, modelAnswer, issues, suggestions, complete, isCorrect) {
  return `
    <div class="space-y-6">
      <!-- 问题分析部分 -->
      <div class="issue-section">
        <div class="issue-header">
          <div class="section-icon" style="background-color: ${isCorrect ? '#dcfce7' : '#fee2e2'};">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" style="color: ${isCorrect ? '#10b981' : '#ef4444'};" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              ${isCorrect ? 
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />' : 
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'}
            </svg>
          </div>
          <div class="section-title" style="color: ${isCorrect ? '#10b981' : '#ef4444'};">
            ${isCorrect ? '分析结果: 正确' : '存在的问题'}
          </div>
        </div>
        <div class="ml-10">
          ${issues}
        </div>
      </div>
      
      <!-- 优化建议部分 -->
      <div class="issue-section">
        <div class="suggestion-header">
          <div class="section-icon" style="background-color: #fff7ed;">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" style="color: #f59e0b;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="section-title" style="color: #f59e0b;">优化建议</div>
        </div>
        <div class="ml-10">
          ${suggestions}
        </div>
      </div>
      
      <!-- 完整解答部分 -->
      <div>
        <div class="solution-header">
          <div class="section-icon" style="background-color: #dcfce7;">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" style="color: #10b981;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="section-title" style="color: #10b981;">完整解答</div>
        </div>
        <div class="ml-10">
          ${complete}
        </div>
      </div>
    </div>
  `;
}

// 生成选择题的HTML分析
function generateOptionHtmlAnalysis(question) {
  const type = question.type === 'single' ? '单选题' : '多选题';
  const correctOptions = question.type === 'single' 
    ? [question.options[question.answer]]
    : question.answer.map(index => question.options[index]);
  
  const userOptions = question.type === 'single'
    ? [question.options[question.userAnswer]]
    : (question.userAnswer || []).map(index => question.options[index]);
  
  const correctOptionsHtml = correctOptions.map(option => `<li>${option}</li>`).join('');
  const userOptionsHtml = userOptions.map(option => `<li>${option}</li>`).join('');
  
  return `
    <div class="space-y-6">
      <!-- 分析结果 -->
      <div class="issue-section">
        <div class="issue-header">
          <div class="section-icon" style="background-color: ${question.isCorrect ? '#dcfce7' : '#fee2e2'};">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" style="color: ${question.isCorrect ? '#10b981' : '#ef4444'};" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              ${question.isCorrect ? 
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />' : 
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />'}
            </svg>
          </div>
          <div class="section-title" style="color: ${question.isCorrect ? '#10b981' : '#ef4444'};">
            ${question.isCorrect ? '答案正确' : '答案错误'}
          </div>
        </div>
        <div class="ml-10">
          <p>题目类型: ${type}</p>
          <div class="mt-4">
            <h3 class="font-medium">您的选择:</h3>
            <ul class="list-disc pl-5 mt-2">
              ${userOptionsHtml || '<li>未选择任何选项</li>'}
            </ul>
          </div>
        </div>
      </div>
      
      <!-- 正确答案 -->
      <div>
        <div class="solution-header">
          <div class="section-icon" style="background-color: #dcfce7;">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" style="color: #10b981;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="section-title" style="color: #10b981;">正确答案</div>
        </div>
        <div class="ml-10">
          <ul class="list-disc pl-5 mt-2">
            ${correctOptionsHtml}
          </ul>
          ${question.explanation ? `
          <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 class="font-medium mb-2">解析:</h3>
            <p>${question.explanation}</p>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// 生成判断题的HTML分析
function generateBooleanHtmlAnalysis(question) {
  return `
    <div class="space-y-6">
      <!-- 分析结果 -->
      <div class="issue-section">
        <div class="issue-header">
          <div class="section-icon" style="background-color: ${question.isCorrect ? '#dcfce7' : '#fee2e2'};">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" style="color: ${question.isCorrect ? '#10b981' : '#ef4444'};" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              ${question.isCorrect ? 
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />' : 
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />'}
            </svg>
          </div>
          <div class="section-title" style="color: ${question.isCorrect ? '#10b981' : '#ef4444'};">
            ${question.isCorrect ? '判断正确' : '判断错误'}
          </div>
        </div>
        <div class="ml-10">
          <p>题目类型: 判断题</p>
          <div class="mt-4">
            <h3 class="font-medium">您的判断:</h3>
            <p class="mt-2">${question.userAnswer === true ? '正确 (√)' : '错误 (×)'}</p>
          </div>
        </div>
      </div>
      
      <!-- 正确答案 -->
      <div>
        <div class="solution-header">
          <div class="section-icon" style="background-color: #dcfce7;">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" style="color: #10b981;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="section-title" style="color: #10b981;">正确答案</div>
        </div>
        <div class="ml-10">
          <p>${question.answer === true ? '正确 (√)' : '错误 (×)'}</p>
          ${question.explanation ? `
          <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 class="font-medium mb-2">解析:</h3>
            <p>${question.explanation}</p>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// 生成问题内容
function generateIssuesContent(question, userAnswer, hasGoodLength, hasKeyKeywords, matchedKeywords, keywords) {
  let issues = '';
  
  if (!hasGoodLength) {
    issues += '<p>您的回答过于简短，缺少必要的详细信息。</p>';
  }
  
  if (!hasKeyKeywords && keywords.length > 0) {
    issues += `<p>您的回答缺少一些关键概念或术语。</p>
              <ul>`;
    
    // 列出缺少的关键词
    const missingKeywords = keywords.filter(keyword => 
      !userAnswer.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (missingKeywords.length > 0) {
      issues += `<li>缺少的关键术语: ${missingKeywords.join(', ')}</li>`;
    }
    
    issues += `</ul>
              <p>您提及了 ${matchedKeywords} 个关键概念，共 ${keywords.length} 个。</p>`;
  }
  
  if (!hasGoodLength && !hasKeyKeywords) {
    issues += '<p>您的回答可能需要更全面地阐述相关概念。</p>';
  }
  
  return issues || '<p>未发现明显问题，但可能还有优化空间。</p>';
}

// 生成建议内容
function generateSuggestionsContent(question, userAnswer, hasGoodLength, hasKeyKeywords) {
  let suggestions = '';
  
  if (!hasGoodLength) {
    suggestions += `
      <p>尝试更详细地解释相关概念，并提供具体示例来支持您的观点。</p>
    `;
  }
  
  if (!hasKeyKeywords) {
    suggestions += `
      <p>确保您的回答涵盖问题所涉及的所有关键概念和术语。</p>
    `;
  }
  
  if (question.question.toLowerCase().includes('代码') || 
      question.question.toLowerCase().includes('程序') ||
      question.question.toLowerCase().includes('实现')) {
    suggestions += `
      <p>对于编程相关问题，尝试:</p>
      <ul>
        <li>提供清晰、可运行的代码示例</li>
        <li>解释代码的核心逻辑和关键部分</li>
        <li>考虑代码的性能、可维护性和可扩展性</li>
      </ul>
    `;
  }
  
  return suggestions || '<p>您的回答已经很好，继续保持这种水平！</p>';
}

// 获取关键词函数
function getKeywords(modelAnswer) {
  // 对于简单的实现，我们可以将模型答案按空格分割，
  // 然后排除常见的停用词和短词
  if (!modelAnswer) return [];
  
  const stopWords = ['的', '地', '得', '和', '与', '或', '是', '在', '了', '有', '为', '以', '这', '那', '您', '我', '他', '她', '它', '们', '也', '就', '对', '中', '可以', '因为', '所以', '但是', '而且', '如果', '当', '于', '向', '由', '从', '到', '被'];
  
  // 分割文本并移除标点符号
  const words = modelAnswer
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 1) // 排除单字符
    .filter(word => !stopWords.includes(word)) // 排除停用词
    .filter((word, index, self) => self.indexOf(word) === index); // 去重
  
  // 从模型答案中提取关键技术术语
  const techTerms = [];
  const javaTerms = ['Java', 'JVM', 'JDK', 'Spring', 'Maven', 'Gradle', 'Hibernate', 'ArrayList', 'HashMap', 
                      'LinkedList', 'interface', 'class', 'extends', 'implements', 'abstract', 'private', 
                      'protected', 'public', 'static', 'final', 'synchronized', 'volatile', 'transient', 
                      'Thread', 'Runnable', 'Exception', 'try', 'catch', 'finally', 'throw', 'throws',
                      '线程', '异常', '接口', '类', '继承', '实现', '抽象', '私有', '保护', '公共', '静态', 
                      '常量', '同步', '易失', '瞬态', '集合', '映射', '列表', '字符串', '整数', '浮点', 
                      '字节', '布尔'];
  
  javaTerms.forEach(term => {
    if (modelAnswer.toLowerCase().includes(term.toLowerCase())) {
      techTerms.push(term);
    }
  });
  
  // 合并普通关键词和技术术语，优先保留技术术语
  return [...new Set([...techTerms, ...words])].slice(0, 15); // 最多取15个关键词
}

// 选择题答案检查
function checkOptionAnswer(question) {
  if (question.type === 'single') {
    return question.userAnswer === question.answer;
  } else if (question.type === 'multiple') {
    // 对于多选题，用户的选择应该完全匹配正确答案
    if (!question.userAnswer || !question.answer) return false;
    
    // 检查长度是否相同
    if (question.userAnswer.length !== question.answer.length) return false;
    
    // 检查所有选项是否匹配
    const sortedUser = [...question.userAnswer].sort();
    const sortedAnswer = [...question.answer].sort();
    
    for (let i = 0; i < sortedUser.length; i++) {
      if (sortedUser[i] !== sortedAnswer[i]) return false;
    }
    
    return true;
  }
  return false;
}
</script> 

<style scoped>
.quiz-container {
  max-width: 1000px;
  margin: 0 auto;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Adjust table style */
table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;
}

table, th, td {
  border: 1px solid #e2e8f0;
}

.dark table, .dark th, .dark td {
  border-color: #4b5563;
}

th, td {
  padding: 0.5rem;
  text-align: left;
}

th {
  background-color: #f8fafc;
  font-weight: 600;
}

.dark th {
  background-color: #374151;
}

tr:nth-child(even) {
  background-color: #f1f5f9;
}

.dark tr:nth-child(even) {
  background-color: #1f2937;
}

/* Define styles for the HTML analysis content */
:deep(.analysis-content) {
  color: #374151;
}

:deep(.dark .analysis-content) {
  color: #e5e7eb;
}

:deep(.analysis-content h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #111827;
}

:deep(.dark .analysis-content h2) {
  color: #f9fafb;
}

:deep(.analysis-content h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

:deep(.dark .analysis-content h3) {
  color: #f3f4f6;
}

:deep(.analysis-content p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

:deep(.analysis-content ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

:deep(.analysis-content ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

:deep(.analysis-content li) {
  margin-bottom: 0.5rem;
}

:deep(.analysis-content pre) {
  background-color: #f1f5f9;
  border-radius: 0.375rem;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875rem;
}

:deep(.dark .analysis-content pre) {
  background-color: #1e293b;
}

:deep(.analysis-content code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875rem;
  background-color: #f1f5f9;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

:deep(.dark .analysis-content code) {
  background-color: #1e293b;
}

:deep(.analysis-content .issue-section) {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.dark .analysis-content .issue-section) {
  border-color: #374151;
}

:deep(.analysis-content .issue-header) {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #ef4444;
}

:deep(.analysis-content .suggestion-header) {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #f59e0b;
}

:deep(.analysis-content .solution-header) {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #10b981;
}

:deep(.analysis-content .section-icon) {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

:deep(.analysis-content .section-title) {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>