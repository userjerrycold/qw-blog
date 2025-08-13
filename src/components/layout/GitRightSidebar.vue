<template>
  <aside class="git-sidebar">
    <!-- 最近使用的仓库 -->
    <div class="sidebar-section" v-if="recentRepos.length > 0">
      <h3 class="section-title">
        <i class="fas fa-history"></i>
        最近使用的仓库
      </h3>
      <div class="recent-repos">
        <div class="recent-repos-container">
          <div class="recent-repos-list" ref="recentReposScrollContainer">
            <div 
              v-for="repo in displayedRecentRepos" 
              :key="repo.path"
              class="recent-repo-item"
              @click="handleLoadFromRecentRepo(repo)"
              :title="repo.path"
            >
              <div class="repo-info">
                <i class="fas fa-folder-open repo-icon"></i>
                <span class="repo-name">{{ repo.name }}</span>
              </div>
              <span class="repo-time">{{ formatCommitTime(repo.lastAccess) }}</span>
            </div>
          </div>
          <!-- 滚动控制按钮 -->
          <div class="repos-scroll-controls" v-if="recentRepos.length > 3">
            <button 
              class="scroll-btn scroll-up" 
              @click="scrollRecentRepos('up')"
              :disabled="recentReposStartIndex === 0"
            >
              <i class="fas fa-chevron-up"></i>
            </button>
            <button 
              class="scroll-btn scroll-down" 
              @click="scrollRecentRepos('down')"
              :disabled="recentReposStartIndex + 3 >= recentRepos.length"
            >
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速提交区域 -->
    <div class="sidebar-section" v-if="currentRepo">
      <h3 class="section-title">
        <i class="fas fa-rocket"></i>
        快速提交
      </h3>
      <div class="quick-commit">
        <!-- 当有变更时显示提交表单 -->
        <div class="commit-form" v-if="props.hasChanges">
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
            <button 
              class="commit-action-btn primary" 
              @click="executeCommit" 
              :disabled="!commitMessage.trim() || props.isCommitting || props.isPushing"
            >
              <i class="fas fa-spinner fa-spin" v-if="props.isCommitting || props.isPushing"></i>
              <i class="fas fa-check" v-else></i>
              <span v-if="props.isCommitting">正在提交...</span>
              <span v-else-if="props.isPushing">正在推送...</span>
              <span v-else>{{ pushAfterCommit ? '提交并推送' : '提交' }}</span>
            </button>
          </div>
        </div>
        
        <!-- 当没有变更时显示提示信息 -->
        <div class="no-changes-prompt" v-else>
          <div class="no-changes-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="no-changes-title">没有需要提交的更改</div>
          <div class="no-changes-description">
            工作目录是干净的，所有更改都已提交
          </div>
          <div class="no-changes-suggestions">
            <div class="suggestion-tip">
              <i class="fas fa-lightbulb"></i>
              <span>修改文件后可在此进行快速提交</span>
            </div>
          </div>
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
          <button class="branch-action-btn" @click="showCreateBranchModal = true" title="创建分支">
            <i class="fas fa-plus"></i>
            新建分支
          </button>
          <button class="branch-action-btn" @click="showSwitchBranchModal = true" title="切换分支">
            <i class="fas fa-exchange-alt"></i>
            切换分支
          </button>
          <button class="branch-action-btn backup-btn" @click="showBackupBranchModal = true" title="备份分支">
            <i class="fas fa-save"></i>
            备份分支
          </button>
        </div>
      </div>
    </div>

    <!-- 文件预览 -->
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
            <button class="preview-action-btn" @click="handleStageFile" :title="selectedFile.staged ? '取消暂存' : '添加到暂存'">
              <i class="fas fa-plus" v-if="!selectedFile.staged"></i>
              <i class="fas fa-minus" v-else></i>
              {{ selectedFile.staged ? '取消暂存' : '暂存' }}
            </button>
          </div>
          
          <div class="preview-hint" v-if="['MODIFIED', 'ADDED', 'DELETED', 'UNTRACKED'].includes(selectedFile.status)">
            <i class="fas fa-info-circle"></i>
            <span>双击文件查看差异详情</span>
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

    <!-- 标签管理 -->
    <div class="sidebar-section" v-if="currentRepo && recentTags.length > 0">
      <h3 class="section-title">
        <i class="fas fa-tag"></i>
        最近标签
      </h3>
      <div class="recent-tags">
        <div class="tag-list">
          <div 
            v-for="tag in recentTags" 
            :key="tag"
            class="tag-item"
          >
            <i class="fas fa-tag tag-icon"></i>
            <span class="tag-name">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

  </aside>
  
  <!-- 创建分支弹窗 - 美化版 -->
  <n-modal v-model:show="showCreateBranchModal" :mask-closable="false" class="git-branch-modal">
    <div class="branch-modal-container">
      <div class="branch-modal-inner">
        <div class="branch-modal-header">
          <div class="modal-icon create-icon">
            <i class="fas fa-code-branch"></i>
          </div>
          <div class="modal-title-section">
            <h3 class="modal-title">创建新分支</h3>
            <p class="modal-subtitle">基于现有分支或标签创建新的开发分支</p>
          </div>
          <n-button quaternary circle @click="showCreateBranchModal = false" class="close-button">
            <n-icon>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </n-icon>
          </n-button>
        </div>
        
        <div class="branch-modal-content">
          <div class="form-group">
            <label class="form-label">分支名称 <span class="required">*</span></label>
            <n-input 
              v-model:value="newBranchName" 
              placeholder="请输入新分支名称 (例如: feature/new-feature)"
              class="form-input"
              size="large"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">基于分支/标签</label>
            <n-select 
              v-model:value="createBranchBase" 
              :options="branchBaseOptions" 
              placeholder="选择基于哪个分支或标签创建 (留空则基于当前分支)"
              class="form-input"
              size="large"
              filterable
              clearable
              :loading="loadingBranchData"
            />
            <div class="form-hint" v-if="props.currentRepo?.currentBranch">
              <i class="fas fa-info-circle"></i>
              <span>当前分支: <strong>{{ props.currentRepo.currentBranch }}</strong></span>
            </div>
          </div>
        </div>
        
        <div class="branch-modal-footer">
          <n-button size="large" @click="showCreateBranchModal = false" class="cancel-btn">取消</n-button>
          <n-button 
            type="primary" 
            size="large"
            @click="executeCreateBranch" 
            :disabled="!newBranchName.trim()"
            class="primary-btn"
          >
            <i class="fas fa-plus"></i>
            创建分支
          </n-button>
        </div>
      </div>
    </div>
  </n-modal>
  
  <!-- 切换分支弹窗 - 美化版 -->
  <n-modal v-model:show="showSwitchBranchModal" :mask-closable="false" class="git-branch-modal">
    <div class="branch-modal-container">
      <div class="branch-modal-inner">
        <div class="branch-modal-header">
          <div class="modal-icon switch-icon">
            <i class="fas fa-exchange-alt"></i>
          </div>
          <div class="modal-title-section">
            <h3 class="modal-title">切换分支</h3>
            <p class="modal-subtitle">选择要切换到的目标分支</p>
          </div>
          <n-button quaternary circle @click="showSwitchBranchModal = false" class="close-button">
            <n-icon>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </n-icon>
          </n-button>
        </div>
        
        <div class="branch-modal-content">
          <div class="form-group">
            <label class="form-label">目标分支 <span class="required">*</span></label>
            <n-select 
              v-model:value="targetBranch" 
              :options="branchOptions" 
              placeholder="选择要切换的分支"
              class="form-input"
              size="large"
              filterable
              :loading="loadingBranchData"
            />
            <div class="form-hint" v-if="props.currentRepo?.currentBranch">
              <i class="fas fa-info-circle"></i>
              <span>当前分支: <strong>{{ props.currentRepo.currentBranch }}</strong></span>
            </div>
          </div>
          
          <div class="branch-switch-warning" v-if="targetBranch">
            <i class="fas fa-exclamation-triangle"></i>
            <div class="warning-content">
              <p><strong>注意:</strong> 切换分支前请确保当前分支的更改已提交</p>
              <p>未提交的更改可能会丢失或产生冲突</p>
            </div>
          </div>
        </div>
        
        <div class="branch-modal-footer">
          <n-button size="large" @click="showSwitchBranchModal = false" class="cancel-btn">取消</n-button>
          <n-button 
            type="primary" 
            size="large"
            @click="executeSwitchBranch" 
            :disabled="!targetBranch"
            class="primary-btn"
          >
            <i class="fas fa-exchange-alt"></i>
            切换分支
          </n-button>
        </div>
      </div>
    </div>
  </n-modal>
  
  <!-- 备份分支弹窗 - 新增 -->
  <n-modal v-model:show="showBackupBranchModal" :mask-closable="false" class="git-branch-modal">
    <div class="branch-modal-container">
      <div class="branch-modal-inner">
        <div class="branch-modal-header">
          <div class="modal-icon backup-icon">
            <i class="fas fa-save"></i>
          </div>
          <div class="modal-title-section">
            <h3 class="modal-title">备份分支</h3>
            <p class="modal-subtitle">为当前分支创建备份副本</p>
          </div>
          <n-button quaternary circle @click="showBackupBranchModal = false" class="close-button">
            <n-icon>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </n-icon>
          </n-button>
        </div>
        
        <div class="branch-modal-content">
          <div class="current-branch-info">
            <i class="fas fa-code-branch"></i>
            <div class="branch-info-content">
              <span class="info-label">当前分支:</span>
              <span class="info-value">{{ props.currentRepo?.currentBranch }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">备份分支名称 <span class="required">*</span></label>
            <div class="backup-name-container">
              <n-input 
                v-model:value="backupBranchName" 
                placeholder="备份分支名称"
                class="form-input"
                size="large"
              />
              <button 
                class="auto-generate-btn" 
                @click="generateBackupBranchName"
                type="button"
                title="自动生成备份名称"
              >
                <i class="fas fa-magic"></i>
                自动生成
              </button>
            </div>
          </div>
          
          <div class="backup-explanation">
            <i class="fas fa-info-circle"></i>
            <div class="explanation-content">
              <h4>备份说明</h4>
              <p>备份会创建当前分支的完整副本，包含所有提交历史</p>
              <p>备份完成后会自动切换回当前分支</p>
            </div>
          </div>
        </div>
        
        <div class="branch-modal-footer">
          <n-button size="large" @click="showBackupBranchModal = false" class="cancel-btn">取消</n-button>
          <n-button 
            type="primary" 
            size="large"
            @click="executeBackupBranch" 
            :disabled="!backupBranchName.trim()"
            class="primary-btn backup-primary"
          >
            <i class="fas fa-save"></i>
            创建备份
          </n-button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NModal, NButton, NIcon, NInput, NSelect } from 'naive-ui'
