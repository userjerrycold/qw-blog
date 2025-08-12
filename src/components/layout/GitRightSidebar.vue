<template>
  <aside class="git-sidebar">
    <!-- 快速提交区域 - 置顶 -->
    <div class="sidebar-section" v-if="currentRepo">
      <h3 class="section-title">
        <i class="fas fa-rocket"></i>
        快速提交
      </h3>
      <div class="quick-commit">
        <div class="commit-form">
          <textarea 
            v-model="commitMessage" 
            placeholder="输入提交信息..."
            class="commit-input"
            rows="3"
            maxlength="500"
          ></textarea>
          <div class="commit-char-count">{{ commitMessage.length }}/500</div>
          
          <div class="commit-options">
            <label class="commit-option">
              <input type="checkbox" v-model="stageAllFiles" />
              <span class="checkmark"></span>
              <span class="option-text">暂存所有文件</span>
            </label>
            
            <label class="commit-option">
              <input type="checkbox" v-model="pushAfterCommit" />
              <span class="checkmark"></span>
              <span class="option-text">提交后推送</span>
            </label>
          </div>
          
          <div class="commit-actions">
            <button class="commit-action-btn primary" @click="executeCommit" :disabled="!commitMessage.trim()">
              <i class="fas fa-check"></i>
              {{ pushAfterCommit ? '提交并推送' : '提交' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 仓库统计 -->
    <div class="sidebar-section" v-if="currentRepo">
      <h3 class="section-title">仓库信息</h3>
      <div class="repo-stats">
        <div class="repo-stat-card">
          <div class="repo-stat-number">{{ currentRepo.currentBranch }}</div>
          <div class="repo-stat-label">当前分支</div>
        </div>
        <div class="repo-stat-card">
          <div class="repo-stat-number">{{ recentCommits.length }}</div>
          <div class="repo-stat-label">最近提交</div>
        </div>
        <div class="repo-stat-card">
          <div class="repo-stat-number">{{ currentRepo.remotes.length }}</div>
          <div class="repo-stat-label">远程仓库</div>
        </div>
      </div>
    </div>

    <!-- 分支管理 -->
    <div class="sidebar-section" v-if="currentRepo">
      <h3 class="section-title">分支管理</h3>
      <div class="branch-management">
        <div class="current-branch">
          <div class="branch-info">
            <span class="branch-icon">
              <i class="fas fa-code-branch"></i>
            </span>
            <span class="branch-name">{{ currentRepo.currentBranch }}</span>
            <span class="branch-status active">当前</span>
          </div>
        </div>
        
        <div class="branch-actions">
          <button class="branch-action-btn" @click="handleCreateBranch" title="创建分支">
            <i class="fas fa-plus"></i>
            新建分支
          </button>
          <button class="branch-action-btn" @click="handleSwitchBranch" title="切换分支">
            <i class="fas fa-exchange-alt"></i>
            切换分支
          </button>
        </div>
      </div>
    </div>

    <!-- 文件差异预览 -->
    <div class="sidebar-section" v-if="selectedFile">
      <h3 class="section-title">
        <i class="fas fa-file-code"></i>
        文件预览
      </h3>
      <div class="file-preview">
        <div class="preview-header">
          <div class="file-info">
            <i :class="getFileIcon(selectedFile.path)"></i>
            <span class="file-name">{{ selectedFile.name }}</span>
          </div>
          <span class="file-status" :class="`status-${selectedFile.status.toLowerCase()}`">
            {{ getStatusText(selectedFile.status) }}
          </span>
        </div>
        
        <div class="preview-content">
          <div class="file-path">{{ selectedFile.relativePath }}</div>
          
          <div class="preview-actions">
            <button class="preview-action-btn" @click="handleLoadDiff" title="加载差异" v-if="selectedFile.status !== 'UNTRACKED' && !selectedFileDiff">
              <i class="fas fa-code-compare"></i>
              加载差异
            </button>
            <button class="preview-action-btn" @click="handleStageFile" :title="selectedFile.staged ? '取消暂存' : '添加到暂存'">
              <i class="fas fa-plus" v-if="!selectedFile.staged"></i>
              <i class="fas fa-minus" v-else></i>
              {{ selectedFile.staged ? '取消暂存' : '暂存' }}
            </button>
          </div>
          
          <!-- GitLab风格的差异显示 -->
          <div class="diff-container" v-if="selectedFileDiff || selectedFileDiffLoading">
            <div class="diff-header">
              <i class="fas fa-code-compare"></i>
              <span>代码差异</span>
              <span class="diff-hint">(双击 M 文件自动加载)</span>
            </div>
            
            <div class="diff-loading" v-if="selectedFileDiffLoading">
              <i class="fas fa-spinner fa-spin"></i>
              加载中...
            </div>
            
            <div class="diff-content" v-else-if="selectedFileDiff">
              <div class="diff-lines">
                <div 
                  v-for="(line, index) in parsedDiffLines" 
                  :key="index"
                  :class="[
                    'diff-line',
                    {
                      'diff-line-added': line.type === 'added',
                      'diff-line-removed': line.type === 'removed',
                      'diff-line-context': line.type === 'context',
                      'diff-line-header': line.type === 'header'
                    }
                  ]"
                >
                  <div class="diff-line-number">
                    <span class="line-num-old">{{ line.oldNumber || '' }}</span>
                    <span class="line-num-new">{{ line.newNumber || '' }}</span>
                  </div>
                  <div class="diff-line-content">
                    <span class="diff-prefix">{{ line.prefix }}</span>
                    <span class="diff-text">{{ line.content }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 提交历史 -->
    <div class="sidebar-section">
      <h3 class="section-title">提交历史</h3>
      <div class="commit-history">
        <div v-if="recentCommits.length === 0" class="no-commits">
          <i class="fas fa-history"></i>
          <p>暂无提交历史</p>
        </div>
        
        <div v-else class="commit-list">
          <div 
            v-for="commit in recentCommits.slice(0, 5)" 
            :key="commit.hash" 
            class="commit-item"
            @click="handleViewCommit(commit)"
          >
            <div class="commit-info">
              <div class="commit-message">{{ getCommitMessageSnippet(commit.message) }}</div>
              <div class="commit-meta">
                <span class="commit-author">
                  <i class="fas fa-user"></i>
                  {{ commit.author }}
                </span>
                <span class="commit-time">{{ formatCommitTime(commit.date) }}</span>
              </div>
              <div class="commit-hash">
                <i class="fas fa-hashtag"></i>
                {{ commit.hash.substring(0, 7) }}
              </div>
            </div>
          </div>
          
          <button v-if="recentCommits.length > 5" class="view-more-btn" @click="handleViewAllCommits">
            查看更多 ({{ recentCommits.length - 5 }}+)
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 远程仓库状态 -->
    <div class="sidebar-section" v-if="currentRepo && currentRepo.remotes.length > 0">
      <h3 class="section-title">远程仓库</h3>
      <div class="remote-status">
        <div 
          v-for="remote in currentRepo.remotes.slice(0, 3)" 
          :key="remote" 
          class="remote-item"
        >
          <div class="remote-info">
            <span class="remote-name">{{ remote }}</span>
            <span class="remote-status-indicator connected"></span>
          </div>
        </div>
        
        <div class="remote-actions">
          <button class="remote-action-btn" @click="handleFetch" title="获取远程更新">
            <i class="fas fa-cloud-download-alt"></i>
            Fetch
          </button>
          <button class="remote-action-btn" @click="handleSync" title="同步">
            <i class="fas fa-sync"></i>
            Sync
          </button>
        </div>
      </div>
    </div>


  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMessage } from 'naive-ui'

// 差异行接口
interface DiffLine {
  type: 'added' | 'removed' | 'context' | 'header'
  oldNumber?: number
  newNumber?: number
  prefix: string
  content: string
}

// 创建全局message实例
const message = useMessage()

// 添加FontAwesome CDN
const head = document.head || document.getElementsByTagName('head')[0]
const existingLink = head.querySelector('link[href*="font-awesome"]')
if (!existingLink) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
  head.appendChild(link)
}

