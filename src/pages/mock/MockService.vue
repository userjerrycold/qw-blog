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
              />
              <n-select
                v-model:value="statusFilter"
                placeholder="状态"
                :options="statusOptions"
                style="width: 100px"
                clearable
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
        />

        <!-- 空状态 -->
        <n-empty v-if="filteredMockList.length === 0" class="empty-state" description="暂无接口配置" />
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
      <n-modal v-model:show="showEditModal" preset="card" title="编辑接口" class="edit-modal">
        <div class="edit-modal-content">
          <n-form ref="editFormRef" :model="editForm" :rules="editRules" label-placement="left" label-width="80">
            <!-- 接口路径 (只读) -->
            <n-form-item label="接口路径" path="endpoint">
              <div class="endpoint-display">
                http://10.215.211.31:9090{{ editForm.endpoint.startsWith('/') ? '' : '/' }}{{ editForm.endpoint }}
              </div>
            </n-form-item>
            
            <!-- 分类 -->
            <n-form-item label="分类" path="category">
              <n-select
                v-model:value="editForm.category"
                :options="categoryOptions"
                placeholder="选择分类"
                class="rounded-input"
                style="width: 180px"
              />
            </n-form-item>
            
            <!-- 超时时间 -->
            <n-form-item label="超时时间" path="timeout">
              <div class="timeout-input-container">
                <input
                  type="number" 
                  v-model="editForm.timeout"
                  class="timeout-input-large"
                  min="0" 
                  max="10000"
                  style="width: 120px"
                />
                <span class="timeout-suffix-large">ms</span>
              </div>
            </n-form-item>
            
            <!-- 状态 -->
            <n-form-item label="状态" path="isActive">
              <n-switch
                v-model:value="editForm.isActive"
                :rail-style="railStyle"
                class="status-switch"
              >
                <template #checked>
                  <div class="switch-content">
                    <div class="switch-dot active"></div>
                    活跃
                  </div>
                </template>
                <template #unchecked>
                  <div class="switch-content">
                    <div class="switch-dot inactive"></div>
                    停用
                  </div>
                </template>
              </n-switch>
            </n-form-item>
            
            <!-- 响应数据 -->
            <n-form-item label="响应数据" path="response">
              <div class="editor-header">
                <div class="editor-status" :class="{ 'editor-status-error': jsonEditError }">
                  <div class="status-dot" :class="{ 'status-dot-error': jsonEditError }"></div>
                  {{ jsonEditError ? '格式错误' : '格式正确' }}
                </div>
                <div class="editor-actions">
                  <n-tooltip trigger="hover" placement="top">
                    <template #trigger>
                      <n-button quaternary circle size="small" @click="formatEditJsonResponse" :disabled="!!jsonEditError">
                        <n-icon>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" fill="currentColor"/>
                          </svg>
                        </n-icon>
                      </n-button>
                    </template>
                    格式化JSON
                  </n-tooltip>
                  <n-tooltip trigger="hover" placement="top">
                    <template #trigger>
                      <n-button quaternary circle size="small" @click="minifyEditJsonResponse" :disabled="!!jsonEditError">
                        <n-icon>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.89 10.105L19.89 10.105C19.9697 10.1842 20.0097 10.2899 20 10.4V17.5C20 19.433 18.433 21 16.5 21H7.5C5.567 21 4 19.433 4 17.5V6.5C4 4.567 5.567 3 7.5 3H16.5C18.433 3 20 4.567 20 6.5V6.6C20.0097 6.71009 19.9697 6.81575 19.89 6.895L15.5 11.295L15.5 11.295C15.3946 11.4004 15.2516 11.4602 15.1 11.46C14.9484 11.4598 14.8054 11.3996 14.7 11.294L12.5 9.095L10.294 11.3C10.1889 11.4058 10.0457 11.4663 9.894 11.4666C9.74228 11.4669 9.59879 11.407 9.493 11.302L9.493 11.302L9.489 11.298L8.995 10.804L8.989 10.798C8.88583 10.6916 8.82669 10.5499 8.8266 10.4008C8.82651 10.2516 8.88547 10.1098 8.989 10.0034L8.989 10.0033L8.995 9.997L11.202 7.79L11.208 7.784C11.3144 7.67839 11.456 7.61925 11.605 7.61916C11.7541 7.61906 11.8958 7.67803 12.002 7.784L12.002 7.784L12.008 7.79L14.2 10L17.982 6.217L17.988 6.211C18.0947 6.10437 18.2366 6.04524 18.386 6.04516C18.5353 6.04507 18.6773 6.104 18.784 6.21L19.89 10.105Z" fill="currentColor" stroke="currentColor" stroke-width="0.1"/>
                          </svg>
                        </n-icon>
                      </n-button>
                    </template>
                    压缩JSON
                  </n-tooltip>
                  <n-tooltip trigger="hover" placement="top">
                    <template #trigger>
                      <n-button quaternary circle size="small" @click="generateEditSampleJson">
                        <n-icon>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4h2v4zm0-6h-2V7h2v4z" fill="currentColor"/>
                          </svg>
                        </n-icon>
                      </n-button>
                    </template>
                    生成示例
                  </n-tooltip>
                </div>
              </div>
              <monaco-editor
                v-model:value="editForm.response"
                language="json"
                :options="editorOptions"
                @update:value="validateEditJson"
                class="json-editor"
              />
              <div class="form-tip" :class="{ 'form-error': jsonEditError }">
                {{ jsonEditError || '' }}
              </div>
            </n-form-item>
          </n-form>
          
          <div class="modal-actions">
            <n-button class="cancel-btn" @click="closeEditModal" round>
              取消
            </n-button>
            <n-button type="primary" class="submit-btn" @click="handleEditSubmit" :disabled="!isEditFormValid || isSubmitting" :loading="isSubmitting" round>
              更新
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
  NIcon, NEmpty, NResult, NSelect, NCode, NFormItem, NForm
} from 'naive-ui'
import MonacoEditor from 'monaco-editor-vue3'
import { debounce } from 'lodash-es'
import PageLayout from '@/components/layout/PageLayout.vue'
// @ts-ignore - 解决MockRightSidebar没有默认导出的问题
import MockRightSidebar from '@/components/layout/MockRightSidebar.vue'
import QRCode from 'qrcode'

