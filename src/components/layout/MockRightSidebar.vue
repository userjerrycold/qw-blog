<template>
  <aside class="mock-sidebar" style="height:100%; border-left:1px solid var(--color-border); width:100%;">
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
          <div class="form-label">接口路径 *</div>
          <n-input 
            v-model:value="formModel.endpoint" 
            placeholder="/OttService/orderStatus"
            :status="endpointStatus"
            class="rounded-input"
            name="endpoint"
          />
          <div v-if="formModel.endpoint" class="full-url">
            http://10.215.211.31:9090{{ formModel.endpoint.startsWith('/') ? '' : '/' }}{{ formModel.endpoint }}
          </div>
        </div>
        
        <!-- 分类 -->
        <div class="form-group">
          <div class="form-label">分类</div>
          <n-select
            v-model:value="formModel.category"
            :options="categoryOptions"
            placeholder="选择分类"
            class="rounded-input"
          />
        </div>
        
        <!-- 超时时间 -->
        <div class="form-group">
          <div class="form-label">超时时间</div>
          <div class="timeout-input-container">
            <input 
              type="number" 
              v-model="formModel.timeout" 
              class="timeout-input-large" 
              min="0" 
              max="10000"
            />&nbsp;&nbsp;&nbsp;ms
          </div>
        </div>
        

        
        <!-- 响应数据 -->
        <div class="form-group">
          <div class="form-label-with-switch">
            <span>响应数据</span>
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
          
          <!-- JSON编辑器 -->
          <div v-if="responseType === 'json'" class="editor-container-pro">
            <!-- 编辑器工具栏 - 简化为只显示状态 -->
            <div class="editor-toolbar-simple">
              <div class="editor-status-pro" :class="{ 'editor-status-error': jsonError }">
                <div class="status-dot-pro" :class="{ 'status-dot-error': jsonError }"></div>
                {{ jsonError ? '格式错误' : 'JSON格式正确' }}
              </div>
            </div>
            
            <!-- Monaco 编辑器 -->
            <monaco-editor
              v-model:value="formModel.response"
              language="json"
              :options="editorOptions"
              @update:value="validateJson"
              class="json-editor-pro"
            />
            
            <!-- 错误信息 -->
            <div v-if="jsonError" class="editor-error">
              <n-icon class="error-icon-pro">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>
              </n-icon>
              <span>{{ jsonError }}</span>
            </div>
          </div>
          
          <!-- 纯文本编辑器 -->
          <div v-else class="editor-container-pro">
            <n-input
              v-model:value="formModel.response"
              type="textarea"
              placeholder="在此输入纯文本响应内容"
              :autosize="{ minRows: 10, maxRows: 15 }"
              class="text-editor"
            />
          </div>
        </div>
      </n-form>
      
      <div class="sticky-actions">
        <n-button
          class="cancel-btn"
          @click="resetForm"
          round
        >
          取消
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
  </aside>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted, h } from 'vue'
import { 
  NIcon, NButton, NAlert, NSelect, 
  NInput, NForm, NSlider, NTooltip,
  useMessage
} from 'naive-ui'
import MonacoEditor from 'monaco-editor-vue3'
import { debounce } from 'lodash-es'
import axios from 'axios'

interface MockConfig {
  id?: string
  endpoint: string
  response: string
  timeout: number
  isActive: boolean
  category?: number
}

// 表单状态
const message = useMessage()
const formRef = ref(null)
const isEditing = ref(false)
const isSubmitting = ref(false)
const originalId = ref<string | null>(null)
const responseType = ref<'json' | 'text'>('json') // 新增：响应类型状态
const countdownSeconds = ref(3)