import { useGlobalNotification } from '@/services/notification'
import { gitService } from '@/services/gitService'

// 初始化通知服务
const notification = useGlobalNotification()


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

// 最近仓库接口
interface RecentRepo {
  path: string
  name: string
  lastAccess: number
}

// Props定义
const props = defineProps<{
  currentRepo: GitRepo | null
  selectedFile: GitFile | null
  recentCommits: GitCommit[]
  recentRepos: RecentRepo[]
  recentTags: string[]
  isCommitting?: boolean
  isPushing?: boolean
  hasChanges?: boolean
}>()

// Emits定义  
const emit = defineEmits<{
  'commit': [data: { message: string; files?: string[]; pushAfterCommit?: boolean }]
  'load-repo': [repo: RecentRepo]
  'view-commit': [commit: GitCommit]
}>()

// 响应式状态
const commitMessage = ref('')
const stageAllFiles = ref(true)
const pushAfterCommit = ref(false)

// 最近仓库滑动相关
const recentReposStartIndex = ref(0)
const recentReposScrollContainer = ref<HTMLElement>()

// 分支管理相关
const showCreateBranchModal = ref(false)
const showSwitchBranchModal = ref(false)
const showBackupBranchModal = ref(false)
const newBranchName = ref('')
const createBranchBase = ref('')
const targetBranch = ref('')
const backupBranchName = ref('')
const branches = ref<string[]>([])
const tags = ref<string[]>([])
const loadingBranchData = ref(false)

