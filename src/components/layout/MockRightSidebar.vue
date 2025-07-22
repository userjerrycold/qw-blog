<template>
  <aside class="mock-sidebar scrollbar-hide" style="height:100%; border-left:1px solid var(--color-border);">
    <div class="config-panel">
      <div class="panel-header">
        <h3 class="panel-title">{{ isEditing ? '编辑接口' : '创建接口' }}</h3>
        <p class="panel-subtitle">配置接口参数和响应数据</p>
      </div>
      
      <n-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        size="small"
        class="form-container"
      >
        <!-- 接口路径 -->
        <div class="form-group">
          <div class="form-item">
            <div class="form-label">接口路径 *</div>
            <div class="form-content">
              <n-input 
                v-model:value="formModel.endpoint" 
                placeholder="/api/User"
                :status="endpointStatus"
                class="rounded-input"
              />
              <div class="endpoint-display">
                http://10.215.211.31:9090{{ formModel.endpoint.startsWith('/') ? '' : '/' }}{{ formModel.endpoint || '/api/path' }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分类 -->
        <div class="form-group">
          <div class="form-item">
            <div class="form-label">分类</div>
            <div class="form-content">
              <n-select
                v-model:value="formModel.category"
                :options="categoryOptions"
                placeholder="选择分类"
                class="rounded-input"
                style="width: 180px;"
              />
            </div>
          </div>
        </div>
        
        <!-- 超时时间 -->
        <div class="form-group">
          <div class="form-item">
            <div class="form-label">超时时间</div>
            <div class="form-content">
              <div class="timeout-input-container">
                <input 
                  type="number" 
                  v-model="formModel.timeout" 
                  class="timeout-input-large" 
                  min="0" 
                  max="10000"
                  style="width: 120px;"
                />
                <span class="timeout-suffix">ms</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 状态 -->
        <div class="form-group">
          <div class="form-item">
            <div class="form-label">状态</div>
            <div class="form-content">
              <n-switch
                v-model:value="formModel.isActive"
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
            </div>
          </div>
        </div>
        
        <!-- 响应数据 -->
        <div class="form-group">
          <div class="form-label-row">
            <div class="form-label">响应数据</div>
            <div class="editor-actions">
              <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                  <n-button quaternary @click="formatJsonResponse" :disabled="!!jsonError">
                    <n-icon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" fill="currentColor"/>
                      </svg>
                    </n-icon>
                  </n-button>
                </template>
                格式化JSON
              </n-tooltip>
              <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                  <n-button quaternary @click="minifyJsonResponse" :disabled="!!jsonError">
                    <n-icon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.89 10.105L19.89 10.105C19.9697 10.1842 20.0097 10.2899 20 10.4V17.5C20 19.433 18.433 21 16.5 21H7.5C5.567 21 4 19.433 4 17.5V6.5C4 4.567 5.567 3 7.5 3H16.5C18.433 3 20 4.567 20 6.5V6.6C20.0097 6.71009 19.9697 6.81575 19.89 6.895L15.5 11.295L15.5 11.295C15.3946 11.4004 15.2516 11.4602 15.1 11.46C14.9484 11.4598 14.8054 11.3996 14.7 11.294L12.5 9.095L10.294 11.3C10.1889 11.4058 10.0457 11.4663 9.894 11.4666C9.74228 11.4669 9.59879 11.407 9.493 11.302L9.493 11.302L9.489 11.298L8.995 10.804L8.989 10.798C8.88583 10.6916 8.82669 10.5499 8.8266 10.4008C8.82651 10.2516 8.88547 10.1098 8.989 10.0034L8.989 10.0033L8.995 9.997L11.202 7.79L11.208 7.784C11.3144 7.67839 11.456 7.61925 11.605 7.61916C11.7541 7.61906 11.8958 7.67803 12.002 7.784L12.002 7.784L12.008 7.79L14.2 10L17.982 6.217L17.988 6.211C18.0947 6.10437 18.2366 6.04524 18.386 6.04516C18.5353 6.04507 18.6773 6.104 18.784 6.21L19.89 10.105Z" fill="currentColor" stroke="currentColor" stroke-width="0.1"/>
                      </svg>
                    </n-icon>
                  </n-button>
                </template>
                压缩JSON
              </n-tooltip>
              <n-tooltip trigger="hover" placement="bottom">
                <template #trigger>
                  <n-button quaternary @click="generateSampleJson">
                    <n-icon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4h2v4zm0-6h-2V7h2v4z" fill="currentColor"/>
                      </svg>
                    </n-icon>
                  </n-button>
                </template>
                生成示例
              </n-tooltip>
              <div class="editor-status" :class="{ 'editor-status-error': jsonError }">
                <div class="status-dot" :class="{ 'status-dot-error': jsonError }"></div>
                {{ jsonError ? '错误' : '正确' }}
              </div>
            </div>
          </div>
          <div class="editor-container">
            <monaco-editor
              v-model:value="formModel.response"
              language="json"
              :options="editorOptions"
              @update:value="validateJson"
              class="json-editor"
            />
            <div class="editor-overlay" v-if="!formModel.response">
              <div class="editor-placeholder">在此处输入JSON响应数据</div>
            </div>
          </div>
          <div class="form-tip" :class="{ 'form-error': jsonError }">
            {{ jsonError || '' }}
          </div>
        </div>
      </n-form>
      
      <div class="sticky-actions">
        <div class="action-buttons">
          <n-button
            class="reset-btn"
            @click="resetForm"
            round
          >
            重置
          </n-button>
          <n-button
            type="primary"
            class="submit-btn"
            @click="handleSubmit"
            :disabled="!isFormValid || isSubmitting"
            :loading="isSubmitting"
            round
          >
            {{ isEditing ? '更新' : '创建' }}
          </n-button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { 
  NIcon, NButton, NAlert, NSelect, 
  NInput, NForm, NSlider, NSwitch,
  NTooltip
} from 'naive-ui'
import MonacoEditor from 'monaco-editor-vue3'
import { debounce } from 'lodash-es'