interface MockConfig {
  id: string
  endpoint: string
  response: string
  timeout: number
  isActive: boolean
  category?: string
  createdAt: number
  lastModified: number
  callCount?: number
}

interface CategoryColor {
  color: string
  bgColor: string
}

interface CategoryColorMap {
  [key: string]: CategoryColor
}

const message = useMessage()

// 状态管理
const mockList = ref<MockConfig[]>([
  {
    id: '1',
    endpoint: '/api/doOrder',
    response: JSON.stringify({ code: 200, message: 'success', data: { orderId: '12345' } }),
    timeout: 500,
    isActive: true,
    category: 'order',
    createdAt: Date.now() - 1000000,
    lastModified: Date.now() - 500000,
    callCount: 24
  },
  {
    id: '2',
    endpoint: '/api/getUser',
    response: JSON.stringify({ code: 200, message: 'success', data: { name: 'John', age: 30 } }),
    timeout: 200,
    isActive: true,
    category: 'user',
    createdAt: Date.now() - 2000000,
    lastModified: Date.now() - 300000,
    callCount: 36
  },
  {
    id: '3',
    endpoint: '/api/getProducts',
    response: JSON.stringify({ code: 200, message: 'success', data: { products: [] } }),
    timeout: 300,
    isActive: false,
    category: 'product',
    createdAt: Date.now() - 3000000,
    lastModified: Date.now() - 100000,
    callCount: 12
  },
  {
    id: '4',
    endpoint: '/api/loginUser',
    response: JSON.stringify({ code: 200, message: 'success', data: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' } }),
    timeout: 150,
    isActive: true,
    category: 'user',
    createdAt: Date.now() - 800000,
    lastModified: Date.now() - 400000,
    callCount: 58
  },
  {
    id: '5',
    endpoint: '/api/getProductDetails',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        id: 123,
        name: 'Premium Widget',
        price: 59.99,
        description: 'High quality widget with advanced features',
        inStock: true
      } 
    }),
    timeout: 250,
    isActive: true,
    category: 'product',
    createdAt: Date.now() - 1200000,
    lastModified: Date.now() - 600000,
    callCount: 42
  },
  {
    id: '6',
    endpoint: '/api/submitPayment',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        transactionId: 'tx_56789',
        status: 'completed',
        amount: 299.50
      } 
    }),
    timeout: 350,
    isActive: true,
    category: 'payment',
    createdAt: Date.now() - 1500000,
    lastModified: Date.now() - 700000,
    callCount: 19
  },
  {
    id: '7',
    endpoint: '/api/getUserOrders',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        orders: [
          { id: 'ord-1001', date: '2023-10-15', total: 129.99 },
          { id: 'ord-982', date: '2023-09-28', total: 59.99 }
        ]
      } 
    }),
    timeout: 280,
    isActive: true,
    category: 'order',
    createdAt: Date.now() - 1700000,
    lastModified: Date.now() - 900000,
    callCount: 31
  },
  {
    id: '8',
    endpoint: '/api/logoutUser',
    response: JSON.stringify({ code: 200, message: 'User logged out successfully', data: null }),
    timeout: 100,
    isActive: true,
    category: 'user',
    createdAt: Date.now() - 1800000,
    lastModified: Date.now() - 1000000,
    callCount: 27
  },
  {
    id: '9',
    endpoint: '/api/validateCoupon',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        valid: true,
        discount: 15,
        expiry: '2023-12-31'
      } 
    }),
    timeout: 180,
    isActive: false,
    category: 'order',
    createdAt: Date.now() - 2100000,
    lastModified: Date.now() - 1200000,
    callCount: 15
  },
  {
    id: '10',
    endpoint: '/api/getProductReviews',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        reviews: [
          { user: 'Alice', rating: 5, comment: 'Great product!' },
          { user: 'Bob', rating: 4, comment: 'Very good, but could be better' }
        ],
        average: 4.5
      } 
    }),
    timeout: 320,
    isActive: true,
    category: 'product',
    createdAt: Date.now() - 2300000,
    lastModified: Date.now() - 1500000,
    callCount: 22
  },
  {
    id: '11',
    endpoint: '/api/trackOrder',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        status: 'shipped',
        trackingNumber: '1Z999AA10123456784',
        estimatedDelivery: '2023-11-05',
        currentLocation: 'Distribution Center'
      } 
    }),
    timeout: 270,
    isActive: true,
    category: 'order',
    createdAt: Date.now() - 2500000,
    lastModified: Date.now() - 1800000,
    callCount: 17
  },
  {
    id: '12',
    endpoint: '/api/cancelOrder',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        cancelled: true,
        refundId: 'ref_12345',
        refundAmount: 129.99
      } 
    }),
    timeout: 230,
    isActive: false,
    category: 'order',
    createdAt: Date.now() - 2700000,
    lastModified: Date.now() - 2000000,
    callCount: 9
  },
  {
    id: '13',
    endpoint: '/api/resetPassword',
    response: JSON.stringify({ code: 200, message: 'Password reset email sent', data: null }),
    timeout: 150,
    isActive: true,
    category: 'user',
    createdAt: Date.now() - 2900000,
    lastModified: Date.now() - 2200000,
    callCount: 13
  },
  {
    id: '14',
    endpoint: '/api/getCategories',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        categories: [
          { id: 1, name: 'Electronics' },
          { id: 2, name: 'Clothing' },
          { id: 3, name: 'Books' },
          { id: 4, name: 'Home & Garden' }
        ]
      } 
    }),
    timeout: 180,
    isActive: true,
    category: 'product',
    createdAt: Date.now() - 3100000,
    lastModified: Date.now() - 2400000,
    callCount: 40
  },
  {
    id: '15',
    endpoint: '/api/updateShippingAddress',
    response: JSON.stringify({ code: 200, message: 'Address updated successfully', data: { success: true } }),
    timeout: 200,
    isActive: true,
    category: 'user',
    createdAt: Date.now() - 3300000,
    lastModified: Date.now() - 2600000,
    callCount: 7
  },
  {
    id: '16',
    endpoint: '/api/getNotifications',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        notifications: [
          { id: 1, type: 'order', message: 'Your order has shipped', read: false },
          { id: 2, type: 'promo', message: 'New sale starts tomorrow!', read: true }
        ],
        unreadCount: 1
      } 
    }),
    timeout: 160,
    isActive: true,
    category: 'user',
    createdAt: Date.now() - 3500000,
    lastModified: Date.now() - 2800000,
    callCount: 25
  },
  {
    id: '17',
    endpoint: '/api/verifyPayment',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        verified: true,
        paymentMethod: 'credit_card',
        last4: '4242'
      } 
    }),
    timeout: 250,
    isActive: false,
    category: 'payment',
    createdAt: Date.now() - 3700000,
    lastModified: Date.now() - 3000000,
    callCount: 18
  },
  {
    id: '18',
    endpoint: '/api/submitFeedback',
    response: JSON.stringify({ code: 200, message: 'Feedback submitted successfully', data: { ticketId: 'FB-12345' } }),
    timeout: 220,
    isActive: true,
    category: 'default',
    createdAt: Date.now() - 3900000,
    lastModified: Date.now() - 3200000,
    callCount: 6
  },
  {
    id: '19',
    endpoint: '/api/applyDiscount',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        applied: true,
        newTotal: 89.99,
        savings: 10.00
      } 
    }),
    timeout: 190,
    isActive: true,
    category: 'order',
    createdAt: Date.now() - 4100000,
    lastModified: Date.now() - 3400000,
    callCount: 14
  },
  {
    id: '20',
    endpoint: '/api/getWishlist',
    response: JSON.stringify({ 
      code: 200, 
      message: 'success', 
      data: { 
        wishlist: [
          { id: 101, name: 'Wireless Headphones', price: 89.99 },
          { id: 203, name: 'Smart Watch', price: 159.99 },
          { id: 305, name: 'Portable Charger', price: 29.99 }
        ]
      } 
    }),
    timeout: 210,
    isActive: true,
    category: 'user',
    createdAt: Date.now() - 4300000,
    lastModified: Date.now() - 3600000,
    callCount: 11
  }
])

