<template>
  <div class="tools-container">
    <div class="content-container">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Git 工具集</h1>
        <n-button @click="router.push('/tools')" size="small">
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          返回工具列表
        </n-button>
      </div>

      <n-tabs type="line" animated>
        <!-- 常用命令 -->
        <n-tab-pane name="commands" tab="常用命令">
          <div class="command-section">
            <!-- 搜索和添加区域 -->
            <div class="flex justify-between items-center mb-6">
              <div class="search-container">
                <input
                  v-model="searchQuery"
                  placeholder="搜索Git命令..."
                  class="search-input"
                  @input="handleSearchInput"
                />
              </div>
              <div class="flex items-center">
                <n-button type="primary" size="small" class="mr-2" @click="searchParams.isFavorite = !searchParams.isFavorite; loadGitCommands()">
                  {{ searchParams.isFavorite ? '显示全部' : '仅显示收藏' }}
                </n-button>
                <n-button type="info" size="small" class="mr-2" @click="loadGitCommands()">
                  <template #icon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4V9H4.582M19.418 9H20V4H15M15 20H20V15M4 15V20H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </template>
                  刷新数据
                </n-button>
                <button class="add-button" @click="addCommand">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 命令统计信息 -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-4 gap-4">
                <div class="stat-item">
                  <div class="stat-title">命令总数</div>
                  <div class="stat-value">{{ statistics.total }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-title">收藏数量</div>
                  <div class="stat-value">{{ statistics.favoriteCount }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-title">组合命令</div>
                  <div class="stat-value">{{ statistics.compositeCount }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-title">请求状态</div>
                  <div class="stat-value">{{ loading ? '加载中' : '已完成' }}</div>
                </div>
              </div>

              <!-- 分类分布 -->
              <div class="mt-4" v-if="statistics.categoryDistribution && statistics.categoryDistribution.length > 0">
                <div class="text-sm font-medium mb-2">分类分布</div>
                <div class="flex flex-wrap gap-2">
                  <div v-for="cat in statistics.categoryDistribution" :key="cat.categoryCode" 
                       class="px-3 py-1 bg-blue-50 rounded-full text-sm flex items-center gap-1">
                    {{ cat.categoryName }}
                    <span class="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{{ cat.count }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Git命令列表 -->
            <div class="mb-6">
              <div v-if="loading" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                <p class="mt-2 text-gray-600">加载中...</p>
              </div>
              <div v-else-if="filteredGitCommands.length === 0" class="text-center py-12 text-gray-400">
                <p>暂无命令，点击右上角"+"按钮创建</p>
              </div>
              <div v-else class="command-grid">
                <div v-for="cmd in filteredGitCommands" :key="cmd.id" class="custom-command-item">
                  <div class="flex justify-between items-center mb-3">
                    <div class="command-title flex items-center">
                      <span>{{ cmd.commandName }}</span>
                      <span v-if="cmd.isComposite" class="ml-2 text-xs py-0.5 px-1.5 bg-blue-100 text-blue-700 rounded">组合</span>
                    </div>
                    <div class="flex gap-2">
                      <button class="icon-button text-yellow-500" @click="toggleFavorite(cmd)">
                        <svg v-if="cmd.isFavorite" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button class="icon-button" @click="editCommand(cmd)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20H17C18.1046 20 19 19.1046 19 18V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M17 3L21 7L12 16H8V12L17 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button class="icon-button" @click="showDeleteConfirm(cmd)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="command-info mb-2 text-xs text-gray-500 flex items-center gap-2">
                    <span class="bg-gray-100 px-2 py-0.5 rounded">{{ getCategoryName(cmd.categoryCode) }}</span>
                    <span>执行次数: {{ cmd.executionCount }}</span>
                  </div>
                  <div v-if="cmd.description" class="command-desc mb-2 text-sm text-gray-600">
                    {{ cmd.description }}
                  </div>
                  <div class="command-steps">
                    <div v-if="!cmd.isComposite" class="command-step">
                      <div class="step-command-box">
                        <div class="command-code">{{ cmd.commandContent }}</div>
                        <button class="copy-button" @click="copyToClipboard(cmd.commandContent, cmd)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 4V16C8 17.1 8.9 18 10 18H18C19.1 18 20 17.1 20 16V7.4L16.6 4H10C8.9 4 8 4.9 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 4V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V9C4 7.9 4.9 7 6 7H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div v-else-if="cmd.subCommands && cmd.subCommands.length > 0">
                      <div v-for="(step, stepIndex) in cmd.subCommands" :key="`${cmd.id}-${stepIndex}`" class="command-step">
                        <div class="step-desc">{{ stepIndex + 1 }}. {{ step.description }}</div>
                        <div class="step-command-box">
                          <div class="command-code">{{ step.subCommandContent }}</div>
                          <button class="copy-button" @click="copyToClipboard(step.subCommandContent, cmd)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 4V16C8 17.1 8.9 18 10 18H18C19.1 18 20 17.1 20 16V7.4L16.6 4H10C8.9 4 8 4.9 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M16 4V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V9C4 7.9 4.9 7 6 7H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 调试信息 -->
            <div class="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto" style="max-height: 300px;">
              <div class="text-sm font-bold mb-2">调试信息</div>
              <div class="text-xs font-mono whitespace-pre">搜索参数: {{ JSON.stringify(searchParams, null, 2) }}</div>
              <div class="text-xs font-mono mt-2">总数: {{ totalCommands }}</div>
              <div class="text-xs font-mono mt-2">命令列表长度: {{ filteredGitCommands.length }}</div>
              <div class="mt-2">
                <n-button size="small" @click="debugMode = !debugMode">
                  {{ debugMode ? '隐藏详细数据' : '显示详细数据' }}
                </n-button>
              </div>
              <div v-if="debugMode" class="mt-2 text-xs font-mono whitespace-pre">
                {{ JSON.stringify(gitCommands, null, 2) }}
              </div>
            </div>

            <!-- 分页 -->
            <div v-if="totalCommands > searchParams.pageSize" class="flex justify-center mt-6">
              <div class="flex items-center space-x-2">
                <button 
                  class="pagination-button" 
                  :disabled="searchParams.page === 1"
                  @click="searchParams.page--; loadGitCommands()"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <span class="text-sm">{{ searchParams.page }} / {{ Math.ceil(totalCommands / searchParams.pageSize) }}</span>
                <button 
                  class="pagination-button" 
                  :disabled="searchParams.page >= Math.ceil(totalCommands / searchParams.pageSize)"
                  @click="searchParams.page++; loadGitCommands()"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 添加/编辑自定义命令的模态框 -->
          <n-modal
            v-model:show="showAddCommandModal"
            preset="card"
            :title="isEditing ? '编辑Git命令' : '添加Git命令'"
            style="width: 600px;"
            :bordered="false"
          >
            <div class="modal-content">
              <div class="form-section">
                <div class="form-item">
                  <label>命令名称 <span class="text-red-500">*</span></label>
                  <input v-model="currentCommand.commandName" placeholder="请输入命令名称" class="form-input" />
                </div>

                <div class="form-item">
                  <label>分类 <span class="text-red-500">*</span></label>
                  <select v-model="currentCommand.categoryCode" class="form-input">
                    <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                  </select>
                </div>

                <div class="form-item">
                  <label>描述</label>
                  <input v-model="currentCommand.description" placeholder="请输入命令描述" class="form-input" />
                </div>

                <div class="form-item">
                  <label>使用场景</label>
                  <input v-model="currentCommand.usageScenario" placeholder="请输入使用场景" class="form-input" />
                </div>

                <div class="form-item">
                  <div class="flex items-center">
                    <input type="checkbox" id="is-favorite" v-model="currentCommand.isFavorite" class="mr-2" />
                    <label for="is-favorite">收藏</label>
                  </div>
                </div>

                <div class="form-item">
                  <div class="flex items-center">
                    <input type="checkbox" id="is-composite" v-model="currentCommand.isComposite" class="mr-2" />
                    <label for="is-composite">组合命令（多个步骤）</label>
                  </div>
                </div>

                <div class="step-container mt-4">
                  <div class="step-header">
                    <h3>{{ currentCommand.isComposite ? `步骤 ${currentStepIndex + 1}` : '命令内容' }}</h3>
                    <div v-if="currentCommand.isComposite" class="step-indicator">
                      {{ currentStepIndex + 1 }} / {{ currentCommand.subCommands.length }}
                    </div>
                  </div>
                  
                  <div class="form-item">
                    <label>{{ currentCommand.isComposite ? '步骤说明' : '命令说明' }} <span class="text-red-500">*</span></label>
                    <input 
                      v-model="currentCommand.subCommands[currentStepIndex].description" 
                      :placeholder="currentCommand.isComposite ? '请输入步骤说明' : '请输入命令说明'"
                      class="form-input" 
                    />
                  </div>
                  
                  <div class="form-item">
                    <label>{{ currentCommand.isComposite ? '步骤命令' : '命令内容' }} <span class="text-red-500">*</span></label>
                    <input 
                      v-model="currentCommand.subCommands[currentStepIndex].subCommandContent" 
                      :placeholder="currentCommand.isComposite ? '请输入步骤命令' : '请输入命令内容'"
                      class="form-input" 
                    />
                  </div>
                </div>

                <div v-if="currentCommand.isComposite" class="step-navigation">
                  <button 
                    class="nav-button" 
                    :disabled="currentStepIndex === 0"
                    @click="currentStepIndex--"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    上一步
                  </button>
                  
                  <button 
                    class="nav-button" 
                    :disabled="currentStepIndex === currentCommand.subCommands.length - 1"
                    @click="currentStepIndex++"
                  >
                    下一步
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div v-if="currentCommand.isComposite" class="step-actions">
                  <button class="action-button add" @click="addStep">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    添加步骤
                  </button>
                  
                  <button 
                    v-if="currentCommand.subCommands.length > 1"
                    class="action-button remove" 
                    @click="removeCurrentStep"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    删除当前步骤
                  </button>
                </div>
              </div>

              <div class="modal-footer">
                <button class="cancel-button" @click="showAddCommandModal = false">取消</button>
                <button class="save-button" @click="saveCommand">保存</button>
              </div>
            </div>
          </n-modal>

          <!-- 删除确认模态框 -->
          <n-modal v-model:show="showDeleteModal" preset="dialog" title="确认删除" content="确定要删除这个命令吗？" positive-text="确定" negative-text="取消" @positive-click="confirmDelete" @negative-click="cancelDelete" />
        </n-tab-pane>

        <!-- 相关文档 -->
        <n-tab-pane name="documentation" tab="相关文档">
          <n-card title="Git 官方文档与学习资源" class="mb-4">
            <div class="docs-links">
              <div v-for="(doc, index) in officialDocs" :key="index" class="doc-item">
                <div class="doc-title">{{ doc.title }}</div>
                <div class="doc-desc">{{ doc.description }}</div>
                <n-button text type="primary" tag="a" :href="doc.url" target="_blank">
                  <template #icon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14 4H20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M20 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </template>
                  访问链接
                </n-button>
              </div>
            </div>
          </n-card>

          <n-card title="常见问题与解决方案" class="mb-4">
            <div class="faq-section">
              <div v-for="(faq, index) in gitFAQs" :key="index" class="faq-item">
                <div class="faq-question">{{ faq.question }}</div>
                <div class="faq-answer">{{ faq.answer }}</div>
                <div class="faq-command" v-if="faq.command">
                  <div class="command-code">{{ faq.command }}</div>
                  <n-button text size="small" @click="copyToClipboard(faq.command)">复制</n-button>
                </div>
              </div>
            </div>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  NCard, NButton, NTabs, NTabPane, NModal, NSpace
} from 'naive-ui'
import {
  searchGitCommands, createGitCommand, updateGitCommand, deleteGitCommand,
  getGitCommandStatistics, toggleGitCommandFavorite, recordGitCommandExecution,
  GitCommand, GitCommandSearchParams, GitCommandCreateParams, GitCommandUpdateParams,
  GitSubCommandCreateParams, GitSubCommandUpdateParams
} from '@/services/api'

// 定义API实际返回类型
interface ApiGitResponse {
  code: number;
  data: {
    code: number;
    data: GitCommand[];
    msg: string;
    page: number;
    size: number;
    total: number;
  };
  msg: string;
}

const router = useRouter()
const message = useMessage()

// 当前用户
const currentUser = ref('qianhu')

// 搜索参数
const searchParams = reactive<GitCommandSearchParams>({
  username: currentUser.value,
  categoryCode: 0,
  keyword: '',
  isFavorite: false,
  isComposite: undefined, // 修改为undefined而不是null
  page: 1,
  pageSize: 10
})

// 命令数据
const gitCommands = ref<GitCommand[]>([])
const totalCommands = ref(0)
const loading = ref(false)
const debugMode = ref(false)
const statistics = ref<{
  total: number,
  favoriteCount: number,
  compositeCount: number,
  categoryDistribution: { categoryCode: number, categoryName: string, count: number }[],
  mostUsedCommands: { id: number, commandName: string, commandContent: string, executionCount: number, isComposite: boolean }[],
  recentlyAddedCommands: { id: number, commandName: string, createDt: string, isComposite: boolean }[]
}>({
  total: 0,
  favoriteCount: 0,
  compositeCount: 0,
  categoryDistribution: [],
  mostUsedCommands: [],
  recentlyAddedCommands: []
})

// 本地存储的自定义命令（作为备用数据）
const customCommands = ref<{
  title: string;
  steps: { description: string; command: string; }[];
}[]>([
  {
    title: '初始化项目并提交',
    steps: [
      {
        description: '初始化Git仓库',
        command: 'git init',
      },
      {
        description: '添加所有文件',
        command: 'git add .',
      },
      {
        description: '提交首次更改',
        command: 'git commit -m "Initial commit"',
      }
    ]
  },
  {
    title: '合并发布分支',
    steps: [
      {
        description: '确保开发分支代码是最新的',
        command: 'git checkout develop && git pull',
      },
      {
        description: '切换到主分支并更新',
        command: 'git checkout main && git pull',
      },
      {
        description: '合并开发分支到主分支',
        command: 'git merge develop',
      },
      {
        description: '推送到远程仓库',
        command: 'git push origin main',
      }
    ]
  }
])

// 搜索功能
const searchQuery = ref('')

function handleSearchInput() {
  searchParams.keyword = searchQuery.value
  loadGitCommands()
}

// 添加/编辑命令相关
const showAddCommandModal = ref(false)
const isEditing = ref(false)
const editingIndex = ref(-1)
const currentStepIndex = ref(0)

// 删除确认
const showDeleteModal = ref(false)
const deleteIndex = ref(-1)

// 命令分类选项
const categoryOptions = [
  { label: '常用命令', value: 1 },
  { label: '分支操作', value: 2 },
  { label: '提交管理', value: 3 },
  { label: '远程仓库', value: 4 },
  { label: '高级操作', value: 5 }
]

// 当前命令
const currentCommand = ref({
  id: 0,
  commandName: '',
  commandContent: '',
  description: '',
  categoryCode: 1,
  usageScenario: '',
  isFavorite: false,
  isComposite: false,
  subCommands: [
    {
      id: 0,
      subCommandContent: '',
      sequenceNumber: 1,
      description: ''
    }
  ]
})

// 调试模式
// const debugMode = ref(false)

// 初始化
onMounted(() => {
  document.title = '薯条-Git工具集'
  
  // 加载Git命令
  loadGitCommands()
  
  // 加载统计数据
  loadGitStatistics()
  
  // 从本地存储加载自定义命令作为备用
  const savedCommands = localStorage.getItem('gitCustomCommands')
  if (savedCommands) {
    try {
      customCommands.value = JSON.parse(savedCommands)
    } catch (e) {
      console.error('Failed to parse saved commands', e)
    }
  }
})

// 加载Git命令列表
async function loadGitCommands() {
  loading.value = true
  try {
    const response = await searchGitCommands(searchParams) as any
    console.log('Git命令查询结果:', response.data)
    if (response.data && response.data.code === 200) {
      // 处理嵌套的数据结构
      if (response.data.data && response.data.data.code === 200) {
        // 将嵌套的data数组作为列表数据
        gitCommands.value = response.data.data.data || []
        // 使用嵌套结构中的total
        totalCommands.value = response.data.data.total || 0
        // 更新页码信息
        searchParams.page = response.data.data.page || 1
        searchParams.pageSize = response.data.data.size || 10
      } else {
        message.error('加载Git命令失败: ' + (response.data.data?.msg || '未知错误'))
        // 使用本地备用数据
        useBackupData()
      }
    } else {
      message.error('加载Git命令失败: ' + (response.data?.msg || '未知错误'))
      // 使用本地备用数据
      useBackupData()
    }
  } catch (error) {
    console.error('加载Git命令出错:', error)
    message.error('加载Git命令出错，使用备用数据')
    // 使用本地备用数据
    useBackupData()
  } finally {
    loading.value = false
  }
}

// 加载Git命令统计数据
async function loadGitStatistics() {
  try {
    const response = await getGitCommandStatistics(currentUser.value)
    if (response.data && response.data.code === 200 && response.data.data) {
      statistics.value = response.data.data
    }
  } catch (error) {
    console.error('加载统计数据出错:', error)
  }
}

// 使用备用数据（当API调用失败时）
function useBackupData() {
  // 将本地存储的自定义命令转换为Git命令格式
  gitCommands.value = customCommands.value.map((cmd, index) => {
    const isComposite = cmd.steps.length > 1
    const commandContent = isComposite 
      ? `组合命令：${cmd.title}` 
      : cmd.steps[0].command
    
    return {
      id: -(index + 1), // 使用负数ID避免与API返回的ID冲突
      commandName: cmd.title,
      commandContent: commandContent,
      description: cmd.title,
      categoryCode: 1, // 默认为常用命令
      categoryName: '常用命令',
      usageScenario: '',
      isFavorite: false,
      isComposite: isComposite,
      subCommands: isComposite ? cmd.steps.map((step, stepIndex) => ({
        id: -(stepIndex + 1),
        subCommandContent: step.command,
        sequenceNumber: stepIndex + 1,
        description: step.description
      })) : [],
      executionCount: 0,
      author: currentUser.value,
      createDt: new Date().toISOString().split('T')[0] + ' 00:00:00',
      updateDt: new Date().toISOString().split('T')[0] + ' 00:00:00'
    }
  })
  
  totalCommands.value = gitCommands.value.length
}

// 过滤后的命令列表
const filteredGitCommands = computed(() => {
  return gitCommands.value
})

// 添加新命令
function addCommand() {
  isEditing.value = false
  currentCommand.value = {
    id: 0,
    commandName: '',
    commandContent: '',
    description: '',
    categoryCode: 1,
    usageScenario: '',
    isFavorite: false,
    isComposite: false,
    subCommands: [
      {
        id: 0,
        subCommandContent: '',
        sequenceNumber: 1,
        description: ''
      }
    ]
  }
  currentStepIndex.value = 0
  showAddCommandModal.value = true
}

// 编辑命令
function editCommand(command: GitCommand) {
  isEditing.value = true
  // 创建一个新对象避免直接修改原始对象
  currentCommand.value = {
    id: command.id,
    commandName: command.commandName,
    commandContent: command.commandContent,
    description: command.description || '',
    categoryCode: command.categoryCode,
    usageScenario: command.usageScenario || '',
    isFavorite: command.isFavorite,
    isComposite: command.isComposite,
    subCommands: command.isComposite && command.subCommands ? 
      command.subCommands.map(sc => ({
        id: sc.id || 0, // 确保id有值，如果为undefined则使用0
        subCommandContent: sc.subCommandContent,
        sequenceNumber: sc.sequenceNumber,
        description: sc.description || ''
      })) : 
      [{
        id: 0,
        subCommandContent: command.commandContent,
        sequenceNumber: 1,
        description: '执行命令'
      }]
  }
  currentStepIndex.value = 0
  showAddCommandModal.value = true
}

// 删除确认
function showDeleteConfirm(command: GitCommand) {
  deleteIndex.value = command.id
  showDeleteModal.value = true
}

// 确认删除
async function confirmDelete() {
  try {
    const response = await deleteGitCommand(deleteIndex.value)
    if (response.data && response.data.code === 200 && response.data.data) {
      message.success('命令已删除')
      loadGitCommands()
      loadGitStatistics()
    } else {
      message.error('删除命令失败: ' + (response.data?.msg || '未知错误'))
    }
  } catch (error) {
    console.error('删除命令出错:', error)
    message.error('删除命令出错')
  }
  showDeleteModal.value = false
}

// 取消删除
function cancelDelete() {
  showDeleteModal.value = false
}

// 添加命令步骤
function addStep() {
  if (!currentCommand.value.isComposite) {
    currentCommand.value.isComposite = true
  }
  
  currentCommand.value.subCommands.push({
    id: 0,
    subCommandContent: '',
    sequenceNumber: currentCommand.value.subCommands.length + 1,
    description: ''
  })
  currentStepIndex.value = currentCommand.value.subCommands.length - 1
}

// 移除当前步骤
function removeCurrentStep() {
  if (currentCommand.value.subCommands.length > 1) {
    currentCommand.value.subCommands.splice(currentStepIndex.value, 1)
    
    // 重新排序
    currentCommand.value.subCommands.forEach((step, index) => {
      step.sequenceNumber = index + 1
    })
    
    if (currentStepIndex.value >= currentCommand.value.subCommands.length) {
      currentStepIndex.value = currentCommand.value.subCommands.length - 1
    }
  } else {
    message.warning('至少需要保留一个步骤')
  }
}

// 保存命令
async function saveCommand() {
  // 验证表单
  if (!currentCommand.value.commandName.trim()) {
    message.warning('请填写命令名称')
    return
  }

  if (currentCommand.value.isComposite) {
    for (const step of currentCommand.value.subCommands) {
      if (!step.description.trim()) {
        message.warning('请填写所有步骤的说明')
        return
      }
      if (!step.subCommandContent.trim()) {
        message.warning('请填写所有步骤的命令')
        return
      }
    }
    
    // 组合命令内容使用第一个子命令的内容（实际内容由后端组合）
    currentCommand.value.commandContent = `组合命令：${currentCommand.value.commandName}`
  } else {
    // 非组合命令，使用第一个子命令内容作为命令内容
    if (!currentCommand.value.subCommands[0].subCommandContent.trim()) {
      message.warning('请填写命令内容')
      return
    }
    currentCommand.value.commandContent = currentCommand.value.subCommands[0].subCommandContent
  }

  try {
    let response
    
    if (isEditing.value) {
      // 更新现有命令
      const updateParams: GitCommandUpdateParams = {
        id: currentCommand.value.id,
        commandName: currentCommand.value.commandName,
        commandContent: currentCommand.value.commandContent,
        description: currentCommand.value.description,
        categoryCode: currentCommand.value.categoryCode,
        usageScenario: currentCommand.value.usageScenario,
        isFavorite: currentCommand.value.isFavorite,
        isComposite: currentCommand.value.isComposite
      }
      
      if (currentCommand.value.isComposite) {
        updateParams.subCommands = currentCommand.value.subCommands.map(step => ({
          id: step.id,
          subCommandContent: step.subCommandContent,
          sequenceNumber: step.sequenceNumber,
          description: step.description
        }))
      }
      
      response = await updateGitCommand(updateParams)
    } else {
      // 添加新命令
      const createParams: GitCommandCreateParams = {
        commandName: currentCommand.value.commandName,
        commandContent: currentCommand.value.commandContent,
        description: currentCommand.value.description,
        categoryCode: currentCommand.value.categoryCode,
        usageScenario: currentCommand.value.usageScenario,
        isFavorite: currentCommand.value.isFavorite,
        isComposite: currentCommand.value.isComposite,
        author: currentUser.value
      }
      
      if (currentCommand.value.isComposite) {
        createParams.subCommands = currentCommand.value.subCommands.map(step => ({
          subCommandContent: step.subCommandContent,
          sequenceNumber: step.sequenceNumber,
          description: step.description
        }))
      }
      
      response = await createGitCommand(createParams)
    }
    
    if (response.data && response.data.code === 200) {
      message.success(isEditing.value ? '命令已更新' : '命令已添加')
      loadGitCommands()
      loadGitStatistics()
      showAddCommandModal.value = false
    } else {
      message.error((isEditing.value ? '更新' : '添加') + '命令失败: ' + (response.data?.msg || '未知错误'))
    }
  } catch (error) {
    console.error((isEditing.value ? '更新' : '添加') + '命令出错:', error)
    message.error((isEditing.value ? '更新' : '添加') + '命令出错')
  }
}

// 切换收藏状态
async function toggleFavorite(command: GitCommand) {
  try {
    const newState = !command.isFavorite
    const response = await toggleGitCommandFavorite(command.id, newState)
    if (response.data && response.data.code === 200 && response.data.data) {
      command.isFavorite = newState
      message.success(newState ? '已添加到收藏' : '已从收藏中移除')
      loadGitStatistics()
    } else {
      message.error('切换收藏状态失败: ' + (response.data?.msg || '未知错误'))
    }
  } catch (error) {
    console.error('切换收藏状态出错:', error)
    message.error('切换收藏状态出错')
  }
}

// 记录命令执行
async function recordExecution(command: GitCommand) {
  try {
    const response = await recordGitCommandExecution(command.id)
    if (response.data && response.data.code === 200 && response.data.data) {
      command.executionCount = response.data.data.executionCount
    }
  } catch (error) {
    console.error('记录命令执行出错:', error)
  }
}

// 复制到剪贴板
function copyToClipboard(text: string, command?: GitCommand) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已复制到剪贴板')
    if (command) {
      recordExecution(command)
    }
  }).catch(() => {
    message.error('复制失败')
  })
}