interface MockConfig {
  id?: string
  endpoint: string
  response: string
  timeout: number
  isActive: boolean
  category?: string
}

// 表单状态
const formRef = ref(null)
const isEditing = ref(false)
const isSubmitting = ref(false)
const originalId = ref<string | null>(null)

const formModel = reactive<MockConfig>({
  endpoint: '',
  response: '',
  timeout: 300,
  isActive: true,
  category: 'default'
})

const endpointStatus = ref<'success' | 'error' | undefined>(undefined)
const endpointMessage = ref('')
const jsonError = ref('')

// 滑块标记
const sliderMarks = {
  0: '0',
  2000: '2s',
  5000: '5s',
  10000: '10s'
}

// 表单验证规则
const rules = {
  endpoint: [
    { required: true, message: '请输入接口路径', trigger: 'blur' },
  ],
  response: [
    { required: true, message: '请输入响应数据', trigger: 'blur' }
  ]
}

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
  contextmenu: false,
  roundedSelection: true,
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
    useShadows: false
  },
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  renderIndentGuides: true,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 3,
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on'
}

// 分类选项
const categoryOptions = [
  { label: '默认', value: 'default' },
  { label: '用户', value: 'user' },
  { label: '订单', value: 'order' },
  { label: '产品', value: 'product' },
  { label: '支付', value: 'payment' }
]

// 计算属性
const isFormValid = computed(() => {
  return formModel.endpoint.trim() !== '' && 
    formModel.response.trim() !== '' && 
    !jsonError.value;
})

// 表单验证
function validateEndpoint(value: string) {
  if (!value) {
    endpointStatus.value = 'error'
    return false
  }
  
  // 简单格式验证
  if (!value.includes('/')) {
    endpointStatus.value = 'error'
    return false
  }
  
  endpointStatus.value = 'success'
  return true
}

const validateJson = debounce((value: string) => {
  if (!value.trim()) {
    jsonError.value = '响应数据不能为空'
    return
  }
  
  try {
    JSON.parse(value)
    jsonError.value = ''
  } catch (e: any) {
    jsonError.value = `JSON 格式错误: ${e.message}`
  }
}, 300)