// UI状态
const searchQuery = ref('')
const statusFilter = ref(null)
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

// 编辑表单
const editForm = reactive<MockConfig>({
  id: '',
  endpoint: '',
  response: '',
  timeout: 300,
  isActive: true,
  category: 'default',
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
  return editForm.response.trim() !== '' && !jsonEditError.value
})

// 表格配置
const statusOptions = [
  { label: '活跃', value: 'active' },
  { label: '停用', value: 'inactive' }
]

// 分类配置及颜色映射
const categoryOptions = [
  { label: '默认', value: 'default' },
  { label: '用户', value: 'user' },
  { label: '订单', value: 'order' },
  { label: '产品', value: 'product' },
  { label: '支付', value: 'payment' }
]

const categoryColorMap: CategoryColorMap = {
  'default': { color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  'user': { color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  'order': { color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.1)' },
  'product': { color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  'payment': { color: '#F43F5E', bgColor: 'rgba(244, 63, 94, 0.1)' }
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

  // 状态过滤
  if (statusFilter.value === 'active') {
    result = result.filter(mock => mock.isActive)
  } else if (statusFilter.value === 'inactive') {
    result = result.filter(mock => !mock.isActive)
  }
  
  // 分类过滤
  if (categoryFilter.value) {
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
      const category = row.category || 'default'
      const colors = categoryColorMap[category] || categoryColorMap.default
      
      return h(NTag, {
        bordered: false,
        size: 'small',
        style: {
          backgroundColor: colors.bgColor,
          color: colors.color
        }
      }, { default: () => {
        const label = categoryOptions.find(opt => opt.value === category)?.label || category
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
    title: '状态',
    key: 'isActive',
    width: 100,
    render(row: MockConfig) {
      return h(NTag, {
        type: row.isActive ? 'success' : 'error',
        bordered: false,
        size: 'small',
        style: {
          backgroundColor: row.isActive ? 'rgba(82, 196, 26, 0.15)' : 'rgba(255, 77, 79, 0.15)',
          color: row.isActive ? '#52C41A' : '#FF4D4F',
          fontWeight: '600',
          padding: '2px 10px',
          borderRadius: '12px'
        }
      }, { default: () => row.isActive ? '活跃' : '停用' })
    }
  },
  {
    title: '超时',
    key: 'timeout',
    width: 100,
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
            onPositiveClick: () => deleteMock(row.id)
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
  return h('div', { class: 'expanded-row' }, [
    h('div', { class: 'expanded-content simplified' }, [
      h('div', 
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
  
  // 格式化JSON
  try {
    const obj = JSON.parse(editForm.response)
    editForm.response = JSON.stringify(obj, null, 2)
  } catch (e) {
    // 如果解析失败，保持原样
  }
  
  // 打开弹窗
  showEditModal.value = true
}

function copyMock(mock: MockConfig) {
  const mockUrl = `http://10.215.211.31:9090${mock.endpoint.startsWith('/') ? '' : '/'}${mock.endpoint}`
  copyToClipboard(mockUrl)
}

function deleteMock(id: string) {
  const index = mockList.value.findIndex(item => item.id === id)
  if (index !== -1) {
    mockList.value.splice(index, 1)
    message.success('已删除')
    
    // 如果正在编辑，关闭编辑
    if (editingApiId.value === id) {
      editingApiId.value = null
      const sidebarInstance = MockRightSidebar
      if (typeof sidebarInstance.resetForm === 'function') {
        sidebarInstance.resetForm()
      }
    }
  }
}

function refreshList() {
  // 重置过滤条件
  searchQuery.value = ''
  categoryFilter.value = null
  statusFilter.value = null
  
  // 刷新列表（这里可以添加从服务器重新获取数据的逻辑）
  message.success('已刷新接口列表')
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

function handleEditSubmit() {
  if (!isEditFormValid.value) return
  
  isSubmitting.value = true
  
  // 确保 response 是有效的 JSON
  try {
    const jsonObj = JSON.parse(editForm.response)
    editForm.response = JSON.stringify(jsonObj)
  } catch (e) {
    jsonEditError.value = '请先修复 JSON 错误'
    isSubmitting.value = false
    return
  }
  
  // 模拟网络延迟
  setTimeout(() => {
    // 更新接口数据
    const index = mockList.value.findIndex(item => item.id === editingApiId.value)
    if (index !== -1) {
      // 只更新允许编辑的字段
      mockList.value[index].response = editForm.response
      mockList.value[index].timeout = editForm.timeout
      mockList.value[index].category = editForm.category
      mockList.value[index].isActive = editForm.isActive
      mockList.value[index].lastModified = Date.now()
      
      message.success('接口更新成功')
      closeEditModal()
    }
    
    isSubmitting.value = false
  }, 300)
}

// 处理右侧面板提交的表单
function handleSubmitFromSidebar(formData: Partial<MockConfig>) {
  if (editingApiId.value) {
    // 编辑现有接口
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
    const newMock: MockConfig = {
      id: Date.now().toString(),
      endpoint: formData.endpoint || '',
      response: formData.response || '',
      timeout: formData.timeout || 0,
      isActive: formData.isActive !== undefined ? formData.isActive : true,
      category: formData.category || 'default',
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
  // 加载本地存储的接口配置
  const savedMocks = localStorage.getItem('mockConfigs')
  if (savedMocks) {
    try {
      const parsedMocks = JSON.parse(savedMocks)
      if (Array.isArray(parsedMocks) && parsedMocks.length > 0) {
        mockList.value = parsedMocks
      }
    } catch (e) {
      console.error('Failed to load saved mocks:', e)
    }
  }
})

// 自动保存草稿
watch(mockList, (newVal) => {
  localStorage.setItem('mockConfigs', JSON.stringify(newVal))
}, { deep: true })
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

/* 编辑弹窗样式 */
.edit-modal {
  width: 550px;
  max-width: 90vw;
}

.edit-modal-content {
  padding: 0 20px 20px;
}

.edit-modal :deep(.n-card-header) {
  padding: 20px 20px 0;
}

.edit-modal :deep(.n-card-header__main) {
  font-size: 18px;
  font-weight: 600;
}

.edit-modal :deep(.n-form-item-label) {
  font-weight: 500;
  color: #374151;
}

.edit-modal :deep(.n-form-item) {
  margin-bottom: 20px;
}

.full-url {
  font-size: 12px;
  color: #6b7280;
  margin-top: 6px;
  padding: 6px 8px;
  background-color: #f9fafb;
  border-radius: 8px;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  word-break: break-all;
}

.rounded-input {
  border-radius: 8px !important;
  overflow: hidden;
}

.rounded-input :deep(.n-input__border),
.rounded-input :deep(.n-input-wrapper) {
  border-radius: 8px !important;
}

.rounded-input :deep(.n-base-selection) {
  border-radius: 8px !important;
}

.timeout-input-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.timeout-input-large {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 6px 8px 6px 10px;
  font-size: 13px;
  color: #374151;
  appearance: none;
  -moz-appearance: textfield;
  text-align: right;
  padding-right: 32px;
  background-color: #fff;
}

.timeout-input-large::-webkit-outer-spin-button,
.timeout-input-large::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.timeout-suffix-large {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 12px;
}

.json-editor {
  height: 300px !important;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  margin-bottom: 8px;
}

.json-editor :deep(.monaco-editor) {
  height: 100% !important;
}

.json-editor :deep(.monaco-editor .margin) {
  width: 32px !important;
}

.json-editor :deep(.monaco-editor .margin .line-numbers) {
  width: 26px !important;
  text-align: center !important;
}

/* Fix the content padding to remove extra space */
.json-editor :deep(.monaco-editor .monaco-scrollable-element) {
  left: 32px !important;
}

.json-editor :deep(.monaco-editor .view-lines) {
  width: calc(100% - 32px) !important;
  left: 0 !important;
  padding-left: 0 !important;
}

.json-editor :deep(.monaco-editor-background) {
  height: 100% !important;
}

.editor-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.editor-actions-row {
  display: flex;
  gap: 12px;
  justify-content: flex-start; /* Align buttons to the left */
}

.editor-actions-row.center {
  justify-content: center; /* Center the button in the grid row */
}

.action-btn {
  border-radius: 20px;
  padding: 6px 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn:hover {
  background-color: #f3f4f6;
  transform: translateY(-1px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.08);
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.action-btn :deep(.n-button__icon) {
  margin-right: 4px;
}

.status-switch {
  width: 80px;
}

.switch-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.switch-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.switch-dot.active {
  background-color: #fff;
}

.switch-dot.inactive {
  background-color: #fff;
}

.form-tip {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.form-error {
  color: #FF4D4F !important;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.submit-btn {
  min-width: 80px;
  background-color: #1890FF;
}

.submit-btn:hover {
  background-color: #40a9ff;
}

.submit-btn:active {
  background-color: #096dd9;
}

.cancel-btn {
  min-width: 80px;
}

/* 移动设备适配 */
@media (max-width: 768px) {
  .expanded-content {
    flex-direction: column;
  }
  
  .expanded-metadata {
    flex: none;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    padding-right: 0;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }
}
</style>
