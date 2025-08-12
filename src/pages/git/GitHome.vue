<template>
  <div class="git-page">
    <PageLayout>
      <div class="git-container">
        <!-- 环境提示横幅 -->
        <div v-if="!isElectronEnv() && !hideWarning" class="environment-warning">
          <i class="fas fa-info-circle"></i>
          <span class="warning-text">
            当前运行在浏览器环境下，显示的是演示数据。要使用真实Git功能，请在Electron环境下运行此应用。
          </span>
          <i class="fas fa-times close-warning" @click="hideWarning = true"></i>
        </div>
        
        <div class="page-header">
          <h1 class="page-title">GIT 管理</h1>
          
          <!-- 仓库路径输入和操作区 -->
          <div class="repo-controls">
            <div class="repo-input-section">
              <!-- 仓库路径输入 -->
              <div class="repo-path-container">
                <div class="input-group">
                  <div class="input-label">
                    <i class="fas fa-folder-open"></i>
                    仓库路径
                  </div>
                  <div class="input-wrapper">
                    <input 
                      v-model="repoPath" 
                      type="text" 
                      placeholder="请输入Git仓库路径 (包含.git文件夹的目录)"
                      class="repo-input"
                      @keyup.enter="loadRepository"
                    />
                    <button class="browse-btn" @click="browseFolder" title="浏览文件夹">
                      <i class="fas fa-folder"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 操作按钮组 -->
              <div class="action-buttons">
                <button class="action-btn load-btn" @click="loadRepository" :disabled="!repoPath.trim() || isLoading">
                  <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
                  {{ isLoading ? '加载中...' : '加载仓库' }}
                </button>
                
                <button class="action-btn refresh-btn" @click="refreshStatus" :disabled="!currentRepo" title="刷新状态">
                  <i class="fas fa-redo-alt"></i>
                  刷新
                </button>
                
                <button class="action-btn quick-commit-btn" @click="showQuickCommit = true" :disabled="!hasChanges" title="快速提交">
                  <i class="fas fa-check-circle"></i>
                  快速提交
                </button>
              </div>
            </div>
            
            <!-- 仓库信息栏 -->
            <div class="repo-info" v-if="currentRepo">
              <div class="repo-status">
                <div class="status-item">
                  <i class="fas fa-code-branch"></i>
                  <span class="label">分支:</span>
                  <span class="value branch-name">{{ currentRepo.currentBranch }}</span>
                </div>
                <div class="status-item">
                  <i class="fas fa-history"></i>
                  <span class="label">最近提交:</span>
                  <span class="value">{{ formatCommitTime(currentRepo.lastCommit?.date) }}</span>
                </div>
                <div class="status-item">
                  <i class="fas fa-user"></i>
                  <span class="label">作者:</span>
                  <span class="value">{{ currentRepo.lastCommit?.author || '暂无' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-divider"></div>
        
        <!-- Git 状态和文件列表 -->
        <n-spin :show="isLoading">
          <div v-if="!currentRepo" class="empty-repo">
            <div class="empty-illustration">
              <i class="fab fa-git-alt"></i>
            </div>
            <p>请选择一个Git仓库目录来开始管理</p>
            <small>确保选择的目录包含 .git 文件夹</small>
          </div>
          
          <div v-else>
            <!-- 状态统计 -->
            <div class="status-summary">
              <div class="summary-card modified" v-if="modifiedFiles.length > 0">
                <i class="fas fa-edit"></i>
                <span class="count">{{ modifiedFiles.length }}</span>
                <span class="label">已修改</span>
              </div>
              
              <div class="summary-card added" v-if="addedFiles.length > 0">
                <i class="fas fa-plus"></i>
                <span class="count">{{ addedFiles.length }}</span>
                <span class="label">新增</span>
              </div>
              
              <div class="summary-card deleted" v-if="deletedFiles.length > 0">
                <i class="fas fa-minus"></i>
                <span class="count">{{ deletedFiles.length }}</span>
                <span class="label">删除</span>
              </div>
              
              <div class="summary-card staged" v-if="stagedFiles.length > 0">
                <i class="fas fa-check"></i>
                <span class="count">{{ stagedFiles.length }}</span>
                <span class="label">暂存</span>
              </div>
              
              <div class="summary-card clean" v-if="!hasChanges">
                <i class="fas fa-check-circle"></i>
                <span class="label">工作区干净</span>
              </div>
            </div>
            
            <!-- 文件筛选 -->
            <div class="file-filters">
              <div class="filter-tabs">
                <button 
                  v-for="filter in fileFilters" 
                  :key="filter.key"
                  class="filter-tab"
                  :class="{ active: activeFilter === filter.key }"
                  @click="setActiveFilter(filter.key)"
                >
                  <i :class="filter.icon"></i>
                  {{ filter.label }}
                  <span v-if="filter.count > 0" class="filter-count">{{ filter.count }}</span>
                </button>
              </div>
            </div>
            
            <!-- 文件列表 -->
            <div class="file-list-container">
              <div v-if="filteredFiles.length === 0" class="no-files">
                <i class="fas fa-file-code"></i>
                <p>{{ getNoFilesMessage() }}</p>
              </div>
              
              <div v-else class="file-list">
                <div 
                  v-for="file in filteredFiles" 
                  :key="file.path" 
                  class="file-item"
                  :class="[`file-${file.status.toLowerCase()}`, { selected: selectedFile?.path === file.path }]"
                  @click="selectFile(file)"
                >
                  <div class="file-info">
                    <div class="file-icon">
                      <i :class="getFileIcon(file.path)"></i>
                    </div>
                    <div class="file-details">
                      <div class="file-name">{{ file.name }}</div>
                      <div class="file-path">{{ file.relativePath }}</div>
                    </div>
                  </div>
                  
                  <div class="file-status">
                    <span class="status-badge" :class="`status-${file.status.toLowerCase()}`">
                      {{ getStatusText(file.status) }}
                    </span>
                  </div>
                  
                  <div class="file-actions">
                    <button class="file-action-btn" @click.stop="viewDiff(file)" title="查看差异" v-if="file.status !== 'UNTRACKED'">
                      <i class="fas fa-code-compare"></i>
                    </button>
                    <button class="file-action-btn" @click.stop="toggleStage(file)" :title="file.staged ? '取消暂存' : '添加到暂存'">
                      <i class="fas fa-plus" v-if="!file.staged"></i>
                      <i class="fas fa-minus" v-else></i>
                    </button>
                    <button class="file-action-btn danger" @click.stop="discardChanges(file)" title="撤销更改" v-if="file.status === 'MODIFIED'">
                      <i class="fas fa-undo"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-spin>
      </div>
      
      <template #rightSidebar>
        <GitRightSidebar 
          :current-repo="currentRepo"
          :selected-file="selectedFile"
          :recent-commits="recentCommits"
          @commit="handleCommit"
          @push="handlePush"
          @pull="handlePull"
        />
      </template>
    </PageLayout>
    
    <!-- 快速提交弹窗 -->
    <n-modal v-model:show="showQuickCommit" :mask-closable="false" class="git-modal" style="width: 60vw; max-width: 800px;">
      <div class="modal-container">
        <div class="modal-inner">
          <div class="modal-header">
            <div class="modal-title">快速提交</div>
            <n-button quaternary circle class="close-btn" @click="showQuickCommit = false">
              <n-icon>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </n-icon>
            </n-button>
          </div>
          
          <div class="modal-content">
            <!-- 提交信息 -->
            <div class="form-group">
              <label class="form-label">提交信息 <span class="required">*</span></label>
              <n-input 
                v-model:value="commitForm.message" 
                type="textarea"
                placeholder="请输入提交信息..."
                class="form-control"
                :rows="3"
                maxlength="500"
              />
              <div class="char-count">{{ commitForm.message.length }}/500</div>
            </div>
            
            <!-- 要提交的文件 -->
            <div class="form-group">
              <label class="form-label">将要提交的文件</label>
              <div class="commit-files">
                <div v-for="file in stagedFiles" :key="file.path" class="commit-file-item">
                  <div class="file-info">
                    <i :class="getFileIcon(file.path)"></i>
                    <span class="file-name">{{ file.relativePath }}</span>
                  </div>
                  <span class="file-status" :class="`status-${file.status.toLowerCase()}`">
                    {{ getStatusText(file.status) }}
                  </span>
                </div>
                
                <div v-if="stagedFiles.length === 0" class="no-staged-files">
                  <i class="fas fa-info-circle"></i>
                  <span>暂无暂存文件，将自动暂存所有更改</span>
                </div>
              </div>
            </div>
            
            <!-- 提交选项 -->
            <div class="form-group">
              <div class="commit-options">
                <label class="option-item">
                  <input type="checkbox" v-model="commitForm.stageAll" />
                  <span class="checkmark"></span>
                  <span class="option-text">自动暂存所有更改</span>
                </label>
                
                <label class="option-item">
                  <input type="checkbox" v-model="commitForm.pushAfterCommit" />
                  <span class="checkmark"></span>
                  <span class="option-text">提交后自动推送到远程</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <n-button class="cancel-button" @click="showQuickCommit = false">取消</n-button>
            <n-button type="primary" class="save-button" @click="executeCommit" :disabled="!commitForm.message.trim()">
              {{ commitForm.pushAfterCommit ? '提交并推送' : '提交' }}
            </n-button>
          </div>
        </div>
      </div>
    </n-modal>
    
    <!-- 差异查看弹窗 -->
    <n-modal v-model:show="showDiffModal" class="git-modal diff-modal" style="width: 90vw; max-width: 1200px; max-height: 90vh;">
      <div class="modal-container">
        <div class="modal-inner" style="max-height: 90vh; overflow: hidden;">
          <div class="modal-header">
            <div class="modal-title">
              <span>文件差异: {{ diffFile?.relativePath }}</span>
            </div>
            <n-button quaternary circle class="close-btn" @click="showDiffModal = false">
              <n-icon>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </n-icon>
            </n-button>
          </div>
          
          <div class="modal-content diff-content" style="overflow-y: auto; max-height: calc(90vh - 120px);">
            <div v-if="diffContent" class="diff-viewer">
              <pre class="diff-text">{{ diffContent }}</pre>
            </div>
            <div v-else class="loading-diff">
              <n-spin size="large" />
              <p>正在加载差异内容...</p>
            </div>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { NButton, NModal, NInput, NIcon, NSpin, useMessage } from 'naive-ui'
import PageLayout from '@/components/layout/PageLayout.vue'
import GitRightSidebar from '@/components/layout/GitRightSidebar.vue'
import { gitService } from '@/services/gitService'

// 添加FontAwesome CDN
const head = document.head || document.getElementsByTagName('head')[0]
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
head.appendChild(link)

// Git文件状态接口
interface GitFile {
  path: string
  name: string
  relativePath: string
  status: 'MODIFIED' | 'ADDED' | 'DELETED' | 'UNTRACKED' | 'STAGED'
  staged: boolean
}

// Git仓库信息接口
interface GitRepo {
  path: string
  currentBranch: string
  lastCommit?: {
    hash: string
    message: string
    author: string
    date: number
  }
  remotes: string[]
}

// Git提交信息接口
interface GitCommit {
  hash: string
  message: string
  author: string
  date: number
  files: string[]
}

// 创建全局message实例
const message = useMessage()

// 响应式状态
const repoPath = ref('')
const currentRepo = ref<GitRepo | null>(null)
const files = ref<GitFile[]>([])
const selectedFile = ref<GitFile | null>(null)
const isLoading = ref(false)
const activeFilter = ref('all')
const showQuickCommit = ref(false)
const showDiffModal = ref(false)
const diffFile = ref<GitFile | null>(null)
const diffContent = ref('')
const recentCommits = ref<GitCommit[]>([])
const hideWarning = ref(false)

// 自动刷新定时器
let refreshTimer: NodeJS.Timeout | null = null

// 提交表单
const commitForm = reactive({
  message: '',
  stageAll: true,
  pushAfterCommit: false
})

// 计算属性
const modifiedFiles = computed(() => files.value.filter(f => f.status === 'MODIFIED'))
const addedFiles = computed(() => files.value.filter(f => f.status === 'ADDED' || f.status === 'UNTRACKED'))
const deletedFiles = computed(() => files.value.filter(f => f.status === 'DELETED'))
const stagedFiles = computed(() => files.value.filter(f => f.staged))
const hasChanges = computed(() => files.value.length > 0)

// 文件过滤器
const fileFilters = computed(() => [
  { key: 'all', label: '全部', icon: 'fas fa-list', count: files.value.length },
  { key: 'modified', label: '已修改', icon: 'fas fa-edit', count: modifiedFiles.value.length },
  { key: 'added', label: '新增', icon: 'fas fa-plus', count: addedFiles.value.length },
  { key: 'deleted', label: '删除', icon: 'fas fa-minus', count: deletedFiles.value.length },
  { key: 'staged', label: '已暂存', icon: 'fas fa-check', count: stagedFiles.value.length }
])

// 过滤后的文件列表
const filteredFiles = computed(() => {
  switch (activeFilter.value) {
    case 'modified':
      return modifiedFiles.value
    case 'added':
      return addedFiles.value
    case 'deleted':
      return deletedFiles.value
    case 'staged':
      return stagedFiles.value
    default:
      return files.value
  }
})

// 检查是否为Electron环境
function isElectronEnv(): boolean {
  const hasElectronAPI = typeof window !== 'undefined' && !!(window as any).electronAPI
  
  // 调试信息
  console.log('🔧 [Git Debug] Electron环境检测:')
  console.log('  - window对象存在:', typeof window !== 'undefined')
  console.log('  - electronAPI存在:', !!(window as any).electronAPI)
  console.log('  - process对象存在:', !!(window as any).process)
  console.log('  - process.type:', (window as any).process?.type)
  console.log('  - 最终判断结果:', hasElectronAPI)
  
  if (hasElectronAPI) {
    console.log('✅ [Git Debug] 检测到Electron环境，将使用真实Git功能')
  } else {
    console.log('⚠️ [Git Debug] 未检测到Electron环境，将使用演示数据')
  }
  
  return hasElectronAPI
}

// 加载Git仓库
async function loadRepository(): Promise<void> {
  if (!repoPath.value.trim()) {
    message.error('请输入仓库路径')
    return
  }

  isLoading.value = true
  
  try {
    const repo = await gitService.loadRepository(repoPath.value.trim())
    currentRepo.value = repo
    await refreshStatus()
    await loadRecentCommits()
    
    // 根据环境显示不同的成功消息
    if (isElectronEnv()) {
      message.success('仓库加载成功')
    } else {
      message.warning('仓库加载成功 (演示模式) - 浏览器环境下显示的是模拟数据，要使用真实Git功能请在Electron环境下运行')
    }
    
    // 启动自动刷新
    startAutoRefresh()
    
  } catch (error: any) {
    message.error(`加载仓库失败: ${error.message}`)
    currentRepo.value = null
    files.value = []
  } finally {
    isLoading.value = false
  }
}

// 刷新Git状态
async function refreshStatus(): Promise<void> {
  if (!currentRepo.value) return
  
  try {
    const status = await gitService.getStatus(currentRepo.value.path)
    files.value = status.files
  } catch (error: any) {
    message.error(`刷新状态失败: ${error.message}`)
  }
}

// 加载最近提交
async function loadRecentCommits(): Promise<void> {
  if (!currentRepo.value) return
  
  try {
    recentCommits.value = await gitService.getRecentCommits(currentRepo.value.path, 10)
  } catch (error: any) {
    console.warn('加载提交历史失败:', error.message)
  }
}

// 启动自动刷新
function startAutoRefresh(): void {
  stopAutoRefresh()
  refreshTimer = setInterval(async () => {
    if (currentRepo.value && !isLoading.value) {
      await refreshStatus()
    }
  }, 5000) // 每5秒刷新一次
}

// 停止自动刷新
function stopAutoRefresh(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 浏览文件夹
async function browseFolder(): Promise<void> {
  try {
    // 优先使用Electron API
    if (isElectronEnv() && (window as any).electronAPI) {
      try {
        const result = await (window as any).electronAPI.selectDirectory()
        if (result.success && result.path) {
          repoPath.value = result.path
          message.success(`已选择文件夹: ${result.path}`)
          return
        } else if (result.error && !result.error.includes('未选择')) {
          message.error(`选择文件夹失败: ${result.error}`)
          return
        }
      } catch (error: any) {
        console.warn('Electron directory picker error:', error)
      }
    }
    
    // 检查是否支持File System Access API (Chrome等现代浏览器)
    if ('showDirectoryPicker' in window) {
      try {
        const dirHandle = await (window as any).showDirectoryPicker()
        repoPath.value = dirHandle.name // 使用文件夹名称
        message.success(`已选择文件夹: ${dirHandle.name}`)
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.warn('Directory picker error:', error)
          fallbackFolderSelect()
        }
      }
    } else {
      fallbackFolderSelect()
    }
  } catch (error) {
    console.error('Folder browse error:', error)
    fallbackFolderSelect()
  }
}

// 备用文件夹选择方案
function fallbackFolderSelect(): void {
  // 创建隐藏的文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.webkitdirectory = true
  input.style.display = 'none'
  
  input.onchange = (event: any) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // 从第一个文件的路径提取文件夹路径
      const firstFile = files[0]
      const pathParts = firstFile.webkitRelativePath.split('/')
      const folderName = pathParts[0]
      repoPath.value = folderName
      message.success(`已选择文件夹: ${folderName}`)
    }
    document.body.removeChild(input)
  }
  
  document.body.appendChild(input)
  input.click()
}

