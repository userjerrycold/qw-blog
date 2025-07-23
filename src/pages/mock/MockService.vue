<template>
  <PageLayout :rightSidebar="MockRightSidebar" @submit="handleSubmitFromSidebar">
    <div class="mock-service-container">
      <!-- 页面头部 -->
      <div class="header-container">
        <div>
          <h1 class="page-title">Mock Service</h1>
          <p class="page-subtitle">配置接口，模拟数据响应</p>
        </div>
      </div>

      <!-- 接口列表 -->
      <n-card class="interface-list-card">
        <template #header>
          <div class="list-header">
            <h2 class="list-title">接口列表</h2>
            <div class="list-actions">
              <n-input
                v-model:value="searchQuery"
                placeholder="搜索接口路径..."
                class="search-input"
                round
                clearable
              >
                <template #prefix>
                  <n-icon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                    </svg>
                  </n-icon>
                </template>
              </n-input>
              <n-select
                v-model:value="categoryFilter"
                placeholder="分类"
                :options="categoryOptions"
                style="width: 120px"
                clearable
                class="category-filter"
              />

              <n-button quaternary size="small" @click="refreshList">
                <template #icon>
                  <n-icon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
                    </svg>
                  </n-icon>
                </template>
                刷新
              </n-button>
            </div>
          </div>
        </template>

        <n-data-table
          :columns="columns"
          :data="filteredMockList"
          :pagination="pagination"
          :bordered="false"
          :row-key="rowKey"
          :row-props="rowProps"
          :expanded-row-keys="expandedRowKeys"
          @update:expanded-row-keys="handleExpandChange"
          class="interface-table"
          virtual-scroll
          empty-text="暂无接口配置"
        />


      </n-card>
      
      <!-- 操作成功提示 -->
      <n-modal v-model:show="showSuccessModal" preset="card" title="接口创建成功" class="success-modal">
        <div class="success-content">
          <n-result status="success" title="接口已成功创建" description="您可以通过以下地址访问该接口">
            <template #footer>
              <div class="mock-url-container">
                <div class="mock-url">{{ currentMockUrl }}</div>
                <n-button size="small" type="primary" @click="copyToClipboard(currentMockUrl)">
                  <template #icon>
                    <n-icon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17M8 5C8 6.10457 8.89543 7 10 7H12C13.1046 7 14 6.10457 14 5M8 5C8 3.89543 8.89543 3 10 3H12C13.1046 3 14 3.89543 14 5M14 5H16C17.1046 5 18 5.89543 18 7V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </n-icon>
                  </template>
                  复制
                </n-button>
              </div>
              <div class="qrcode-container">
                <canvas ref="qrcodeContainer"></canvas>
              </div>
            </template>
          </n-result>
        </div>
      </n-modal>
      
      <!-- 编辑接口弹窗 -->
      <n-modal 
        v-model:show="showEditModal" 
        preset="dialog" 
        class="edit-modal-pro" 
        :show-icon="false"
        style="width: 1100px; max-width: 98vw;"
      >
        <div class="modal-container">
          <!-- 移除弹窗头部 -->

          <!-- 双栏内容区域 -->
          <div class="modal-body-pro">
            <n-form ref="editFormRef" :model="editForm" :rules="editRules" class="edit-form-pro">
              <!-- 左侧配置区域 -->
              <div class="left-column">
                <div class="section-header">
                  <n-icon class="section-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg></n-icon>
                  <h4>接口配置</h4>
                </div>

                <!-- 接口路径 -->
                <n-form-item label="接口路径" path="endpoint">
                  <div class="endpoint-preview-pro">
                    <div class="endpoint-input-icon">
                      <n-icon><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14c1.1 0 2-.9 2-2V6a2 2 0 00-2-2zm.5 14c0 .28-.22.5-.5.5H5c-.28 0-.5-.22-.5-.5V6c0-.28.22-.5.5-.5h14c.28 0 .5.22.5.5v12zM7 13h2v2H7zm0-7h10v2H7zm3 4h7v2h-7zm0 4h4v2h-4z" fill="currentColor"/></svg></n-icon>
                    </div>
                    <div class="endpoint-content">
                      <div class="endpoint-url">
                        <span class="endpoint-base">http://10.215.211.31:9090</span>
                        <span class="endpoint-path">{{ editForm.endpoint.startsWith('/') ? '' : '/' }}{{ editForm.endpoint }}</span>
                      </div>
                    </div>
                  </div>
                </n-form-item>
                
                <!-- 分类选择 -->
                <n-form-item label="接口分类" path="category">
                  <div class="input-wrapper category-wrapper">
                    <div class="input-icon">
                      <n-icon><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z" fill="currentColor"/></svg></n-icon>
                    </div>
                    <n-select
                      v-model:value="editForm.category"
                      :options="categoryOptions"
                      placeholder="选择分类"
                      class="category-select-pro"
                    />
                  </div>
                </n-form-item>
                
                <!-- 超时时间 -->
                <n-form-item label="超时时间" path="timeout">
                  <div class="input-wrapper">
                    <div class="input-icon">
                      <n-icon><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/></svg></n-icon>
                    </div>
                    <n-input-number
                      v-model:value="editForm.timeout"
                      class="timeout-input-pro"
                      :min="0"
                      :max="10000"
                      placeholder="超时时间"
                    >
                      <template #suffix>
                        <span class="input-suffix">毫秒</span>
                      </template>
                    </n-input-number>
                  </div>
                </n-form-item>
                

              </div>
              
              <!-- 右侧响应数据编辑区 -->
              <div class="right-column">
                <div class="section-header">
                  <n-icon class="section-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/></svg></n-icon>
                  <h4>响应数据</h4>
                  
                  <!-- 添加JSON/TXT切换开关 -->
                  <div class="response-type-switch">
                    <div 
                      class="switch-option" 
                      :class="{ active: responseType === 'json' }" 
                      @click="setResponseType('json')"
                    >
                      JSON
                    </div>
                    <div 
                      class="switch-option" 
                      :class="{ active: responseType === 'text' }" 
                      @click="setResponseType('text')"
                    >
                      TXT
                    </div>
                  </div>
                </div>

                <n-form-item path="response" class="editor-form-item">
                  <!-- JSON编辑器 -->
                  <div v-if="responseType === 'json'" class="editor-container-pro">
                    <!-- 编辑器工具栏 -->
                    <div class="editor-toolbar">
                      <div class="editor-status-pro" :class="{ 'editor-status-error': jsonEditError }">
                        <div class="status-dot-pro" :class="{ 'status-dot-error': jsonEditError }"></div>
                        {{ jsonEditError ? '格式错误' : 'JSON格式正确' }}
                      </div>
                      <div class="editor-actions-pro">
                        <n-tooltip trigger="hover" placement="top">
                          <template #trigger>
                            <n-button secondary size="small" @click="formatEditJsonResponse" :disabled="!!jsonEditError">
                              <template #icon>
                                <n-icon><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" fill="currentColor"/></svg></n-icon>
                              </template>
                              格式化
                            </n-button>
                          </template>
                          格式化JSON数据
                        </n-tooltip>
                        
                        <n-tooltip trigger="hover" placement="top">
                          <template #trigger>
                            <n-button secondary size="small" @click="minifyEditJsonResponse" :disabled="!!jsonEditError">
                              <template #icon>
                                <n-icon><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19.89 10.105C19.9697 10.1842 20.0097 10.2899 20 10.4V17.5C20 19.433 18.433 21 16.5 21H7.5C5.567 21 4 19.433 4 17.5V6.5C4 4.567 5.567 3 7.5 3H16.5C18.433 3 20 4.567 20 6.5V6.6C20.0097 6.71009 19.9697 6.81575 19.89 6.895L15.5 11.295C15.3946 11.4004 15.2516 11.4602 15.1 11.46C14.9484 11.4598 14.8054 11.3996 14.7 11.294L12.5 9.095L10.294 11.3C10.1889 11.4058 10.0457 11.4663 9.894 11.4666C9.74228 11.4669 9.59879 11.407 9.493 11.302L9.489 11.298L8.995 10.804L8.989 10.798C8.88583 10.6916 8.82669 10.5499 8.8266 10.4008C8.82651 10.2516 8.88547 10.1098 8.989 10.0034L8.995 9.997L11.202 7.79L11.208 7.784C11.3144 7.67839 11.456 7.61925 11.605 7.61916C11.7541 7.61906 11.8958 7.67803 12.002 7.784L12.008 7.79L14.2 10L17.982 6.217L17.988 6.211C18.0947 6.10437 18.2366 6.04524 18.386 6.04516C18.5353 6.04507 18.6773 6.104 18.784 6.21L19.89 10.105Z" fill="currentColor"/></svg></n-icon>
                              </template>
                              压缩
                            </n-button>
                          </template>
                          压缩JSON数据
                        </n-tooltip>
                        
                        <n-tooltip trigger="hover" placement="top">
                          <template #trigger>
                            <n-button secondary size="small" @click="generateEditSampleJson">
                              <template #icon>
                                <n-icon><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4h2v4zm0-6h-2V7h2v4z" fill="currentColor"/></svg></n-icon>
                              </template>
                              生成示例
                            </n-button>
                          </template>
                          生成示例JSON数据
                        </n-tooltip>
                      </div>
                    </div>
                    
                    <!-- Monaco 编辑器 -->
                    <monaco-editor
                      v-model:value="editForm.response"
                      language="json"
                      :options="editorOptions"
                      @update:value="validateEditJson"
                      class="json-editor-pro"
                    />
                    
                    <!-- 错误信息 -->
                    <div v-if="jsonEditError" class="editor-error">
                      <n-icon class="error-icon-pro"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg></n-icon>
                      <span>{{ jsonEditError }}</span>
                    </div>
                  </div>
                  
                  <!-- 纯文本编辑器 -->
                  <div v-else class="editor-container-pro">
                    <n-input
                      v-model:value="editForm.response"
                      type="textarea"
                      placeholder="在此输入纯文本响应内容"
                      :autosize="{ minRows: 15, maxRows: 20 }"
                      class="text-editor"
                    />
                  </div>
                </n-form-item>
              </div>
            </n-form>
          </div>

          <!-- 底部操作区域 -->
          <div class="modal-footer-pro">
            <n-button class="cancel-btn-pro" @click="closeEditModal">
              取消
            </n-button>
            <n-button type="primary" class="submit-btn-pro" @click="handleEditSubmit" :disabled="!isEditFormValid || isSubmitting" :loading="isSubmitting">
              {{ isSubmitting ? '更新中...' : '保存更新' }}
              <template #icon>
                <n-icon v-if="!isSubmitting"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/></svg></n-icon>
              </template>
            </n-button>
          </div>
        </div>
      </n-modal>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, h, computed, watch, nextTick, onMounted } from 'vue'