// 样式函数
function railStyle({ focused, checked }: { focused: boolean, checked: boolean }) {
  const style = {
    background: checked ? '#52C41A' : '#FF4D4F',
    boxShadow: focused ? `0 0 0 2px ${checked ? 'rgba(82, 196, 26, 0.2)' : 'rgba(255, 77, 79, 0.2)'}` : 'none'
  }
  return style
}

// 操作函数
function handleSubmit() {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  // 验证接口路径
  if (!validateEndpoint(formModel.endpoint)) {
    isSubmitting.value = false
    return
  }
  
  // 确保 response 是有效的 JSON
  try {
    const jsonObj = JSON.parse(formModel.response)
    formModel.response = JSON.stringify(jsonObj)
  } catch (e) {
    jsonError.value = '请先修复 JSON 错误'
    isSubmitting.value = false
    return
  }
  
  // 模拟网络延迟
  setTimeout(() => {
    // 将数据提交到父组件
    emit('submit', {
      ...formModel,
      id: originalId.value
    })
    
    isSubmitting.value = false
  }, 300)
}

function resetForm() {
  formModel.endpoint = ''
  formModel.response = ''
  formModel.timeout = 300
  formModel.isActive = true
  formModel.category = 'default'
  
  originalId.value = null
  isEditing.value = false
  endpointStatus.value = undefined
  endpointMessage.value = ''
  jsonError.value = ''
}

function formatJsonResponse() {
  try {
    const obj = JSON.parse(formModel.response)
    formModel.response = JSON.stringify(obj, null, 2)
    jsonError.value = ''
  } catch (e) {
    // 如果无法解析，保持原状
  }
}

function minifyJsonResponse() {
  try {
    const obj = JSON.parse(formModel.response)
    formModel.response = JSON.stringify(obj)
    jsonError.value = ''
  } catch (e) {
    // 如果无法解析，保持原状
  }
}

function generateSampleJson() {
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
  formModel.response = JSON.stringify(sample, null, 2)
  validateJson(formModel.response)
}

// 对外暴露的方法
function updateForm(mock: MockConfig) {
  originalId.value = mock.id || null
  formModel.endpoint = mock.endpoint || ''
  formModel.response = mock.response || ''
  formModel.timeout = mock.timeout || 300
  formModel.isActive = mock.isActive !== undefined ? mock.isActive : true
  formModel.category = mock.category || 'default'
  
  isEditing.value = true
  validateEndpoint(formModel.endpoint)
  if (formModel.response) {
    try {
      // 尝试格式化 JSON
      const obj = JSON.parse(formModel.response)
      formModel.response = JSON.stringify(obj, null, 2)
      jsonError.value = ''
    } catch (e) {
      validateJson(formModel.response)
    }
  }
}

// 事件
const emit = defineEmits(['submit'])

// 暴露方法给父组件
defineExpose({
  resetForm,
  updateForm
})
</script>

<style scoped>
.mock-sidebar {
  padding: 20px;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.config-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  padding-bottom: 56px; /* Space for sticky buttons */
}