// 设置活动过滤器
function setActiveFilter(filter: string): void {
  activeFilter.value = filter
}

// 选择文件
function selectFile(file: GitFile): void {
  selectedFile.value = file
}

// 获取文件图标
function getFileIcon(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase()
  const iconMap: Record<string, string> = {
    'js': 'fab fa-js-square',
    'ts': 'fas fa-code',
    'vue': 'fab fa-vuejs',
    'html': 'fab fa-html5',
    'css': 'fab fa-css3-alt',
    'scss': 'fab fa-sass',
    'json': 'fas fa-file-code',
    'md': 'fab fa-markdown',
    'txt': 'fas fa-file-alt',
    'png': 'fas fa-file-image',
    'jpg': 'fas fa-file-image',
    'jpeg': 'fas fa-file-image',
    'gif': 'fas fa-file-image',
    'svg': 'fas fa-file-image',
    'pdf': 'fas fa-file-pdf',
    'zip': 'fas fa-file-archive'
  }
  return iconMap[ext || ''] || 'fas fa-file'
}

// 获取状态文本
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'MODIFIED': 'M',
    'ADDED': 'A',
    'DELETED': 'D',
    'UNTRACKED': '?',
    'STAGED': 'S'
  }
  return statusMap[status] || status
}

// 获取空文件列表消息
function getNoFilesMessage(): string {
  switch (activeFilter.value) {
    case 'modified':
      return '没有已修改的文件'
    case 'added':
      return '没有新增的文件'
    case 'deleted':
      return '没有删除的文件'
    case 'staged':
      return '没有已暂存的文件'
    default:
      return '工作目录是干净的'
  }
}

