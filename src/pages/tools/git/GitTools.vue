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
                  placeholder="搜索命令组合..."
                  class="search-input"
                  @input="handleSearchInput"
                />
              </div>
              <button class="add-button" @click="showAddCommandModal = true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <!-- 自定义命令组合展示 -->
            <div class="mb-6">
              <div v-if="filteredCustomCommands.length === 0" class="text-center py-12 text-gray-400">
                <p>暂无命令组合，点击右上角"+"按钮创建</p>
              </div>
              <div v-else class="command-grid">
                <div v-for="(cmd, index) in filteredCustomCommands" :key="index" class="custom-command-item">
                  <div class="flex justify-between items-center mb-3">
                    <div class="command-title">{{ cmd.title }}</div>
                    <div class="flex gap-2">
                      <button class="icon-button" @click="editCustomCommand(index)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20H17C18.1046 20 19 19.1046 19 18V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M17 3L21 7L12 16H8V12L17 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                      <button class="icon-button" @click="showDeleteConfirm(index)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="command-steps">
                    <div v-for="(step, stepIndex) in cmd.steps" :key="`${index}-${stepIndex}`" class="command-step">
                      <div class="step-desc">{{ stepIndex + 1 }}. {{ step.description }}</div>
                      <div class="step-command-box">
                        <div class="command-code">{{ step.command }}</div>
                        <button class="copy-button" @click="copyToClipboard(step.command)">
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

          <!-- 添加/编辑自定义命令组合的模态框 -->
          <n-modal
            v-model:show="showAddCommandModal"
            preset="card"
            title="自定义命令组合"
            style="width: 500px;"
            :bordered="false"
          >
            <div class="modal-content">
              <div class="form-section">
                <div class="form-item">
                  <label>标题</label>
                  <input v-model="currentCommand.title" placeholder="请输入命令组合标题" class="form-input" />
                </div>

                <div class="step-container">
                  <div class="step-header">
                    <h3>步骤 {{ currentStepIndex + 1 }}</h3>
                    <div class="step-indicator">
                      {{ currentStepIndex + 1 }} / {{ currentCommand.steps.length }}
                    </div>
                  </div>
                  
                  <div class="form-item">
                    <label>说明</label>
                    <input 
                      v-model="currentCommand.steps[currentStepIndex].description" 
                      placeholder="请输入步骤说明" 
                      class="form-input" 
                    />
                  </div>
                  
                  <div class="form-item">
                    <label>命令</label>
                    <input 
                      v-model="currentCommand.steps[currentStepIndex].command" 
                      placeholder="请输入命令" 
                      class="form-input" 
                    />
                  </div>
                </div>

                <div class="step-navigation">
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
                    :disabled="currentStepIndex === currentCommand.steps.length - 1"
                    @click="currentStepIndex++"
                  >
                    下一步
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div class="step-actions">
                  <button class="action-button add" @click="addStep">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    添加步骤
                  </button>
                  
                  <button 
                    v-if="currentCommand.steps.length > 1"
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
                <button class="save-button" @click="saveCustomCommand">保存</button>
              </div>
            </div>
          </n-modal>

          <!-- 删除确认模态框 -->
          <n-modal v-model:show="showDeleteModal" preset="dialog" title="确认删除" content="确定要删除这个命令组合吗？" positive-text="确定" negative-text="取消" @positive-click="confirmDelete" @negative-click="cancelDelete" />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  NCard, NButton, NTabs, NTabPane, NModal, NSpace
} from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 设置页面标题
onMounted(() => {
  document.title = '薯条-Git工具集'
  // 从本地存储加载自定义命令
  const savedCommands = localStorage.getItem('gitCustomCommands')
  if (savedCommands) {
    try {
      customCommands.value = JSON.parse(savedCommands)
    } catch (e) {
      console.error('Failed to parse saved commands', e)
    }
  }
})

// 搜索功能
const searchQuery = ref('')

function handleSearchInput() {
  // 搜索功能相关逻辑，可以留空，主要是为了UI交互
}

// 自定义命令组合
interface CommandStep {
  description: string
  command: string
}

interface CustomCommand {
  title: string
  steps: CommandStep[]
}

const customCommands = ref<CustomCommand[]>([
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

// 过滤后的自定义命令
const filteredCustomCommands = computed(() => {
  if (!searchQuery.value) return customCommands.value
  
  const query = searchQuery.value.toLowerCase()
  return customCommands.value.filter(cmd => 
    cmd.title.toLowerCase().includes(query) || 
    cmd.steps.some(step => 
      step.description.toLowerCase().includes(query) || 
      step.command.toLowerCase().includes(query)
    )
  )
})

// 添加/编辑命令相关
const showAddCommandModal = ref(false)
const isEditing = ref(false)
const editingIndex = ref(-1)
const currentStepIndex = ref(0)

// 删除确认
const showDeleteModal = ref(false)
const deleteIndex = ref(-1)

const currentCommand = ref<CustomCommand>({
  title: '',
  steps: [
    {
      description: '',
      command: ''
    }
  ]
})

function addCustomCommand() {
  isEditing.value = false
  currentCommand.value = {
    title: '',
    steps: [
      {
        description: '',
        command: ''
      }
    ]
  }
  currentStepIndex.value = 0
  showAddCommandModal.value = true
}

function editCustomCommand(index: number) {
  isEditing.value = true
  editingIndex.value = index
  currentCommand.value = JSON.parse(JSON.stringify(customCommands.value[index]))
  currentStepIndex.value = 0
  showAddCommandModal.value = true
}

function showDeleteConfirm(index: number) {
  deleteIndex.value = index
  showDeleteModal.value = true
}

function confirmDelete() {
  customCommands.value.splice(deleteIndex.value, 1)
  saveToLocalStorage()
  message.success('命令组合已删除')
  showDeleteModal.value = false
}

function cancelDelete() {
  showDeleteModal.value = false
}

function addStep() {
  currentCommand.value.steps.push({
    description: '',
    command: ''
  })
  currentStepIndex.value = currentCommand.value.steps.length - 1
}

function removeCurrentStep() {
  if (currentCommand.value.steps.length > 1) {
    currentCommand.value.steps.splice(currentStepIndex.value, 1)
    if (currentStepIndex.value >= currentCommand.value.steps.length) {
      currentStepIndex.value = currentCommand.value.steps.length - 1
    }
  } else {
    message.warning('至少需要保留一个步骤')
  }
}

function saveCustomCommand() {
  // 验证表单
  if (!currentCommand.value.title.trim()) {
    message.warning('请填写命令组合标题')
    return
  }

  for (const step of currentCommand.value.steps) {
    if (!step.description.trim()) {
      message.warning('请填写所有步骤的说明')
      return
    }
    if (!step.command.trim()) {
      message.warning('请填写所有步骤的命令')
      return
    }
  }

  if (isEditing.value) {
    // 更新现有命令
    customCommands.value[editingIndex.value] = JSON.parse(JSON.stringify(currentCommand.value))
    message.success('命令组合已更新')
  } else {
    // 添加新命令
    customCommands.value.push(JSON.parse(JSON.stringify(currentCommand.value)))
    message.success('命令组合已添加')
  }

  saveToLocalStorage()
  showAddCommandModal.value = false
}

function saveToLocalStorage() {
  localStorage.setItem('gitCustomCommands', JSON.stringify(customCommands.value))
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

// 复制到剪贴板
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已复制到剪贴板')
  }).catch(() => {
    message.error('复制失败')
  })
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