import { 
  NButton, NSpace, NPopconfirm, NTag, FormInst, useMessage, 
  NIcon, NEmpty, NResult, NSelect, NCode, NFormItem, NForm, NInputNumber,
  NInput
} from 'naive-ui'
import MonacoEditor from 'monaco-editor-vue3'
import { debounce } from 'lodash-es'
import PageLayout from '@/components/layout/PageLayout.vue'
// @ts-ignore - 解决MockRightSidebar没有默认导出的问题
import MockRightSidebar from '@/components/layout/MockRightSidebar.vue'
import QRCode from 'qrcode'
import axios from 'axios'

interface MockConfig {
  id: string
  endpoint: string
  response: string
  timeout: number
  isActive: boolean
  category?: number
  createdAt: number
  lastModified: number
  callCount?: number
}

// API返回的数据接口
interface ApiMockData {
  keyword: string
  mockUrl: string
  mockBody: string
  timeout: number // 秒为单位
  updateDt: string
  statusString: string
  typeString: string
}

interface CategoryColor {
  color: string
  bgColor: string
}

interface CategoryColorMap {
  [key: string]: CategoryColor
}

const message = useMessage()

// 服务器地址配置 - 通过import.meta.env可以访问环境变量，便于不同环境使用不同地址
const SERVER_BASE_URL = import.meta.env.VITE_MOCK_API_URL || 'http://localhost:9090'

