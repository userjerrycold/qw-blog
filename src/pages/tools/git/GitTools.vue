<template>
  <div class="tools-container">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19C9 20.1 9.9 21 11 21C12.1 21 13 20.1 13 19C13 17.9 12.1 17 11 17C9.9 17 9 17.9 9 19Z" fill="currentColor"/>
              <path d="M15 9C15 10.1 15.9 11 17 11C18.1 11 19 10.1 19 9C19 7.9 18.1 7 17 7C15.9 7 15 7.9 15 9Z" fill="currentColor"/>
              <path d="M11 17C11 15.9 10.1 15 9 15C7.9 15 7 15.9 7 17C7 18.1 7.9 19 9 19C10.1 19 11 18.1 11 17Z" fill="currentColor"/>
              <path d="M17 11C18.1 11 19 10.1 19 9C19 7.9 18.1 7 17 7C15.9 7 15 7.9 15 9C15 10.1 15.9 11 17 11Z" fill="currentColor"/>
              <path d="M11 7C11 5.9 10.1 5 9 5C7.9 5 7 5.9 7 7C7 8.1 7.9 9 9 9C10.1 9 11 8.1 11 7Z" fill="currentColor"/>
              <path d="M9 15L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M11 17L17 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="header-info">
            <h1 class="page-title">Git 命令管理</h1>
            <p class="page-subtitle">强大的Git工作流管理工具</p>
          </div>
        </div>
        <button @click="router.push('/tools')" class="back-button modern-glass">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>返回工具</span>
        </button>
      </div>
    </header>

    <!-- 控制面板 -->
    <section class="control-panel">
      <div class="control-content">
        <!-- 搜索区域 -->
        <div class="search-section">
          <div class="search-wrapper">
            <div class="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              placeholder="搜索Git命令、描述或分类..."
              class="search-input modern-glass"
              @input="handleSearchInput"
            />
            <div class="search-actions">
              <button 
                class="filter-button" 
                :class="{ active: searchParams.isFavorite }"
                @click="searchParams.isFavorite = !searchParams.isFavorite; loadGitCommands()" 
                :title="searchParams.isFavorite ? '显示全部' : '仅显示收藏'"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" :fill="searchParams.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="refresh-button" @click="loadGitCommands()" title="刷新命令列表">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4V9H4.582M19.418 9H20V4H15M15 20H20V15M4 15V20H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 添加按钮 -->
        <button class="add-command-btn ultra-plus-btn" @click="addCommand" title="添加Git命令">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="command-section">

        <!-- Git命令列表 -->
        <div class="commands-container">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">正在加载Git命令...</p>
          </div>
          
          <div v-else-if="filteredGitCommands.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 19C9 20.1 9.9 21 11 21C12.1 21 13 20.1 13 19C13 17.9 12.1 17 11 17C9.9 17 9 17.9 9 19Z" fill="currentColor" opacity="0.3"/>
                <path d="M15 9C15 10.1 15.9 11 17 11C18.1 11 19 10.1 19 9C19 7.9 18.1 7 17 7C15.9 7 15 7.9 15 9Z" fill="currentColor" opacity="0.3"/>
                <path d="M9 15L15 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
              </svg>
            </div>
            <h3 class="empty-title">暂无Git命令</h3>
            <p class="empty-desc">开始创建您的第一个Git命令工作流</p>
            <button @click="addCommand" class="empty-action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              创建命令
            </button>
          </div>
          
          <div v-else class="command-grid">
            <article v-for="cmd in filteredGitCommands" :key="cmd.id" class="command-card modern-glass">
              <!-- 卡片头部 -->
              <header class="card-header">
                <div class="card-title-section">
                  <h3 class="card-title">{{ cmd.commandName }}</h3>
                  <div class="card-badges">
                    <span v-if="cmd.isComposite" class="badge badge-composite">组合</span>
                    <span class="badge badge-category">{{ getCategoryName(cmd.categoryCode) }}</span>
                  </div>
                </div>
                <div class="card-actions">
                  <button 
                    class="action-btn favorite-btn" 
                    :class="{ active: cmd.isFavorite }"
                    @click="toggleFavorite(cmd)"
                    :title="cmd.isFavorite ? '取消收藏' : '添加收藏'"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" :fill="cmd.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="action-btn edit-btn" @click="editCommand(cmd)" title="编辑命令">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20H17C18.1046 20 19 19.1046 19 18V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M17 3L21 7L12 16H8V12L17 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="action-btn delete-btn" @click="showDeleteConfirm(cmd)" title="删除命令">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </header>

              <!-- 卡片描述 -->
              <div v-if="cmd.description" class="card-description">
                {{ cmd.description }}
              </div>

              <!-- 统计信息 -->
              <div class="card-stats">
                <div class="stat-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ cmd.executionCount }} 次执行</span>
                </div>
                <div v-if="cmd.isComposite && cmd.subCommands" class="stat-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ cmd.subCommands.length }} 个步骤</span>
                </div>
              </div>

              <!-- 命令内容 -->
              <div class="card-content">
                <!-- 单个命令 -->
                <div v-if="!cmd.isComposite" class="single-command">
                  <div class="command-block">
                    <pre class="command-code">{{ cmd.commandContent }}</pre>
                    <button class="copy-button" @click="copyToClipboard(cmd.commandContent, cmd)" title="复制命令">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                        <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- 组合命令 -->
                <div v-else-if="cmd.subCommands && cmd.subCommands.length > 0" class="composite-command">
                  <div class="steps-container" :class="{ expanded: expandedCards.has(cmd.id) }">
                    <div 
                      v-for="(step, stepIndex) in cmd.subCommands" 
                      :key="`${cmd.id}-${stepIndex}`" 
                      class="step-item"
                      :class="{ 
                        hidden: !expandedCards.has(cmd.id) && stepIndex >= 2,
                        'fade-out': !expandedCards.has(cmd.id) && stepIndex === 2
                      }"
                    >
                      <div class="step-header">
                        <span class="step-number">{{ stepIndex + 1 }}</span>
                        <span class="step-title">{{ step.description }}</span>
                      </div>
                      <div class="command-block">
                        <pre class="command-code">{{ step.subCommandContent }}</pre>
                        <button class="copy-button" @click="copyToClipboard(step.subCommandContent, cmd)" title="复制命令">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                            <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" stroke-width="2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 卡片展开/收拢按钮 -->
              <div class="card-expand-footer">
                <button 
                  class="card-expand-btn"
                  @click="toggleCardExpansion(cmd.id)"
                  :title="expandedCards.has(cmd.id) ? '收拢卡片' : '展开卡片'"
                >
                  <span v-if="!expandedCards.has(cmd.id)">展开查看更多</span>
                  <span v-else>收拢卡片</span>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    :class="{ 'rotate-180': expandedCards.has(cmd.id) }"
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </article>
          </div>
        </div>

        <!-- 分页 -->
        <footer v-if="totalCommands > (searchParams.pageSize || 10)" class="pagination-footer">
          <div class="pagination-container">
            <button 
              class="pagination-btn modern-glass" 
              :disabled="(searchParams.page || 1) === 1"
              @click="if (searchParams.page) searchParams.page--; loadGitCommands()"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>上一页</span>
            </button>
            
            <div class="pagination-info">
              <span class="current-page">{{ searchParams.page || 1 }}</span>
              <span class="page-separator">/</span>
              <span class="total-pages">{{ Math.ceil(totalCommands / (searchParams.pageSize || 10)) }}</span>
            </div>
            
            <button 
              class="pagination-btn modern-glass" 
              :disabled="(searchParams.page || 1) >= Math.ceil(totalCommands / (searchParams.pageSize || 10))"
              @click="if (searchParams.page) searchParams.page++; loadGitCommands()"
            >
              <span>下一页</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </main>

    <!-- 添加/编辑命令的模态框 -->
    <div class="modal-overlay" :class="{ show: showAddCommandModal }" @click="closeModalOnOverlay">
      <div class="ultra-glass-modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditing ? '编辑Git命令' : '添加Git命令' }}</h2>
        </div>
        
        <div class="modal-content">
          <div class="form-section">
            <div class="form-item">
              <label>命令名称 <span class="text-red-500">*</span></label>
              <input v-model="currentCommand.commandName" placeholder="请输入命令名称" class="form-input glass-input" />
            </div>

            <div class="form-item">
              <label>分类 <span class="text-red-500">*</span></label>
              <select v-model="currentCommand.categoryCode" class="form-input glass-input">
                <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
              </select>
            </div>

            <div class="form-item">
              <label>描述</label>
              <input v-model="currentCommand.description" placeholder="请输入命令描述" class="form-input glass-input" />
            </div>

            <div class="form-item">
              <label>使用场景</label>
              <input v-model="currentCommand.usageScenario" placeholder="请输入使用场景" class="form-input glass-input" />
            </div>

            <div class="form-item">
              <div class="checkbox-container">
                <input type="checkbox" id="is-favorite" v-model="currentCommand.isFavorite" />
                <label for="is-favorite">收藏</label>
              </div>
            </div>

            <div class="form-item">
              <div class="checkbox-container">
                <input type="checkbox" id="is-composite" v-model="currentCommand.isComposite" />
                <label for="is-composite">组合命令（多个步骤）</label>
              </div>
            </div>

            <div class="step-container mt-4 glass-card">
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
                  class="form-input glass-input" 
                />
              </div>
              
              <div class="form-item">
                <label>{{ currentCommand.isComposite ? '步骤命令' : '命令内容' }} <span class="text-red-500">*</span></label>
                <textarea 
                  v-model="currentCommand.subCommands[currentStepIndex].subCommandContent" 
                  :placeholder="currentCommand.isComposite ? '请输入步骤命令，支持多行\n例如：\ngit add .\ngit commit -m &quot;update&quot;\ngit push' : '请输入命令内容，支持多行\n例如：\ngit status\ngit add .'"
                  class="form-textarea glass-input" 
                  rows="4"
                  @input="autoResizeTextarea"
                />
              </div>
            </div>

            <div v-if="currentCommand.isComposite" class="step-navigation">
              <button 
                class="nav-button glass-button" 
                :disabled="currentStepIndex === 0"
                @click="currentStepIndex--"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                上一步
              </button>
              
              <button 
                class="nav-button glass-button" 
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
              <button class="action-button add glass-button" @click="addStep">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                添加步骤
              </button>
              
              <button 
                v-if="currentCommand.subCommands.length > 1"
                class="action-button remove glass-button" 
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
            <button class="cancel-button glass-button" @click="showAddCommandModal = false">取消</button>
            <button class="save-button glass-button" @click="saveCommand">保存</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认模态框 -->
    <n-modal v-model:show="showDeleteModal" preset="dialog" title="确认删除" content="确定要删除这个命令吗？" positive-text="确定" negative-text="取消" @positive-click="confirmDelete" @negative-click="cancelDelete" class="ultra-glass-modal" />
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