const formModel = reactive<MockConfig>({
  endpoint: '',
  response: '',
  timeout: 0,
  isActive: true, // 总是设为活跃状态
  category: 0 // 默认分类
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

// 引入统一配置的Monaco Editor选项
import { getEditorOptions } from '@/monaco-config'
const editorOptions = getEditorOptions('json')

// 分类选项
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

// 计算属性
const isFormValid = computed(() => {
  // 如果是文本模式，不验证JSON
  if (responseType.value === 'text') {
    return formModel.endpoint.trim() !== '';
  }
  
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



// 操作函数
async function handleSubmit() {
  if (!isFormValid.value) return;
  
  isSubmitting.value = true;
  
  // 验证接口路径
  if (!validateEndpoint(formModel.endpoint)) {
    isSubmitting.value = false;
    return;
  }
  
  // 如果是JSON模式，确保response是有效的JSON
  if (responseType.value === 'json' && formModel.response.trim() !== '') {
    try {
      const jsonObj = JSON.parse(formModel.response);
      formModel.response = JSON.stringify(jsonObj);
    } catch (e) {
      jsonError.value = '请先修复 JSON 错误';
      isSubmitting.value = false;
      return;
    }
  }
  
  try {
    // 准备API请求参数
    const keyword = formModel.endpoint.startsWith('/') ? formModel.endpoint : `/${formModel.endpoint}`;
    
    // 获取分类显示名称
    const categoryLabel = categoryOptions.find(opt => opt.value === formModel.category)?.label || '默认';
    
    // 调用API创建接口
    const response = await axios.post('/bestv/prepare/set', {
      keyword: keyword,
      data: formModel.response,
      timeout: formModel.timeout,
      typeString: categoryLabel
    });
    
    const { code, msg, data } = response.data;
    
    if (code === 200) {
      // 将数据提交到父组件，通知成功并传递返回的数据
      emit('submit', {
        ...formModel,
        id: originalId.value,
        url: data?.url,
        success: true
      });
      
      // 如果不是编辑模式，清空表单
      if (!isEditing.value) {
        resetForm();
      }

      // 显示倒计时通知
      showCountdownNotification(data?.url || '', 3);
    } else {
      message.error(`创建失败: ${msg || '未知错误'}`);
    }
  } catch (error) {
    console.error('接口创建失败:', error);
    message.error(`创建失败: ${error instanceof Error ? error.message : '网络错误'}`);
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  formModel.endpoint = ''
  formModel.response = ''
  formModel.timeout = 0
  formModel.isActive = true // 总是为true
  formModel.category = 0 // 默认分类
  
  originalId.value = null
  isEditing.value = false
  endpointStatus.value = undefined
  endpointMessage.value = ''
  jsonError.value = ''
  
  // 解锁endpoint，允许编辑
  const endpointElement = document.querySelector('input[name="endpoint"]');
  if (endpointElement instanceof HTMLInputElement) {
    endpointElement.readOnly = false;
  }
  
  // 重置响应类型为JSON
  responseType.value = 'json'
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

// 新增：设置响应类型
function setResponseType(type: 'json' | 'text') {
  // 如果从文本切换到JSON，尝试验证当前内容
  if (responseType.value === 'text' && type === 'json' && formModel.response.trim() !== '') {
    try {
      // 尝试解析为JSON
      JSON.parse(formModel.response);
    } catch (e) {
      // 如果不是有效JSON，清除响应内容防止切换后出错
      if (!confirm('当前内容不是有效的JSON，切换后将清空内容。是否继续？')) {
        return; // 用户取消切换
      }
      formModel.response = '';
    }
  }
  
  responseType.value = type;
  
  // 切换到JSON模式后验证
  if (type === 'json' && formModel.response.trim() !== '') {
    validateJson(formModel.response);
  } else if (type === 'text') {
    // 切换到文本模式，清除JSON错误
    jsonError.value = '';
  }
}

// 对外暴露的方法
function updateForm(mock: MockConfig) {
  originalId.value = mock.id || null;
  formModel.endpoint = mock.endpoint || '';
  formModel.timeout = mock.timeout || 300;
  formModel.isActive = true; // 总是为true，忽略传入值
  formModel.category = typeof mock.category === 'number' ? mock.category : 0; // 默认分类为0
  formModel.response = mock.response || '';
  
  // 锁定endpoint，编辑模式下不允许修改路径
  const endpointElement = document.querySelector('input[name="endpoint"]');
  if (endpointElement instanceof HTMLInputElement) {
    endpointElement.readOnly = true;
  }
  
  isEditing.value = true;
  validateEndpoint(formModel.endpoint);
  
  // 尝试判断是否为JSON
  if (formModel.response) {
    try {
      // 尝试解析JSON
      JSON.parse(formModel.response);
      // 如果成功，使用JSON模式
      responseType.value = 'json';
      
      // 尝试格式化JSON
      const obj = JSON.parse(formModel.response);
      formModel.response = JSON.stringify(obj, null, 2);
      jsonError.value = '';
    } catch (e) {
      // 如果解析失败，使用文本模式
      responseType.value = 'text';
      jsonError.value = '';
    }
  }
}

// 倒计时刷新通知
function showCountdownNotification(url: string, seconds: number) {
  // 创建倒计时变量
  let countDown = seconds;
  
  // 创建一个自定义倒计时弹窗
  const countdownDiv = document.createElement('div');
  countdownDiv.style.position = 'fixed';
  countdownDiv.style.top = '20px';
  countdownDiv.style.left = '50%';
  countdownDiv.style.transform = 'translateX(-50%)';
  countdownDiv.style.padding = '12px 24px';
  countdownDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  countdownDiv.style.color = 'white';
  countdownDiv.style.borderRadius = '8px';
  countdownDiv.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.25)';
  countdownDiv.style.zIndex = '1001';
  countdownDiv.style.transition = 'opacity 0.3s';
  countdownDiv.style.fontSize = '16px';
  countdownDiv.style.fontWeight = '500';
  
  // 添加倒计时消息
  const textSpan = document.createElement('span');
  textSpan.innerText = `接口创建成功，${countDown}秒后自动刷新`;
  countdownDiv.appendChild(textSpan);
  
  // 添加到页面
  document.body.appendChild(countdownDiv);
  
  // 创建倒计时函数
  const updateCountdown = () => {
    countDown--;
    
    if (countDown >= 0) {
      // 只更新秒数部分
      textSpan.innerText = `接口创建成功，${countDown}秒后自动刷新`;
    } else {
      // 倒计时结束，淡出弹窗
      countdownDiv.style.opacity = '0';
      
      // 清除弹窗并刷新页面
      setTimeout(() => {
        if (countdownDiv.parentNode) {
          document.body.removeChild(countdownDiv);
        }
        window.location.reload();
      }, 300);
    }
  };
  
  // 开始倒计时
  const timer = setInterval(updateCountdown, 1000);
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
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.mock-sidebar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.config-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  padding-bottom: 70px; /* Space for fixed buttons */
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
  /* 移除滚动属性，让父容器控制滚动 */
  max-width: 100%;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
  max-width: 100%;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.rounded-input {
  border-radius: 8px !important;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}

.rounded-input :deep(.n-input__border),
.rounded-input :deep(.n-input-wrapper) {
  border-radius: 8px !important;
}

.rounded-input :deep(.n-base-selection) {
  border-radius: 8px !important;
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
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-tip {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.form-error {
  color: #d32f2f !important;
  background-color: rgba(211, 47, 47, 0.05);
  padding: 6px 10px;
  border-radius: 6px;
  border-left: 3px solid #d32f2f;
  font-weight: 500;
}

.timeout-input-container {
  position: relative;
}

.timeout-input-large {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 6px 8px 6px 10px;
  font-size: 13px;
  color: #374151;
  appearance: none;
  -moz-appearance: textfield;
  text-align: center;
  padding-right: 12px;
  background-color: #fff;
  box-sizing: border-box;
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

/* 删除旧的编辑器样式 */
.json-editor {
  display: none;
}



/* 简化版工具栏 */
.editor-toolbar-simple {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

/* 确保编辑器没有自己的滚动条 */
.json-editor-pro :deep(.monaco-editor .overflow-guard) {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

.json-editor-pro :deep(.monaco-editor .overflow-guard::-webkit-scrollbar) {
  display: none !important;
}

.sticky-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 0;
  background-color: white;
  border-top: 1px solid #f0f0f0;
  z-index: 10;
}

.submit-btn {
  min-width: 80px;
  background-color: #4CAF50;
  border: none;
}

.submit-btn:hover {
  background-color: #43A047;
}

.submit-btn:active {
  background-color: #388E3C;
}

.cancel-btn {
  min-width: 80px;
}

/* 新的编辑器样式，匹配编辑弹窗的样式 */
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
  background-color: #4CAF50;
}

.status-dot-error {
  background-color: #d32f2f;
}

.editor-actions-pro {
  display: flex;
  gap: 8px;
}

.json-editor-pro {
  height: 300px !important;
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



.form-label-with-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
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

.text-editor {
  width: 100%;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-size: 14px;
}

.text-editor :deep(.n-input__textarea) {
  border-radius: 0;
  padding: 12px;
}
</style> 