// 查看文件差异
async function viewDiff(file: GitFile): Promise<void> {
  if (!currentRepo.value) return
  
  diffFile.value = file
  showDiffModal.value = true
  diffContent.value = ''
  
  try {
    const diff = await gitService.getDiff(currentRepo.value.path, file.path)
    diffContent.value = diff
  } catch (error: any) {
    message.error(`获取差异失败: ${error.message}`)
    diffContent.value = '无法获取差异内容'
  }
}

// 切换文件暂存状态
async function toggleStage(file: GitFile): Promise<void> {
  if (!currentRepo.value) return
  
  try {
    if (file.staged) {
      await gitService.unstageFile(currentRepo.value.path, file.path)
      message.success(`已取消暂存: ${file.name}`)
    } else {
      await gitService.stageFile(currentRepo.value.path, file.path)
      message.success(`已添加到暂存: ${file.name}`)
    }
    
    await refreshStatus()
  } catch (error: any) {
    message.error(`操作失败: ${error.message}`)
  }
}

// 撤销文件更改
async function discardChanges(file: GitFile): Promise<void> {
  if (!currentRepo.value) return
  
  try {
    await gitService.discardChanges(currentRepo.value.path, file.path)
    message.success(`已撤销更改: ${file.name}`)
    await refreshStatus()
  } catch (error: any) {
    message.error(`撤销失败: ${error.message}`)
  }
}