// 计算属性
const displayedRecentRepos = computed(() => {
  return props.recentRepos.slice(recentReposStartIndex.value, recentReposStartIndex.value + 3)
})

const branchBaseOptions = computed(() => {
  const options: Array<{ label: string; value: string; type: string }> = []
  
  // 添加分支选项
  branches.value.forEach(branch => {
    options.push({
      label: branch,
      value: branch,
      type: 'branch'
    })
  })
  
  // 添加标签选项
  tags.value.forEach(tag => {
    options.push({
      label: `标签: ${tag}`,
      value: tag,
      type: 'tag'
    })
  })
  
  return options
})

const branchOptions = computed(() => {
  return branches.value
    .filter(branch => branch !== props.currentRepo?.currentBranch)
    .map(branch => ({
      label: branch,
      value: branch
    })) as Array<{ label: string; value: string }>
})





// 滚动最近仓库
function scrollRecentRepos(direction: 'up' | 'down'): void {
  if (direction === 'up' && recentReposStartIndex.value > 0) {
    recentReposStartIndex.value--
  } else if (direction === 'down' && recentReposStartIndex.value + 3 < props.recentRepos.length) {
    recentReposStartIndex.value++
  }
}

// 分支管理
async function loadBranchesAndTags(): Promise<void> {
  if (!props.currentRepo || loadingBranchData.value) return
  
  loadingBranchData.value = true
  try {
    // 并行获取本地分支、远程分支和标签
    const [localBranches, remoteBranches, tagList] = await Promise.all([
      gitService.getBranches(props.currentRepo.path),
      gitService.getRemoteBranches(props.currentRepo.path).catch(() => []),
      gitService.getTags(props.currentRepo.path).catch(() => [])
    ])
    
    // 合并本地和远程分支，去重
    const allBranches = new Set([...localBranches, ...remoteBranches])
    branches.value = Array.from(allBranches).sort()
    tags.value = tagList
    
    console.log('✅ 分支和标签加载完成:', { 
      branches: branches.value.length, 
      tags: tags.value.length 
    })
  } catch (error: any) {
    console.warn('加载分支和标签列表失败:', error.message)
    notification.error(`加载分支列表失败: ${error.message}`)
  } finally {
    loadingBranchData.value = false
  }
}