// 官方文档链接
const officialDocs = [
  {
    title: 'Git 官方文档',
    description: 'Git的完整官方文档，包含所有命令和概念的详细解释',
    url: 'https://git-scm.com/doc'
  },
  {
    title: 'Pro Git 书籍',
    description: '免费电子书，从基础到高级全面介绍Git的使用',
    url: 'https://git-scm.com/book/zh/v2'
  },
  {
    title: 'Git 速查表',
    description: '常用Git命令的快速参考表',
    url: 'https://training.github.com/downloads/zh_CN/github-git-cheat-sheet/'
  },
  {
    title: 'Git 交互式学习',
    description: '通过可视化和交互式练习学习Git分支操作',
    url: 'https://learngitbranching.js.org/?locale=zh_CN'
  },
  {
    title: 'GitHub 文档',
    description: 'GitHub平台使用指南和最佳实践',
    url: 'https://docs.github.com/cn'
  }
]

// Git常见问题
const gitFAQs = [
  {
    question: '如何撤销最后一次提交？',
    answer: '如果想保留修改的文件但撤销提交，可以使用以下命令：',
    command: 'git reset --soft HEAD~1'
  },
  {
    question: '如何恢复已删除的文件？',
    answer: '如果文件已被Git跟踪，可以使用以下命令恢复：',
    command: 'git checkout -- <file>'
  },
  {
    question: '如何查看特定文件的修改历史？',
    answer: '使用以下命令可以查看特定文件的所有修改历史：',
    command: 'git log --follow -p -- <file>'
  },
  {
    question: '如何比较两个分支的差异？',
    answer: '使用以下命令可以查看两个分支之间的差异：',
    command: 'git diff branch1..branch2'
  },
  {
    question: '如何修改最后一次提交的信息？',
    answer: '如果需要修改最后一次提交的信息，可以使用：',
    command: 'git commit --amend'
  }
]