// 接口定义
interface GitFile {
  path: string
  name: string
  relativePath: string
  status: 'MODIFIED' | 'ADDED' | 'DELETED' | 'UNTRACKED' | 'STAGED'
  staged: boolean
}

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

interface GitCommit {
  hash: string
  message: string
  author: string
  date: number
  files: string[]
}

// Props定义
const props = defineProps<{
  currentRepo: GitRepo | null
  selectedFile: GitFile | null
  recentCommits: GitCommit[]
  selectedFileDiff: string
  selectedFileDiffLoading: boolean
}>()

// Emits定义  
const emit = defineEmits<{
  'commit': [data: { message: string; files?: string[]; pushAfterCommit?: boolean }]
  'load-diff': [file: GitFile]
}>()

// 响应式状态
const commitMessage = ref('')
const stageAllFiles = ref(true)
const pushAfterCommit = ref(false)

// 解析差异内容的计算属性
const parsedDiffLines = computed((): DiffLine[] => {
  if (!props.selectedFileDiff) return []
  
  const lines = props.selectedFileDiff.split('\n')
  const result: DiffLine[] = []
  let oldLineNumber = 0
  let newLineNumber = 0
  
  for (const line of lines) {
    if (line.startsWith('@@')) {
      // 解析行号信息 @@-1,4 +1,4 @@
      const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/)
      if (match) {
        oldLineNumber = parseInt(match[1]) - 1
        newLineNumber = parseInt(match[2]) - 1
      }
      result.push({
        type: 'header',
        prefix: '',
        content: line
      })
    } else if (line.startsWith('+')) {
      newLineNumber++
      result.push({
        type: 'added',
        newNumber: newLineNumber,
        prefix: '+',
        content: line.slice(1)
      })
    } else if (line.startsWith('-')) {
      oldLineNumber++
      result.push({
        type: 'removed',
        oldNumber: oldLineNumber,
        prefix: '-',
        content: line.slice(1)
      })
    } else if (line.startsWith(' ')) {
      oldLineNumber++
      newLineNumber++
      result.push({
        type: 'context',
        oldNumber: oldLineNumber,
        newNumber: newLineNumber,
        prefix: ' ',
        content: line.slice(1)
      })
    } else if (line.trim() && !line.startsWith('diff --git') && !line.startsWith('index')) {
      result.push({
        type: 'context',
        prefix: '',
        content: line
      })
    }
  }
  
  return result
})