async function executeCreateBranch(): Promise<void> {
  if (!props.currentRepo || !newBranchName.value.trim()) return
  
  try {
    // 如果基于标签创建，先checkout到标签，再创建分支
    if (createBranchBase.value && tags.value.includes(createBranchBase.value)) {
      await gitService.executeGitCommand(`git checkout ${createBranchBase.value}`, props.currentRepo.path)
      await gitService.createBranch(props.currentRepo.path, newBranchName.value.trim())
    } else if (createBranchBase.value) {
      // 基于分支创建
      await gitService.executeGitCommand(`git checkout -b ${newBranchName.value.trim()} ${createBranchBase.value}`, props.currentRepo.path)
    } else {
      // 基于当前分支创建
      await gitService.createBranch(props.currentRepo.path, newBranchName.value.trim())
    }
    
    notification.success(`分支 "${newBranchName.value}" 创建成功`)
    showCreateBranchModal.value = false
    newBranchName.value = ''
    createBranchBase.value = ''
    
    // 刷新分支列表
    await loadBranchesAndTags()
    
  } catch (error: any) {
    notification.error(`创建分支失败: ${error.message}`)
  }
}

async function executeSwitchBranch(): Promise<void> {
  if (!props.currentRepo || !targetBranch.value) return
  
  try {
    await gitService.switchBranch(props.currentRepo.path, targetBranch.value)
    notification.success(`已切换到分支 "${targetBranch.value}"`)
    showSwitchBranchModal.value = false
    targetBranch.value = ''
    
    // 通知父组件刷新
    window.location.reload() // 简单的刷新方式，实际应该通过事件通知
    
  } catch (error: any) {
    notification.error(`切换分支失败: ${error.message}`)
  }
}