// 根据分类代码获取分类名称
function getCategoryName(code: number): string {
  const category = categoryOptions.find(c => c.value === code)
  return category ? category.label : '未知分类'
}
</script>

<style scoped>
.tools-container {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  background-color: white;
  overflow-y: auto;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
}

.command-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* 搜索框样式 */
.search-container {
  position: relative;
  width: 220px;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 40px 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background-color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #cbd5e1;
  box-shadow: 0 0 0 2px rgba(203, 213, 225, 0.2);
}

/* 添加按钮样式 */
.add-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #334155;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-button:hover {
  background-color: #1e293b;
  transform: scale(1.05);
}

/* 自定义命令组合样式 */
.custom-command-item {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: white;
  transition: all 0.2s ease;
  height: 280px;
  display: flex;
  flex-direction: column;
}

.custom-command-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.command-title {
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
}

.icon-button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-button:hover {
  background-color: #e2e8f0;
  color: #334155;
}

.command-steps {
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  margin-right: -4px;
  padding-right: 4px;
}

.command-steps::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.command-step {
  margin-top: 12px;
}

.step-desc {
  font-weight: 500;
  margin-bottom: 4px;
  color: #334155;
  font-size: 14px;
}

.step-command-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.command-code {
  font-family: monospace;
  background-color: #f8fafc;
  padding: 6px 10px;
  border-radius: 6px;
  margin-right: 8px;
  font-size: 13px;
  white-space: nowrap;
  overflow: auto;
  color: #334155;
  flex-grow: 1;
}