// 执行提交
async function executeCommit(): Promise<void> {
  if (!currentRepo.value || !commitForm.message.trim()) return
  
  try {
    if (commitForm.stageAll) {
      await gitService.stageAll(currentRepo.value.path)
    }
    
    await gitService.commit(currentRepo.value.path, commitForm.message.trim())
    message.success('提交成功')
    
    if (commitForm.pushAfterCommit) {
      await handlePush()
    }
    
    showQuickCommit.value = false
    commitForm.message = ''
    await refreshStatus()
    await loadRecentCommits()
    
  } catch (error: any) {
    message.error(`提交失败: ${error.message}`)
  }
}

// 处理提交
async function handleCommit(data: { message: string; files?: string[] }): Promise<void> {
  if (!currentRepo.value) return
  
  try {
    if (data.files && data.files.length > 0) {
      // 暂存指定文件
      for (const file of data.files) {
        await gitService.stageFile(currentRepo.value.path, file)
      }
    } else {
      // 暂存所有文件
      await gitService.stageAll(currentRepo.value.path)
    }
    
    await gitService.commit(currentRepo.value.path, data.message)
    message.success('提交成功')
    
    await refreshStatus()
    await loadRecentCommits()
    
  } catch (error: any) {
    message.error(`提交失败: ${error.message}`)
  }
}