// 执行备份分支
async function executeBackupBranch(): Promise<void> {
  if (!props.currentRepo || !backupBranchName.value.trim()) return
  
  const currentBranch = props.currentRepo.currentBranch
  const backupName = backupBranchName.value.trim()
  
  try {
    // 检查分支名是否已存在
    if (branches.value.includes(backupName)) {
      notification.error(`分支 "${backupName}" 已存在，请使用其他名称`)
      return
    }
    
    // 创建备份分支
    await gitService.executeGitCommand(`git checkout -b ${backupName}`, props.currentRepo.path)
    
    // 切换回原分支
    await gitService.switchBranch(props.currentRepo.path, currentBranch)
    
    notification.success(`分支 "${currentBranch}" 已备份为 "${backupName}"`)
    showBackupBranchModal.value = false
    backupBranchName.value = ''
    
    // 刷新分支列表
    await loadBranchesAndTags()
    
  } catch (error: any) {
    notification.error(`备份分支失败: ${error.message}`)
  }
}

// 生成备份分支名称
function generateBackupBranchName(): void {
  if (!props.currentRepo) return
  
  const currentBranch = props.currentRepo.currentBranch
  const now = new Date()
  const timestamp = now.toISOString().slice(0, 19).replace(/[:T]/g, '-')
  
  backupBranchName.value = `backup/${currentBranch}-${timestamp}`
}

// 文件操作
function handleStageFile(): void {
  if (props.selectedFile) {
    const action = props.selectedFile.staged ? '取消暂存' : '暂存'
    notification.info(`${action}文件: ${props.selectedFile.name}`)
  }
}

// 提交相关
function handleViewCommit(commit: GitCommit): void {
  emit('view-commit', commit)
}

function handleViewAllCommits(): void {
  notification.info('查看所有提交历史')
}