// 状态管理
const mockList = ref<MockConfig[]>([])
const isLoading = ref(false)

// UI状态
const searchQuery = ref('')
const categoryFilter = ref(null)
const expandedRowKeys = ref<string[]>([])
const editingApiId = ref<string | null>(null)
const showSuccessModal = ref(false)
const showEditModal = ref(false)
const currentMockUrl = ref('')
const qrcodeContainer = ref<HTMLCanvasElement | null>(null)
const isSubmitting = ref(false)
const jsonEditError = ref('')
const editFormRef = ref<FormInst | null>(null)

// 响应类型状态
const responseType = ref<'json' | 'text'>('json')

// 编辑表单
const editForm = reactive<MockConfig>({
  id: '',
  endpoint: '',
  response: '',
  timeout: 0,
  isActive: true,
  category: 0,
  createdAt: 0,
  lastModified: 0
})

// Monaco Editor配置
const editorOptions = {
  theme: 'vs',
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  lineNumbers: 'on',
  tabSize: 2,
  fontSize: 14,
  renderLineHighlight: 'all',
  formatOnPaste: true,
  wordWrap: 'on',
  folding: true,
  autoIndent: true,
  fixedOverflowWidgets: true,
  contextmenu: false
}

// 编辑表单验证规则
const editRules = {
  response: [
    { required: true, message: '请输入响应数据', trigger: 'blur' }
  ]
}

// 计算属性
const isEditFormValid = computed(() => {
  // 如果是文本模式，不验证JSON
  if (responseType.value === 'text') {
    return editForm.response.trim() !== '';
  }
  
  return editForm.response.trim() !== '' && !jsonEditError.value;
})

// 表格配置

// 分类配置及颜色映射
const categoryOptions = [
  { label: '默认', value: 0 },
  { label: 'OrderAuth', value: 1 },
  { label: 'AAA', value: 2 },
  { label: 'WAG', value: 3 },
  { label: 'PS', value: 4 },
  { label: 'SA', value: 5 },
  { label: 'TMS', value: 6 },
  { label: '第三方', value: 7 },
  { label: 'others', value: 8 }
]