.copy-button {
  min-width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background-color: #e2e8f0;
  color: #334155;
}

/* 统计数据项样式 */
.stat-item {
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.stat-title {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
}

/* 分页按钮样式 */
.pagination-button {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

/* 模态框样式 */
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-item label {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.form-input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #cbd5e1;
  box-shadow: 0 0 0 2px rgba(203, 213, 225, 0.2);
}

.step-container {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.step-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: #334155;
}

.step-indicator {
  font-size: 14px;
  color: #64748b;
  background-color: #e2e8f0;
  border-radius: 12px;
  padding: 2px 10px;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button:not(:disabled):hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.add {
  background-color: #e2e8f0;
  color: #334155;
  border: none;
}

.action-button.add:hover {
  background-color: #cbd5e1;
}

.action-button.remove {
  background-color: #fecaca;
  color: #b91c1c;
  border: none;
}

.action-button.remove:hover {
  background-color: #fca5a5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.save-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #334155;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-button:hover {
  background-color: #1e293b;
}

/* 文档样式 */
.docs-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.doc-item {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
}

.doc-title {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 16px;
  color: #334155;
}

.doc-desc {
  color: #64748b;
  margin-bottom: 12px;
  font-size: 14px;
}

/* FAQ样式 */
.faq-item {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  margin-bottom: 16px;
}

.faq-question {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 16px;
  color: #334155;
}

.faq-answer {
  margin-bottom: 12px;
  font-size: 14px;
  color: #64748b;
}

.faq-command {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .content-container {
    padding: 15px;
  }
  
  .command-grid {
    grid-template-columns: 1fr;
  }

  .docs-links {
    grid-template-columns: 1fr;
  }
}
</style> 