// 处理推送
async function handlePush(): Promise<void> {
  if (!currentRepo.value) return
  
  try {
    await gitService.push(currentRepo.value.path)
    message.success('推送成功')
  } catch (error: any) {
    message.error(`推送失败: ${error.message}`)
  }
}

// 处理拉取
async function handlePull(): Promise<void> {
  if (!currentRepo.value) return
  
  try {
    await gitService.pull(currentRepo.value.path)
    message.success('拉取成功')
    await refreshStatus()
    await loadRecentCommits()
  } catch (error: any) {
    message.error(`拉取失败: ${error.message}`)
  }
}

// 格式化提交时间
function formatCommitTime(timestamp?: number): string {
  if (!timestamp) return '暂无'
  
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
  
  return new Date(timestamp).toLocaleDateString()
}

// 生命周期
onMounted(() => {
  // 初始化时可以检查是否有默认路径
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
/* 隐藏滚动条 */
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

*::-webkit-scrollbar {
  display: none; /* WebKit */
}

.git-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  position: relative;
}

.git-container {
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
}

.content-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.08);
  margin: 0;
}

/* 环境警告横幅样式 */
.environment-warning {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.environment-warning i.fas.fa-info-circle {
  color: #856404;
  font-size: 16px;
  flex-shrink: 0;
}

.warning-text {
  flex: 1;
  color: #856404;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
}

.close-warning {
  color: #856404;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-warning:hover {
  background: rgba(133, 100, 4, 0.1);
  color: #333;
}

/* 仓库控制区样式 */
.repo-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.repo-input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.repo-path-container {
  flex: 1;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.input-label i {
  color: #6b7280;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.repo-input {
  flex: 1;
  height: 40px;
  padding: 0 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  transition: border-color 0.2s ease;
}

.repo-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.browse-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #f3f4f6;
  border: 2px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.browse-btn:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.load-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
}

.load-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.refresh-btn {
  background-color: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
  color: #374151;
}

.quick-commit-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.quick-commit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
}