.panel-header {
  margin-bottom: 24px;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.panel-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.form-container {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.form-container::-webkit-scrollbar {
  display: none;
}

/* 表单样式 */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-item {
  display: flex;
  align-items: flex-start;
}

.form-label {
  width: 80px;
  flex-shrink: 0;
  padding-top: 6px;
}

.form-content {
  flex: 1;
}

.rounded-input {
  border-radius: 8px !important;
  overflow: hidden;
  width: 100%;
}

.rounded-input :deep(.n-input__border),
.rounded-input :deep(.n-input-wrapper) {
  border-radius: 8px !important;
}

.rounded-input :deep(.n-base-selection) {
  border-radius: 8px !important;
}

/* 移除自定义输入框内边距，使用默认样式 */

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

.form-tip {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.form-error {
  color: #FF4D4F !important;
  background-color: rgba(255, 77, 79, 0.05);
  padding: 6px 10px;
  border-radius: 6px;
  border-left: 3px solid #FF4D4F;
  font-weight: 500;
}

.timeout-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.timeout-input-large {
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
  box-sizing: border-box;
}

.timeout-input-large::-webkit-outer-spin-button,
.timeout-input-large::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.timeout-suffix {
  margin-left: 8px;
  color: #6b7280;
}

.endpoint-display {
  font-size: 12px;
  color: #6b7280;
  margin-top: 6px;
  padding: 6px 8px;
  background-color: #f9fafb;
  border-radius: 8px;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  word-break: break-all;
}

.json-editor {
  height: 300px !important;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  margin-bottom: 8px;
  width: 100%;
}

.json-editor :deep(.monaco-scrollable-element) {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.json-editor :deep(.monaco-scrollable-element::-webkit-scrollbar) {
  display: none;
}

.json-editor :deep(.monaco-editor) {
  height: 100% !important;
}

/* 行号区域优化 */
.json-editor :deep(.monaco-editor .margin) {
  width: 40px !important; /* 增加行号区域宽度 */
  background-color: #f9fafb; /* 行号区域背景色 */
  border-right: 1px solid #f0f0f0; /* 添加右侧边框 */
}

.json-editor :deep(.monaco-editor .margin .line-numbers) {
  width: 34px !important;
  text-align: right !important;
  padding-right: 8px !important; /* 行号右侧内边距 */
  color: #6b7280; /* 默认行号颜色 */
}

/* 当前行号高亮 */
.json-editor :deep(.monaco-editor .current-line ~ .line-numbers) {
  color: #1890FF !important; /* 当前行号使用蓝色 */
  font-weight: 600 !important; /* 当前行号加粗 */
}

/* 内容区域优化 */
.json-editor :deep(.monaco-editor .monaco-scrollable-element) {
  left: 40px !important; /* 匹配行号区域宽度 */
}

.json-editor :deep(.monaco-editor .view-lines) {
  width: calc(100% - 40px) !important; /* 匹配行号区域宽度 */
  left: 0 !important;
}

.json-editor :deep(.monaco-editor .cursor) {
  /* 移除固定左侧位置，让光标随文字移动 */
}

/* 当前行高亮样式 */
.json-editor :deep(.monaco-editor .current-line) {
  background-color: rgba(24, 144, 255, 0.05) !important; /* 淡蓝色背景 */
  border: none !important;
}

/* 移除滚动装饰阴影 */
.json-editor :deep(.monaco-editor .scrollbar .slider) {
  background: rgba(100, 100, 100, 0.2) !important;
  border-radius: 3px !important;
}

.json-editor :deep(.monaco-editor .decorationsOverviewRuler) {
  display: none !important;
}

.json-editor :deep(.monaco-editor-background) {
  height: 100% !important;
}

.editor-actions-grid {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.editor-actions-row {
  display: flex;
  justify-content: center;
}

.editor-actions-row.center {
  justify-content: center; /* Center the button in the grid row */
}

.action-btn {
  border-radius: 20px;
  padding: 6px 20px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 6px;
  width: 140px;
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

.sticky-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 12px 0;
  background-color: white;
  border-top: 1px solid #f0f0f0;
  z-index: 10;
}

.action-buttons {
  display: flex;
  gap: 12px;
  width: 90%;
}

.submit-btn {
  flex: 1;
  background-color: #1890FF;
}

.submit-btn:hover {
  background-color: #40a9ff;
}

.submit-btn:active {
  background-color: #096dd9;
}

.reset-btn {
  flex: 1;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* 新增样式 */
.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.editor-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.editor-status {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #52C41A;
  gap: 4px;
  margin-left: 4px;
}

.editor-status-error {
  color: #FF4D4F;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #52C41A;
}

.status-dot-error {
  background-color: #FF4D4F;
}

.editor-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
}

.editor-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(249, 250, 251, 0.8);
  pointer-events: none;
}

.editor-placeholder {
  color: #9CA3AF;
  font-size: 14px;
}

.editor-actions-container {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.editor-shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
  justify-content: center;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.shortcut-desc {
  margin-left: 2px;
}

kbd {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  color: #374151;
  display: inline-block;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-size: 11px;
  line-height: 1;
  padding: 2px 4px;
}

.action-btn-primary {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

.action-btn-primary:hover {
  background-color: #bae7ff;
  border-color: #69c0ff;
}
</style> 