// 分支管理
function handleCreateBranch(): void {
  message.info('创建分支功能开发中...')
}

function handleSwitchBranch(): void {
  message.info('切换分支功能开发中...')
}

// 文件操作
function handleLoadDiff(): void {
  if (props.selectedFile && props.selectedFile.status !== 'UNTRACKED') {
    emit('load-diff', props.selectedFile)
  }
}

function handleStageFile(): void {
  if (props.selectedFile) {
    const action = props.selectedFile.staged ? '取消暂存' : '暂存'
    message.info(`${action}文件: ${props.selectedFile.name}`)
  }
}

// 提交相关
function handleViewCommit(commit: GitCommit): void {
  message.info(`查看提交: ${commit.hash.substring(0, 7)}`)
}

function handleViewAllCommits(): void {
  message.info('查看所有提交历史')
}

function executeCommit(): void {
  if (!commitMessage.value.trim()) {
    message.error('请输入提交信息')
    return
  }
  
  const commitData = {
    message: commitMessage.value.trim(),
    files: stageAllFiles.value ? undefined : [],
    pushAfterCommit: pushAfterCommit.value
  }
  
  emit('commit', commitData)
  
  // 清空表单
  commitMessage.value = ''
}

// 远程仓库操作
function handleFetch(): void {
  message.info('获取远程更新功能开发中...')
}

function handleSync(): void {
  message.info('同步功能开发中...')
}

// 工具函数
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

function getCommitMessageSnippet(message: string): string {
  if (!message) return ''
  return message.length > 60 ? message.substring(0, 60) + '...' : message
}

function formatCommitTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
  
  return new Date(timestamp).toLocaleDateString()
}

// 初始化
onMounted(() => {
  // 可以在这里进行初始化操作
})
</script>

<script lang="ts">
export default {
  name: 'GitRightSidebar'
}
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

.git-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 14px 260px 0;
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

.git-sidebar::-webkit-scrollbar {
  display: none;
}

/* 区域样式 */
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
  font-size: 13px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 12px;
  color: #333;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-title i {
  color: #10b981;
  font-size: 12px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 20px;
  height: 2px;
  background-color: #333;
  border-radius: 2px;
}



/* 仓库统计样式 */
.repo-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.repo-stat-card {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 
    0 3px 8px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.repo-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 5px 12px rgba(0, 0, 0, 0.05),
    0 2px 4px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.5);
}

.repo-stat-number {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  text-align: center;
}

.repo-stat-label {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
  text-align: center;
}