.quick-commit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 仓库信息栏 */
.repo-info {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.repo-status {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.status-item i {
  color: #6b7280;
}

.status-item .label {
  color: #6b7280;
  font-weight: 500;
}

.status-item .value {
  color: #374151;
  font-weight: 600;
}

.branch-name {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* 空状态 */
.empty-repo {
  text-align: center;
  padding: 80px 0;
  color: #8c9396;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 50vh;
}

.empty-illustration {
  width: 84px;
  height: 84px;
  color: #bbc3cd;
  font-size: 84px;
}

/* 状态统计 */
.status-summary {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid transparent;
}

.summary-card.modified {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
  color: #d97706;
}

.summary-card.added {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
  color: #059669;
}

.summary-card.deleted {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.summary-card.staged {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
  color: #2563eb;
}

.summary-card.clean {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
  color: #059669;
}

.summary-card .count {
  font-weight: 700;
}

/* 文件过滤器 */
.file-filters {
  margin-bottom: 16px;
}

.filter-tabs {
  display: flex;
  gap: 4px;
  background: #f8fafc;
  padding: 4px;
  border-radius: 12px;
  overflow-x: auto;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.7);
  color: #374151;
}

.filter-tab.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-count {
  background: currentColor;
  color: white;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
  line-height: 1.2;
}

/* 文件列表 */
.file-list-container {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.no-files {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.no-files i {
  font-size: 48px;
  opacity: 0.5;
}

.file-list {
  display: flex;
  flex-direction: column;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-item:last-child {
  border-bottom: none;
}

.file-item:hover {
  background: #f8fafc;
}

.file-item.selected {
  background: rgba(59, 130, 246, 0.05);
  border-left: 3px solid #3b82f6;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  width: 20px;
  display: flex;
  justify-content: center;
  color: #6b7280;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-path {
  font-size: 12px;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-status {
  margin-right: 12px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.status-modified {
  background: #f59e0b;
}

.status-added,
.status-untracked {
  background: #10b981;
}

.status-deleted {
  background: #ef4444;
}

.status-staged {
  background: #3b82f6;
}

.file-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.file-item:hover .file-actions {
  opacity: 1;
}

.file-action-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 12px;
}

.file-action-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.file-action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* 特殊文件状态样式 */
.file-modified .file-name {
  color: #d97706;
}

.file-added .file-name,
.file-untracked .file-name {
  color: #059669;
}

.file-deleted .file-name {
  color: #dc2626;
  text-decoration: line-through;
}

/* 弹窗样式 */
.git-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.git-modal .modal-container {
  position: relative;
  margin: 0 auto;
}

.git-modal :deep(.n-modal) {
  width: auto !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.git-modal .modal-inner {
  width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.git-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.git-modal .modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.git-modal .close-btn {
  margin-right: -6px;
  color: #999;
}

.git-modal .modal-content {
  padding: 18px 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.git-modal .form-group {
  margin-bottom: 18px;
  text-align: left;
  width: 100%;
}

.git-modal .form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.git-modal .form-control {
  width: 100%;
}

.char-count {
  text-align: right;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
}

.git-modal .modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 14px 20px 16px;
  border-top: 1px solid #f0f0f0;
  gap: 10px;
}

.git-modal .cancel-button {
  min-width: 80px;
  color: #333 !important;
}

.git-modal .save-button {
  min-width: 80px;
  background-color: #333 !important;
  border-color: #333 !important;
}

/* 提交文件列表 */
.commit-files {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.commit-file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
}

.commit-file-item:last-child {
  border-bottom: none;
}

.commit-file-item .file-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.commit-file-item .file-name {
  font-size: 13px;
  color: #374151;
}

.commit-file-item .file-status {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
}

.no-staged-files {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: #6b7280;
  font-size: 13px;
}

/* 提交选项 */
.commit-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.option-item input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.option-item input[type="checkbox"]:checked + .checkmark {
  background: #3b82f6;
  border-color: #3b82f6;
}

.option-item input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* 差异查看器 */
.diff-content {
  padding: 0 !important;
}

.diff-viewer {
  background: #f8fafc;
  border-radius: 8px;
  margin: 20px;
  overflow: hidden;
}

.diff-text {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  padding: 20px;
  margin: 0;
  background: #1e1e1e;
  color: #d4d4d4;
  overflow-x: auto;
  white-space: pre;
}

.loading-diff {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: #6b7280;
}

/* 响应式 */
@media (max-width: 768px) {
  .repo-status {
    flex-direction: column;
    gap: 12px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .filter-tabs {
    overflow-x: auto;
  }
  
  .summary-card {
    min-width: 120px;
  }
  
  .file-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .file-actions {
    opacity: 1;
    align-self: flex-end;
  }
}
</style>