function executeCommit(): void {
  if (!commitMessage.value.trim()) {
    notification.error('请输入提交信息')
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

// 最近仓库管理
function handleLoadFromRecentRepo(repo: RecentRepo): void {
  emit('load-repo', repo)
}

// 远程仓库操作
function handleFetch(): void {
  notification.info('获取远程更新功能开发中...')
}

function handleSync(): void {
  notification.info('同步功能开发中...')
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
  // 加载分支和标签列表
  if (props.currentRepo) {
    loadBranchesAndTags()
  }
})

// 监听currentRepo变化
computed(() => {
  if (props.currentRepo) {
    loadBranchesAndTags()
  }
})

// 监听弹窗打开，加载分支数据
computed(() => {
  if ((showCreateBranchModal.value || showSwitchBranchModal.value || showBackupBranchModal.value) && props.currentRepo) {
    loadBranchesAndTags()
  }
})

// 监听备份弹窗打开，自动生成备份名称
computed(() => {
  if (showBackupBranchModal.value && props.currentRepo && !backupBranchName.value) {
    generateBackupBranchName()
  }
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

.branch-action-btn.backup-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

.branch-action-btn.backup-btn:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(245, 158, 11, 0.4);
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

/* 最近仓库样式 */
.recent-repos {
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

.recent-repos-container {
  position: relative;
}

.recent-repos-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.3s ease;
}

.repos-scroll-controls {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
}

.scroll-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 10px;
}

.scroll-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.scroll-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.recent-repo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(230, 230, 230, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.recent-repo-item:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
}

.recent-repo-item .repo-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.recent-repo-item .repo-icon {
  color: #10b981;
  font-size: 12px;
  flex-shrink: 0;
}

.recent-repo-item .repo-name {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-repo-item .repo-time {
  font-size: 10px;
  color: #999;
  flex-shrink: 0;
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

/* 无变更提示样式 */
.no-changes-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 16px;
  gap: 12px;
}

.no-changes-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  margin-bottom: 8px;
}

.no-changes-icon i {
  font-size: 24px;
  color: white;
}

.no-changes-title {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.no-changes-description {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 16px;
}

.no-changes-suggestions {
  width: 100%;
}

.suggestion-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  font-size: 12px;
  color: #4b5563;
  font-weight: 500;
}

.suggestion-tip i {
  color: #3b82f6;
  font-size: 14px;
  flex-shrink: 0;
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

/* 预览提示样式 */
.preview-hint {
  margin-top: 10px;
  padding: 8px 10px;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #3b82f6;
}

.preview-hint i {
  color: #3b82f6;
  font-size: 10px;
}



/* 美化分支弹窗样式 */
.git-branch-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.git-branch-modal :deep(.n-modal) {
  width: auto !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.branch-modal-container {
  position: relative;
  margin: 0 auto;
  width: 520px;
  max-width: 90vw;
}

.branch-modal-inner {
  background: white;
  border-radius: 16px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.branch-modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 24px 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  position: relative;
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-icon.create-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.modal-icon.switch-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.modal-icon.backup-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.modal-icon i {
  font-size: 24px;
  color: white;
}

.modal-title-section {
  flex: 1;
}

.modal-title {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.modal-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  color: #9ca3af;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #374151;
}

.branch-modal-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.form-input {
  width: 100%;
}

.form-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  color: #0369a1;
  font-size: 12px;
  margin-top: 4px;
}

.form-hint i {
  color: #0284c7;
  font-size: 11px;
}

.current-branch-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.current-branch-info i {
  color: #3b82f6;
  font-size: 16px;
}

.branch-info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.backup-name-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.auto-generate-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.auto-generate-btn:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  transform: translateY(-1px);
}

.backup-explanation {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  color: #92400e;
}

.backup-explanation i {
  color: #d97706;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.explanation-content h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #78350f;
}

.explanation-content p {
  margin: 0 0 4px 0;
  font-size: 13px;
  line-height: 1.4;
}

.explanation-content p:last-child {
  margin-bottom: 0;
}

.branch-switch-warning {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #991b1b;
}

.branch-switch-warning i {
  color: #dc2626;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.warning-content p {
  margin: 0 0 6px 0;
  font-size: 13px;
  line-height: 1.4;
}

.warning-content p:last-child {
  margin-bottom: 0;
}

.branch-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px 24px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn {
  min-width: 80px;
  color: #6b7280 !important;
  border-color: #d1d5db !important;
}

.cancel-btn:hover {
  color: #374151 !important;
  border-color: #9ca3af !important;
}

.primary-btn {
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  border-color: #10b981 !important;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.primary-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(16, 185, 129, 0.4);
}

.primary-btn.backup-primary {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
  border-color: #f59e0b !important;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

.primary-btn.backup-primary:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%) !important;
  box-shadow: 0 3px 6px rgba(245, 158, 11, 0.4);
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
  
  /* 弹窗响应式 */
  .branch-modal-container {
    width: 95vw;
    max-width: none;
  }
  
  .branch-modal-header {
    padding: 20px 20px 16px 20px;
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .modal-icon {
    width: 40px;
    height: 40px;
  }
  
  .modal-icon i {
    font-size: 20px;
  }
  
  .modal-title {
    font-size: 18px;
  }
  
  .modal-subtitle {
    font-size: 13px;
  }
  
  .branch-modal-content {
    padding: 20px;
    gap: 16px;
  }
  
  .backup-name-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .auto-generate-btn {
    width: 100%;
    justify-content: center;
  }
  
  .branch-modal-footer {
    flex-direction: column;
    gap: 8px;
    padding: 16px 20px 20px 20px;
  }
  
  .cancel-btn,
  .primary-btn {
    width: 100%;
    min-width: unset;
  }
}
</style>