/* 分支管理样式 */
.branch-management {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 
    0 3px 10px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.current-branch {
  margin-bottom: 12px;
}

.branch-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.branch-icon {
  color: #3b82f6;
}

.branch-name {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.branch-status {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  background: #10b981;
  color: white;
}

.branch-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.branch-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.branch-action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

/* 文件预览样式 */
.file-preview {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 
    0 3px 10px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.preview-header .file-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.preview-header .file-name {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-header .file-status {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
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

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-path {
  font-size: 11px;
  color: #9ca3af;
  background: #f9fafb;
  padding: 6px 8px;
  border-radius: 4px;
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.preview-action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

/* 提交历史样式 */
.commit-history {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 
    0 3px 10px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.no-commits {
  text-align: center;
  padding: 20px;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.no-commits i {
  font-size: 24px;
  opacity: 0.5;
}

.commit-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.commit-item {
  padding: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.commit-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.commit-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.commit-message {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.commit-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #9ca3af;
}

.commit-author {
  display: flex;
  align-items: center;
  gap: 4px;
}

.commit-hash {
  font-size: 10px;
  color: #6b7280;
  font-family: monospace;
  display: flex;
  align-items: center;
  gap: 4px;
}

.view-more-btn {
  margin-top: 8px;
  padding: 6px 10px;
  border: 1px dashed #d1d5db;
  background: transparent;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.view-more-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

/* 远程仓库样式 */
.remote-status {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 
    0 3px 10px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.remote-item {
  margin-bottom: 8px;
}

.remote-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
}

.remote-name {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
}

.remote-status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.remote-status-indicator.connected {
  background: #10b981;
}

.remote-actions {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.remote-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.remote-action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

/* 快速提交样式 */
.quick-commit {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 
    0 3px 10px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.commit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.commit-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  background: white;
  color: #374151;
}

.commit-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.commit-input::placeholder {
  color: #9ca3af;
}

.commit-char-count {
  text-align: right;
  font-size: 10px;
  color: #9ca3af;
}

.commit-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.commit-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #374151;
}

.commit-option input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 14px;
  height: 14px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.commit-option input[type="checkbox"]:checked + .checkmark {
  background: #3b82f6;
  border-color: #3b82f6;
}

.commit-option input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 10px;
  font-weight: bold;
}

.commit-actions {
  margin-top: 6px;
}

.commit-action-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.commit-action-btn.primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.commit-action-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(16, 185, 129, 0.4);
}

.commit-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* GitLab风格差异显示样式 */
.diff-container {
  margin-top: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.diff-header {
  background: #f1f3f4;
  padding: 8px 12px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
}

.diff-header i {
  color: #6b7280;
}

.diff-hint {
  color: #9ca3af;
  font-size: 10px;
  font-style: italic;
  margin-left: auto;
}

.diff-loading {
  padding: 20px;
  text-align: center;
  color: #6b7280;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.diff-content {
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.diff-content::-webkit-scrollbar {
  display: none;
}

.diff-lines {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 11px;
  line-height: 1.4;
}

.diff-line {
  display: flex;
  min-height: 18px;
  align-items: stretch;
}

.diff-line-number {
  background: #f6f8fa;
  border-right: 1px solid #e1e4e8;
  display: flex;
  flex-shrink: 0;
  width: 60px;
}

.line-num-old,
.line-num-new {
  width: 30px;
  padding: 1px 4px;
  text-align: right;
  color: #6b7280;
  font-size: 10px;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.line-num-old {
  border-right: 1px solid #e1e4e8;
}

.diff-line-content {
  flex: 1;
  display: flex;
  align-items: stretch;
  min-height: 18px;
}

.diff-prefix {
  width: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  user-select: none;
}

.diff-text {
  flex: 1;
  padding: 1px 4px;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
}

/* 新增行样式 - GitLab绿色 */
.diff-line-added {
  background-color: #e6ffed;
}

.diff-line-added .diff-line-number {
  background-color: #cdffd8;
}

.diff-line-added .line-num-new {
  background-color: #acf2bd;
  color: #0d7d32;
}

.diff-line-added .diff-prefix {
  background-color: #28a745;
  color: white;
}

.diff-line-added .diff-text {
  color: #0d7d32;
}

/* 删除行样式 - GitLab红色 */
.diff-line-removed {
  background-color: #ffeef0;
}

.diff-line-removed .diff-line-number {
  background-color: #ffdce0;
}

.diff-line-removed .line-num-old {
  background-color: #fdb8c0;
  color: #b91c1c;
}

.diff-line-removed .diff-prefix {
  background-color: #dc3545;
  color: white;
}

.diff-line-removed .diff-text {
  color: #b91c1c;
}

/* 上下文行样式 */
.diff-line-context .diff-prefix {
  color: #6b7280;
}

.diff-line-context .diff-text {
  color: #374151;
}

/* 头部信息样式 */
.diff-line-header {
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
}

.diff-line-header .diff-line-number {
  background-color: #e9ecef;
}

.diff-line-header .line-num-old,
.diff-line-header .line-num-new {
  background-color: #e9ecef;
  color: #6c757d;
}

.diff-line-header .diff-text {
  color: #495057;
  font-weight: 500;
  padding: 2px 8px;
}

/* 悬停效果 */
.diff-line:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.diff-line-added:hover {
  background-color: #d4f5da;
}

.diff-line-removed:hover {
  background-color: #fce8ea;
}

/* 响应式 */
@media (max-width: 1024px) {
  .git-sidebar {
    gap: 20px;
  }
  
  .repo-stats {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .diff-line-number {
    width: 50px;
  }
  
  .line-num-old,
  .line-num-new {
    width: 25px;
  }
  
  .diff-prefix {
    width: 14px;
  }
  
  .diff-lines {
    font-size: 10px;
  }
}
</style>