// 卡片展开状态管理
const expandedCards = ref(new Set<number>())

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

// 自动调整文本框高度
function autoResizeTextarea(event: Event) {
  const target = event.target as HTMLTextAreaElement
  if (target) {
    target.style.height = 'auto'
    target.style.height = target.scrollHeight + 'px'
  }
}

// 切换卡片展开状态
function toggleCardExpansion(cardId: number) {
  if (expandedCards.value.has(cardId)) {
    expandedCards.value.delete(cardId)
  } else {
    expandedCards.value.add(cardId)
  }
}

// 点击遮罩层关闭弹窗
function closeModalOnOverlay(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    showAddCommandModal.value = false
  }
}
</script>

<style scoped>
/* ===== 全局容器和布局 - 纯白主题 ===== */
.tools-container {
  min-height: 100vh;
  background: #ffffff;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 全局滚动条隐藏 */
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

*::-webkit-scrollbar {
  display: none; /* WebKit */
}



/* ===== 页面头部 ===== */
.page-header {
  position: relative;
  z-index: 10;
  padding: 2rem 2rem 1rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.header-info {
  color: #1f2937;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1rem;
  margin: 0;
  opacity: 0.7;
  font-weight: 400;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* ===== 控制面板 ===== */
.control-panel {
  position: relative;
  z-index: 10;
  padding: 0 2rem 1rem;
}

.control-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.search-section {
  flex: 1;
  max-width: 600px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15), 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  color: rgba(107, 114, 128, 0.8);
  margin-right: 0.75rem;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 500;
}

.search-input::placeholder {
  color: rgba(107, 114, 128, 0.6);
}

.search-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 0.75rem;
}

.filter-button, .refresh-button {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: rgba(107, 114, 128, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-button:hover, .refresh-button:hover {
  background: #f9fafb;
  color: #374151;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.filter-button.active {
  background: #fef3c7;
  color: #f59e0b;
  border: 1px solid #fbbf24;
  box-shadow: 0 3px 8px rgba(245, 158, 11, 0.15);
}

.add-command-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: none;
  background: #3b82f6;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 12px rgba(59, 130, 246, 0.3);
}

.add-command-btn:hover {
  transform: translateY(-2px);
  background: #2563eb;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* ===== 超现代圆形+号按钮 ===== */
.ultra-plus-btn {
  width: 48px !important;
  height: 48px !important;
  border-radius: 50% !important;
  padding: 0 !important;
  justify-content: center !important;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%) !important;
  color: #ffffff !important;
  border: 2px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 
    0 8px 32px rgba(31, 41, 55, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.ultra-plus-btn:hover {
  transform: translateY(-3px) scale(1.05) !important;
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%) !important;
  box-shadow: 
    0 12px 40px rgba(31, 41, 55, 0.4),
    0 6px 20px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.ultra-plus-btn:active {
  transform: translateY(-1px) scale(1.02) !important;
}

.ultra-plus-btn svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ultra-plus-btn:hover svg {
  transform: rotate(90deg);
}

/* ===== 主内容区 ===== */
.main-content {
  position: relative;
  z-index: 10;
  flex: 1;
  padding: 1rem 2rem 2rem;
}

.command-section {
  max-width: 1400px;
  margin: 0 auto;
}

/* ===== 加载状态 ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #374151;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* ===== 空状态 ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #374151;
  text-align: center;
}

.empty-icon {
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.empty-desc {
  font-size: 1rem;
  margin: 0 0 2rem 0;
  opacity: 0.8;
}

.empty-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.25);
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.35);
}

/* ===== 命令网格 ===== */
.command-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

/* ===== 命令卡片 ===== */
.command-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  height: 400px; /* 固定高度 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.command-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: #d1d5db;
}

.command-card.expanded {
  height: auto;
  max-height: 80vh;
}

/* ===== 卡片头部 ===== */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-title-section {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-composite {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%);
  color: white;
}

.badge-category {
  background: rgba(107, 114, 128, 0.15);
  color: #374151;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: none;
  background: rgba(107, 114, 128, 0.1);
  color: rgba(107, 114, 128, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover {
  background: rgba(107, 114, 128, 0.2);
  color: #374151;
  transform: translateY(-1px);
}

.favorite-btn.active {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
}

.delete-btn:hover {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

/* ===== 卡片内容 ===== */
.card-description {
  color: rgba(107, 114, 128, 0.9);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(107, 114, 128, 0.8);
  font-size: 0.85rem;
  background: rgba(107, 114, 128, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

/* ===== 命令内容区域 ===== */
.card-content {
  position: relative;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-right: -8px;
}

.card-content::-webkit-scrollbar {
  width: 0;
}

.card-content {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* ===== 卡片展开按钮 ===== */
.card-expand-footer {
  padding-top: 1rem;
  border-top: 1px solid rgba(107, 114, 128, 0.2);
  margin-top: auto;
}

.card-expand-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  background: rgba(107, 114, 128, 0.1);
  color: rgba(107, 114, 128, 0.9);
  border-radius: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-expand-btn:hover {
  background: rgba(107, 114, 128, 0.2);
  color: #374151;
  transform: translateY(-1px);
}

.card-expand-btn svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-expand-btn svg.rotate-180 {
  transform: rotate(180deg);
}

.command-block {
  position: relative;
  background: rgba(243, 244, 246, 0.9);
  border: 1px solid rgba(209, 213, 219, 0.5);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.command-code {
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #374151;
  background: transparent;
  padding: 1rem 1rem 1rem 1rem;
  margin: 0;
  border: none;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.copy-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: rgba(107, 114, 128, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  border: 1px solid rgba(209, 213, 219, 0.5);
}

.command-block:hover .copy-button {
  opacity: 1;
}

.copy-button:hover {
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
  transform: scale(1.1);
}

/* ===== 组合命令 ===== */
.steps-container {
  max-height: 200px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.steps-container.expanded {
  max-height: none;
}

.step-item {
  margin-bottom: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-item.hidden {
  display: none;
}

.step-item.fade-out {
  opacity: 0.3;
  position: relative;
}

.step-item.fade-out::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.1));
  pointer-events: none;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  color: rgba(107, 114, 128, 0.9);
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-title {
  font-size: 0.9rem;
  font-weight: 500;
  flex: 1;
}


/* ===== 分页 ===== */
.pagination-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(107, 114, 128, 0.2);
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: none;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.pagination-btn:hover:not([disabled]) {
  transform: translateY(-1px);
}

.pagination-btn[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
}

.current-page {
  font-size: 1.25rem;
  font-weight: 700;
}

.page-separator {
  opacity: 0.6;
}

.total-pages {
  opacity: 0.8;
}

/* ===== 现代毛玻璃样式类 ===== */
.modern-glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-glass:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

/* ===== 表单样式 ===== */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-item label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.text-red-500 {
  color: #ef4444;
}

/* ===== 带阴影的输入框样式 ===== */
.glass-input {
  background: #ffffff;
  border: 1.5px solid rgba(15, 23, 42, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  color: #1f2937;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  box-shadow: 
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.glass-input::placeholder {
  color: #9ca3af;
}

.glass-input:focus {
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 
    0 0 0 3px rgba(99, 102, 241, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
  font-family: 'Fira Code', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
  line-height: 1.5;
}

/* ===== 美化下拉框 ===== */
select.glass-input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

/* ===== 复选框样式 ===== */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.checkbox-container input[type="checkbox"] {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #d1d5db;
  background: #ffffff;
  cursor: pointer;
  position: relative;
}

.checkbox-container input[type="checkbox"]:checked {
  background: #6366f1;
  border-color: #6366f1;
}

.checkbox-container label {
  color: #374151 !important;
  font-weight: 500 !important;
}

/* ===== 步骤容器 ===== */
.glass-card {
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  padding: 24px;
  margin-top: 16px;
  box-shadow: 
    0 1px 3px 0 rgba(0, 0, 0, 0.05),
    0 1px 2px 0 rgba(0, 0, 0, 0.04);
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.step-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.step-indicator {
  background: rgba(99, 102, 241, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #6366f1;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  gap: 1rem;
}

/* ===== 毛玻璃按钮样式 ===== */
.glass-button {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1.5px solid rgba(15, 23, 42, 0.1);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  outline: none;
}

.glass-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(15, 23, 42, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.glass-button:active:not(:disabled) {
  transform: translateY(0);
}

.glass-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.step-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== 特殊按钮颜色 ===== */
.add {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  color: #059669;
}

.add:hover {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.4);
}

.remove {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #dc2626;
}

.remove:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
}

/* ===== 底部按钮区 ===== */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(15, 23, 42, 0.1);
}

.cancel-button {
  background: rgba(248, 250, 252, 0.8);
  color: #6b7280;
}

.save-button {
  background: #6366f1;
  color: #ffffff;
  font-weight: 600;
  border-color: #6366f1;
}

.save-button:hover {
  background: #5855eb;
  border-color: #5855eb;
}

/* ===== 现代弹窗遮罩层 ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* ===== 纯白色弹窗主体 ===== */
.ultra-glass-modal {
  width: 600px;
  max-width: 90vw;
  max-height: 90vh;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  box-shadow: 
    0 32px 64px -12px rgba(0, 0, 0, 0.15),
    0 20px 25px -5px rgba(0, 0, 0, 0.08),
    0 8px 10px -6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  transform: scale(0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-overlay.show .ultra-glass-modal {
  transform: scale(1);
}

/* ===== 弹窗头部 ===== */
.modal-header {
  padding: 28px 32px 0;
  background: rgba(248, 250, 252, 0.8);
  border-bottom: 1px solid rgba(15, 23, 42, 0.1);
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 28px;
  letter-spacing: -0.025em;
}

/* ===== 弹窗内容区 ===== */
.modal-content {
  padding: 32px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.05);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(15, 23, 42, 0.2);
  border-radius: 3px;
}

/* ===== 响应式设计 ===== */
@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem 1rem 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .control-panel {
    padding: 0 1rem 1rem;
  }
  
  .control-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .main-content {
    padding: 1rem 1rem 2rem;
  }
  
  .command-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .command-card {
    height: auto;
    max-height: none;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .search-wrapper {
    padding: 0.5rem 0.75rem;
  }
  
  .command-card {
    padding: 1rem;
    border-radius: 16px;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .command-code {
    font-size: 0.8rem;
    padding: 0.75rem;
  }
}
</style> 