const categoryColorMap: CategoryColorMap = {
  0: { color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  1: { color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  2: { color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.1)' },
  3: { color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  4: { color: '#F43F5E', bgColor: 'rgba(244, 63, 94, 0.1)' },
  5: { color: '#6366F1', bgColor: 'rgba(99, 102, 241, 0.1)' },
  6: { color: '#14B8A6', bgColor: 'rgba(20, 184, 166, 0.1)' },
  7: { color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
  8: { color: '#64748B', bgColor: 'rgba(100, 116, 139, 0.1)' }
}

// 分页配置 - 无分页
const pagination = false

// 过滤数据
const filteredMockList = computed(() => {
  let result = mockList.value

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(mock => 
      mock.endpoint.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 默认只显示活跃状态
    result = result.filter(mock => mock.isActive)
  
  // 分类过滤
  if (categoryFilter.value !== null && categoryFilter.value !== undefined) {
    result = result.filter(mock => mock.category === categoryFilter.value)
  }

  return result
})

// 表格列配置
const columns = [
  {
    type: 'expand',
    expandable: () => true,
    renderExpand: expandedRowRender
  },
  {
    title: '分类',
    key: 'category',
    width: 100,
    render(row: MockConfig) {
      const category = row.category !== undefined ? row.category : 0
      const colors = categoryColorMap[category] || categoryColorMap[0]
      
      return h(NTag, {
        bordered: false,
        size: 'small',
        style: {
          backgroundColor: colors.bgColor,
          color: colors.color
        }
      }, { default: () => {
        const label = categoryOptions.find(opt => opt.value === category)?.label || category.toString()
        return label
      }})
    }
  },
  {
    title: '接口路径',
    key: 'endpoint',
    render(row: MockConfig) {
      return h('div', { class: 'endpoint-cell' }, [
        h('span', { class: 'base-url' }, 'http://10.215.211.31:9090'),
        h('span', { 
          class: `endpoint-path ${!row.isActive ? 'inactive-api' : ''}` 
        }, row.endpoint)
      ])
    }
  },

  {
    title: '超时',
    key: 'timeout',
    width: 140,
    render(row: MockConfig) {
      return `${row.timeout}ms`
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 220,
    fixed: 'right',
    render(row: MockConfig) {
      return h(NSpace, { justify: 'center' }, [
        h(
          NButton,
          {
            size: 'small',
            quaternary: true,
            onClick: () => editMock(row)
          },
          { 
            default: () => '编辑',
            icon: () => h(NIcon, null, {
              default: () => h('svg', {
                width: 16, 
                height: 16, 
                viewBox: "0 0 24 24", 
                fill: "none"
              }, [
                h('path', {
                  d: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
                  fill: "currentColor"
                })
              ])
            })
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            quaternary: true,
            onClick: () => copyMock(row)
          },
          { 
            default: () => '复制',
            icon: () => h(NIcon, null, {
              default: () => h('svg', {
                width: 16, 
                height: 16, 
                viewBox: "0 0 24 24", 
                fill: "none"
              }, [
                h('path', {
                  d: "M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z",
                  fill: "currentColor"
                })
              ])
            })
          }
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => deleteMock(row.id),
            positiveText: '确认',
            negativeText: '取消'
          },
          {
            trigger: () => h(NButton, { 
              size: 'small', 
              quaternary: true,
              type: 'error'
            }, { 
              default: () => '删除',
              icon: () => h(NIcon, null, {
                default: () => h('svg', {
                  width: 16, 
                  height: 16, 
                  viewBox: "0 0 24 24", 
                  fill: "none"
                }, [
                  h('path', {
                    d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
                    fill: "currentColor"
                  })
                ])
              })
            }),
            default: () => '确定要删除这个配置吗？'
          }
        )
      ])
    }
  }
]

// 表格行配置
function rowKey(row: MockConfig) {
  return row.id
}

function rowProps(row: MockConfig) {
  return {
    style: row.isActive ? '' : 'opacity: 0.6',
    class: 'mock-table-row'
  }
}

function handleExpandChange(keys: string[]) {
  expandedRowKeys.value = keys
}

// 生成展开行内容
function expandedRowRender(row: MockConfig) {
  // 检测响应是否为JSON
  const isJsonResponse = isJsonFormat(row.response);
  
  return h('div', { class: 'expanded-row' }, [
    h('div', { class: 'expanded-content simplified' }, [
      isJsonResponse 
      ? h('div', 
          { 
            class: 'json-preview-simple clickable',
            onClick: () => copyToClipboard(row.response)
          }, 
          [
            h(NCode, {
              language: 'json',
              code: formatJson(row.response),
              class: 'json-code'
            })
          ]
        )
      : h('div', 
          { 
            class: 'text-preview-simple clickable',
            onClick: () => copyToClipboard(row.response)
          }, 
          [
            h('pre', { class: 'text-content' }, row.response)
          ]
        )
    ])
  ])
}

// 操作函数
function createNewApi() {
  editingApiId.value = null
  // 调用MockRightSidebar的resetForm方法
  const sidebarInstance = MockRightSidebar
  if (typeof sidebarInstance.resetForm === 'function') {
    sidebarInstance.resetForm()
  }
}

function editMock(mock: MockConfig) {
  // 打开编辑弹窗
  editingApiId.value = mock.id
  
  // 填充表单数据
  Object.assign(editForm, mock)
  
  // 检测是否为JSON并设置相应模式
  if (editForm.response) {
    try {
      // 尝试解析JSON
      JSON.parse(editForm.response);
      // 如果成功，使用JSON模式
      responseType.value = 'json';
      
      // 格式化JSON
      const obj = JSON.parse(editForm.response);
      editForm.response = JSON.stringify(obj, null, 2);
      jsonEditError.value = '';
    } catch (e) {
      // 如果解析失败，使用文本模式
      responseType.value = 'text';
      jsonEditError.value = '';
    }
  }
  
  // 打开弹窗
  showEditModal.value = true
}

function copyMock(mock: MockConfig) {
  const mockUrl = `http://10.215.211.31:9090${mock.endpoint.startsWith('/') ? '' : '/'}${mock.endpoint}`
  copyToClipboard(mockUrl)
}

async function deleteMock(id: string) {
  const index = mockList.value.findIndex(item => item.id === id)
  if (index !== -1) {
    const mock = mockList.value[index]
    const keyword = extractKeywordFromEndpoint(mock.endpoint)
    
    try {
      const response = await axios.post('/api/prepare/remove', {
        keyword: keyword,
        data: "",
        timeout: 0
      })
      
      const { code, msg } = response.data
      
      if (code === 200) {
        mockList.value.splice(index, 1)
        message.success('已成功删除')
        
        // 如果正在编辑，关闭编辑
        if (editingApiId.value === id) {
          editingApiId.value = null
          const sidebarInstance = MockRightSidebar
          if (typeof sidebarInstance.resetForm === 'function') {
            sidebarInstance.resetForm()
          }
        }
      } else {
        message.error(`删除失败: ${msg || '未知错误'}`)
      }
    } catch (error) {
      console.error('删除失败:', error)
      message.error(`删除失败: ${error instanceof Error ? error.message : '网络错误'}`)
    }
  }
}

// 从endpoint提取keyword (不包含服务器地址部分)
function extractKeywordFromEndpoint(endpoint: string): string {
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`
}

// 从API加载Mock数据
async function fetchMockData() {
  isLoading.value = true
  try {
    // 使用相对路径，由Vite代理处理
    const response = await axios.get('/api/prepare/queryAll')
    const { code, msg, data } = response.data
    
    if (code === 200 && Array.isArray(data)) {
      // 将API数据转换为应用内部格式
      mockList.value = data.map((item: ApiMockData, index: number) => {
        // 将接口路径从完整URL中提取
        const endpoint = item.keyword || extractEndpointFromUrl(item.mockUrl)
        
        // 转换状态
        const isActive = item.statusString === '活跃'
        
        // 转换分类
        let category = 0 // 默认
        switch (item.typeString) {
          case 'OrderAuth': category = 1; break
          case 'AAA': category = 2; break
          case 'WAG': category = 3; break
          case 'PS': category = 4; break
          case 'SA': category = 5; break
          case 'TMS': category = 6; break
          case '第三方': category = 7; break
          case 'others': category = 8; break
        }
        
        // 解析更新时间
        const updateTime = new Date(item.updateDt).getTime() || Date.now()
        
        return {
          id: (index + 1).toString(), // 生成临时ID
          endpoint,
          response: item.mockBody || '',
          timeout: item.timeout, // 直接使用毫秒值
          isActive,
          category,
          createdAt: updateTime,
          lastModified: updateTime,
          callCount: 0 // API没有提供调用次数，默认为0
        }
      })
    } else {
      message.error(`加载失败: ${msg || '未知错误'}`)
    }
  } catch (error) {
    console.error('加载Mock数据失败:', error)
    message.error(`加载失败: ${error instanceof Error ? error.message : '网络错误'}`)
  } finally {
    isLoading.value = false
  }
}

// 从URL中提取接口路径
function extractEndpointFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname
  } catch (e) {
    // 如果URL格式不正确，直接返回原始字符串
    return url
  }
}

// 样式函数
function railStyle({ focused, checked }: { focused: boolean, checked: boolean }) {
  const style = {
    background: checked ? '#52C41A' : '#FF4D4F',
    boxShadow: focused ? `0 0 0 2px ${checked ? 'rgba(82, 196, 26, 0.2)' : 'rgba(255, 77, 79, 0.2)'}` : 'none'
  }
  return style
}



// 编辑弹窗相关函数
const validateEditJson = debounce((value: string) => {
  if (!value.trim()) {
    jsonEditError.value = '响应数据不能为空'
    return
  }
  
  try {
    JSON.parse(value)
    jsonEditError.value = ''
  } catch (e: any) {
    jsonEditError.value = `JSON 格式错误: ${e.message}`
  }
}, 300)

function formatEditJsonResponse() {
  try {
    const obj = JSON.parse(editForm.response)
    editForm.response = JSON.stringify(obj, null, 2)
    jsonEditError.value = ''
  } catch (e) {
    // 如果无法解析，保持原状
  }
}

function minifyEditJsonResponse() {
  try {
    const obj = JSON.parse(editForm.response)
    editForm.response = JSON.stringify(obj)
    jsonEditError.value = ''
  } catch (e) {
    // 如果无法解析，保持原状
  }
}

function generateEditSampleJson() {
  const samples = [
    {
      code: 200,
      message: "success",
      data: {
        id: 1001,
        name: "Sample Product",
        price: 99.99,
        inStock: true
      }
    },
    {
      code: 200,
      message: "success",
      data: {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        roles: ["admin", "user"]
      }
    },
    {
      code: 200,
      message: "success",
      data: {
        items: [
          { id: 1, name: "Item 1" },
          { id: 2, name: "Item 2" },
          { id: 3, name: "Item 3" }
        ],
        pagination: {
          total: 100,
          page: 1,
          pageSize: 10
        }
      }
    }
  ]
  
  const sample = samples[Math.floor(Math.random() * samples.length)]
  editForm.response = JSON.stringify(sample, null, 2)
  validateEditJson(editForm.response)
}

function closeEditModal() {
  showEditModal.value = false
  jsonEditError.value = ''
  editingApiId.value = null
}

async function handleEditSubmit() {
  if (!isEditFormValid.value) return
  
  isSubmitting.value = true
  
  // 如果是JSON模式，确保response是有效的JSON
  if (responseType.value === 'json' && editForm.response.trim() !== '') {
    try {
      const jsonObj = JSON.parse(editForm.response)
      editForm.response = JSON.stringify(jsonObj)
    } catch (e) {
      jsonEditError.value = '请先修复 JSON 错误'
      isSubmitting.value = false
      return
    }
  }
  
  try {
    // 获取分类显示名称
    const categoryLabel = categoryOptions.find(opt => opt.value === editForm.category)?.label || '默认'
    
    // 准备API请求参数
    const keyword = extractKeywordFromEndpoint(editForm.endpoint)
    
         const response = await axios.post('/api/prepare/update', {
      keyword: keyword,
      data: editForm.response,
      timeout: editForm.timeout, // 直接使用毫秒值
      typeString: categoryLabel
    })
    
    const { code, msg } = response.data
    
    if (code === 200) {
      // 更新接口数据
      const index = mockList.value.findIndex(item => item.id === editingApiId.value)
      if (index !== -1) {
        // 只更新允许编辑的字段
        mockList.value[index].response = editForm.response
        mockList.value[index].timeout = editForm.timeout
        mockList.value[index].category = editForm.category
        mockList.value[index].isActive = true // 总是设为活跃状态
        mockList.value[index].lastModified = Date.now()
      }
      
      message.success('接口更新成功')
      closeEditModal()
      
      // 刷新列表数据
      refreshList()
    } else {
      message.error(`更新失败: ${msg || '未知错误'}`)
    }
  } catch (error) {
    console.error('更新失败:', error)
    message.error(`更新失败: ${error instanceof Error ? error.message : '网络错误'}`)
  } finally {
    isSubmitting.value = false
  }
}

// 处理右侧面板提交的表单
async function handleSubmitFromSidebar(formData: Partial<MockConfig> & { success?: boolean, url?: string }) {
  // 如果表单提交已经由子组件调用API并成功，直接刷新列表和显示成功
  if (formData.success && formData.url) {
    // 显示成功对话框
    currentMockUrl.value = formData.url
    showSuccessModal.value = true
    
    // 生成二维码
    nextTick(() => {
      if (qrcodeContainer.value) {
        QRCode.toCanvas(
          qrcodeContainer.value,
          currentMockUrl.value,
          { width: 150, margin: 0, color: { dark: "#1890FF", light: "#ffffff" } },
          (error: Error | null) => {
            if (error) console.error('QR Code error:', error)
          }
        )
      }
    })
    
    // 刷新列表以显示最新数据
    refreshList()
    return
  }

  if (editingApiId.value) {
    // 编辑现有接口 - 这里不会进入，因为编辑通过弹窗处理
    const index = mockList.value.findIndex(item => item.id === editingApiId.value)
    if (index !== -1) {
      mockList.value[index] = {
        ...mockList.value[index],
        ...formData,
        lastModified: Date.now()
      }
      message.success('接口更新成功')
    }
  } else {
    // 创建新接口
    try {
      // 准备数据
      const endpoint = formData.endpoint || ''
      const keyword = extractKeywordFromEndpoint(endpoint)
      const category = typeof formData.category === 'number' ? formData.category : 0
      const categoryLabel = categoryOptions.find(opt => opt.value === category)?.label || '默认'
      
      // 调用API
      const response = await axios.post('/api/prepare/save', {
        keyword: keyword,
        data: formData.response || '',
        timeout: formData.timeout || 0, // 直接使用毫秒值
        typeString: categoryLabel
      })
      
      const { code, msg } = response.data
      
      if (code === 200) {
        // 创建新接口对象
        const newMock: MockConfig = {
          id: Date.now().toString(),
          endpoint: endpoint,
          response: formData.response || '',
          timeout: formData.timeout || 0,
          isActive: true, // 默认都是活跃状态
          category: category,
          createdAt: Date.now(),
          lastModified: Date.now(),
          callCount: 0
        }
        
        mockList.value.unshift(newMock)
        
        // 显示成功对话框
        currentMockUrl.value = `http://10.215.211.31:9090${newMock.endpoint.startsWith('/') ? '' : '/'}${newMock.endpoint}`
        showSuccessModal.value = true
        
        // 生成二维码
        nextTick(() => {
          if (qrcodeContainer.value) {
            QRCode.toCanvas(
              qrcodeContainer.value,
              currentMockUrl.value,
              { width: 150, margin: 0, color: { dark: "#1890FF", light: "#ffffff" } },
              (error: Error | null) => {
                if (error) console.error('QR Code error:', error)
              }
            )
          }
        })
        
        // 刷新列表
        refreshList()
      } else {
        message.error(`创建失败: ${msg || '未知错误'}`)
      }
    } catch (error) {
      console.error('创建失败:', error)
      message.error(`创建失败: ${error instanceof Error ? error.message : '网络错误'}`)
    }
  }
  
  // 重置编辑状态
  editingApiId.value = null
}

function formatJson(jsonString: string) {
  try {
    const obj = JSON.parse(jsonString)
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return jsonString
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
    .then(() => message.success('已复制到剪贴板'))
    .catch(() => message.error('复制失败'))
}

// 监听表格变化，添加动画效果
watch(mockList, () => {
  // 通过添加和移除类来触发CSS动画
  document.querySelectorAll('.mock-table-row').forEach(row => {
    row.classList.add('row-updated')
    setTimeout(() => row.classList.remove('row-updated'), 1000)
  })
}, { deep: true })

// 本地存储
onMounted(() => {
  // 直接从服务器加载数据
  fetchMockData()
})

// 自动保存草稿
watch(mockList, (newVal) => {
  localStorage.setItem('mockConfigs', JSON.stringify(newVal))
}, { deep: true })

// 设置响应类型
function setResponseType(type: 'json' | 'text') {
  // 如果从文本切换到JSON，尝试验证当前内容
  if (responseType.value === 'text' && type === 'json' && editForm.response.trim() !== '') {
    try {
      // 尝试解析为JSON
      JSON.parse(editForm.response);
    } catch (e) {
      // 如果不是有效JSON，清除响应内容防止切换后出错
      if (!confirm('当前内容不是有效的JSON，切换后将清空内容。是否继续？')) {
        return; // 用户取消切换
      }
      editForm.response = '';
    }
  }
  
  responseType.value = type;
  
  // 切换到JSON模式后验证
  if (type === 'json' && editForm.response.trim() !== '') {
    validateEditJson(editForm.response);
  } else if (type === 'text') {
    // 切换到文本模式，清除JSON错误
    jsonEditError.value = '';
  }
}

// 辅助函数：检测字符串是否为有效JSON
function isJsonFormat(str: string) {
  if (!str) return false;
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// 修改refreshList函数，添加从服务器刷新功能
function refreshList() {
  // 重置过滤条件
  searchQuery.value = ''
  categoryFilter.value = null
  
  // 从服务器重新加载数据
  fetchMockData()
}

</script>

<style scoped>
body {
  padding: 0;
  margin: 0;
  background-color: #f9fafb;
}

.mock-service-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.interface-list-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  background: white;
}

.interface-list-card :deep(.n-card__content) {
  padding: 0;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.list-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  width: 200px;
  transition: width 0.3s ease;
}

.search-input:focus-within {
  width: 260px;
}

/* 圆角分类过滤选择框 */
.category-filter :deep(.n-base-selection) {
  border-radius: 16px;
}

.interface-table {
  width: 100%;
}

.interface-table :deep(.n-data-table-th) {
  background-color: #f9fafb;
  font-weight: 600;
  font-size: 13px;
  padding: 12px 24px;
  color: #4b5563;
}

.interface-table :deep(.n-data-table-td) {
  padding: 16px 24px;
  color: #1f2937;
}

.interface-table :deep(.n-data-table-tr) {
  transition: all 0.3s ease;
  animation-duration: 0.5s;
  animation-fill-mode: both;
}

.row-updated {
  animation-name: highlightRow;
}

@keyframes highlightRow {
  0% {
    background-color: rgba(24, 144, 255, 0.1);
  }
  100% {
    background-color: transparent;
  }
}

.interface-table :deep(.n-data-table-tr:hover) {
  background-color: #f9fafb;
}

.endpoint-cell {
  display: flex;
  align-items: center;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  white-space: nowrap;
}

.endpoint-cell .base-url {
  padding: 3px 6px;
  margin-right: 6px;
  border: none;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #6b7280;
  font-size: 12px;
}

.endpoint-cell .endpoint-path {
  font-weight: 500;
  color: #1f2937;
  transition: all 0.2s ease;
}

.endpoint-cell .endpoint-path.inactive-api {
  text-decoration: line-through;
  opacity: 0.6;
}

/* 改进的展开行样式 */
.expanded-row {
  padding: 0;
  background-color: #f9fafb;
  border-radius: 0 0 8px 8px;
}

.expanded-content.simplified {
  padding: 16px 20px;
}

.expanded-response-simple {
  width: 100%;
}

.response-header-simple {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.response-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.response-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.response-path {
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  color: #6b7280;
  font-size: 13px;
  background: #edf2f7;
  padding: 2px 8px;
  border-radius: 4px;
}

.copy-btn {
  font-size: 12px;
  padding: 0 14px;
}

.copy-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.json-preview-simple {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  max-height: 400px;
  overflow-y: auto;
  background-color: #fff;
  position: relative;
}

.json-preview-simple.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.json-preview-simple.clickable:hover {
  border-color: #1890FF;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.json-preview-simple.clickable:hover::after {
  content: "点击复制";
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(24, 144, 255, 0.9);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.json-preview-simple :deep(pre) {
  background-color: #fff !important;
  padding: 16px !important;
  margin: 0 !important;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
}

.json-code :deep(code) {
  background-color: transparent !important;
  padding: 0 !important;
}

.json-preview-simple :deep(.hljs-attr) {
  color: #8250df !important; /* Purple for keys */
  font-weight: 500 !important;
}

.json-preview-simple :deep(.hljs-string) {
  color: #0969da !important; /* Bright blue for string values */
}

.json-preview-simple :deep(.hljs-number) {
  color: #0550ae !important; /* Dark blue for numbers */
}

.json-preview-simple :deep(.hljs-literal) {
  color: #cf222e !important; /* Red for booleans */
  font-weight: 500 !important;
}

.empty-state {
  padding: 40px 0;
}

.success-modal {
  width: 450px;
  max-width: 90vw;
}

.success-content {
  padding: 0 20px 20px;
}

.mock-url-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.mock-url {
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  color: #4b5563;
  overflow: hidden;
  text-overflow: ellipsis;
}

.qrcode-container {
  margin: 10px auto;
  display: flex;
  justify-content: center;
}

.qrcode-container canvas {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 专业版编辑弹窗样式 */
.edit-modal-pro {
  width: 1100px;
  max-width: 98vw;
}

.edit-modal-pro :deep(.n-dialog__icon) {
  display: none;
}

.edit-modal-pro :deep(.n-dialog__content) {
  padding: 0;
}

.modal-container {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  border-radius: 8px;
}

.modal-body-pro {
  padding: 24px 24px 0;
  overflow-y: auto;
  flex-grow: 1;
  max-height: calc(90vh - 80px);
}

.edit-form-pro {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 28px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .edit-modal-pro {
    width: 98vw;
  }
}

@media (max-width: 900px) {
  .edit-form-pro {
    grid-template-columns: 1fr;
  }
  
  .modal-header-pro {
    padding: 16px;
  }
  
  .header-icon {
    width: 36px;
    height: 36px;
  }
  
  .header-text h3 {
    font-size: 18px;
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.section-icon {
  color: #333;
}

.section-header h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

/* 左侧配置区域样式 */
.left-column {
  padding-right: 20px;
}

.endpoint-preview-pro {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 14px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.endpoint-preview-pro:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.endpoint-input-icon {
  color: #6b7280;
  margin-top: 2px;
}

.endpoint-content {
  flex-grow: 1;
}

.endpoint-url {
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  overflow-wrap: break-word;
  word-break: break-all;
  line-height: 1.5;
  font-size: 14px;
}

.endpoint-base {
  color: #6b7280;
}

.endpoint-path {
  color: #1f2937;
  font-weight: 500;
}

.endpoint-info {
  font-size: 12px;
  color: #6b7280;
  margin-top: 6px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.input-icon {
  color: #6b7280;
}

.category-wrapper {
  width: 100%;
}

.category-select-pro {
  width: 100%;
}

.category-select-pro :deep(.n-base-selection) {
  border-radius: 8px;
  border-color: #d1d5db;
}

.category-select-pro :deep(.n-base-selection:hover) {
  border-color: #555;
}

.timeout-input-pro {
  width: 100%;
}

.timeout-input-pro :deep(.n-input) {
  border-radius: 8px;
  border-color: #d1d5db;
}

.timeout-input-pro :deep(.n-input:hover) {
  border-color: #555;
}

.input-suffix {
  color: #6b7280;
  font-size: 12px;
}

.field-helper-text {
  font-size: 12px;
  color: #6b7280;
  margin-top: 6px;
}

.status-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-switch-pro {
  min-width: 80px;
}

.switch-content-pro {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 12px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: #f3f4f6;
}

.status-active {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-inactive {
  background: rgba(158, 158, 158, 0.1);
  color: #757575;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-active .status-indicator {
  background-color: #4CAF50;
}

.status-inactive .status-indicator {
  background-color: #9e9e9e;
}

/* 右侧响应编辑区域样式 */
.right-column {
  display: flex;
  flex-direction: column;
}

.editor-form-item {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.editor-form-item :deep(.n-form-item-feedback-wrapper) {
  min-height: 0;
}

.editor-container-pro {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  flex-grow: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.editor-container-pro:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.editor-status-pro {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.editor-status-error {
  color: #d32f2f;
}

.status-dot-pro {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #333;
}

.status-dot-error {
  background-color: #d32f2f;
}

.editor-actions-pro {
  display: flex;
  gap: 8px;
}

.json-editor-pro {
  height: 400px !important;
  border: none;
  width: 100%;
}

.json-editor-pro :deep(.monaco-editor) {
  padding: 8px 0;
}

.editor-error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.03);
  color: #d32f2f;
  font-size: 13px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.error-icon-pro {
  margin-top: 2px;
  flex-shrink: 0;
}

/* 底部操作区域样式 */
.modal-footer-pro {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 8px 8px;
}

.cancel-btn-pro {
  min-width: 100px;
  font-weight: 500;
  border-radius: 6px;
}

.submit-btn-pro {
  min-width: 140px;
  font-weight: 500;
  border-radius: 6px;
  background: #333;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  height: 34px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.submit-btn-pro:not(:disabled):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
  background: #444;
}

.submit-btn-pro:not(:disabled):active {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  transform: translateY(0);
  background: #222;
}

.submit-btn-pro:disabled {
  opacity: 0.7;
  background: #999;
  box-shadow: none;
}

/* 自定义开关样式 */
:deep(.n-switch.status-switch-pro .n-switch__rail) {
  border-radius: 16px;
  padding: 2px;
  height: 24px;
}

:deep(.n-switch.status-switch-pro .n-switch__button) {
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
}

:deep(.n-switch.status-switch-pro.n-switch--active .n-switch__button) {
  left: calc(100% - 20px - 2px) !important;
}

/* JSON/TXT切换开关样式 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h4 {
  margin-right: auto;
}

.response-type-switch {
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.switch-option {
  padding: 3px 10px;
  font-size: 12px;
  cursor: pointer;
  background: #f9fafb;
  transition: all 0.2s ease;
  user-select: none;
}

.switch-option:first-child {
  border-right: 1px solid #e5e7eb;
}

.switch-option.active {
  background: #4CAF50;
  color: white;
}

/* 文本编辑器样式 */
.text-editor {
  width: 100%;
  height: 400px;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-size: 14px;
}

.text-editor :deep(.n-input__textarea) {
  border-radius: 0;
  padding: 12px;
  height: 100%;
}

/* 纯文本预览样式 */
.text-preview-simple {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  max-height: 400px;
  overflow-y: auto;
  position: relative;
}

.text-preview-simple.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.text-preview-simple.clickable:hover {
  border-color: #1890FF;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.text-preview-simple.clickable:hover::after {
  content: "点击复制";
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(24, 144, 255, 0.9);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.text-content {
  background-color: #fff !important;
  padding: 16px !important;
  margin: 0 !important;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 新增服务器配置样式 */
.server-config {
  width: 400px;
}

.server-input {
  border-radius: 8px;
}

</style>
