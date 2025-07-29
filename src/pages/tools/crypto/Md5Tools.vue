<template>
  <PageLayout :rightSidebar="ToolsRightSidebar">
    <div class="md5-tools-container">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">MD5 加密工具</h1>
        <n-button @click="router.push('/tools')" size="small">
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          返回工具列表
        </n-button>
      </div>

      <n-alert class="mb-4" type="info">
        MD5 是一种常用的哈希算法，可将任意长度的数据转换成固定长度的字符串。注意：MD5 不是加密算法，无法解密，仅用于验证数据完整性。
      </n-alert>

      <n-tabs type="line" animated>
        <!-- 文本 MD5 -->
        <n-tab-pane name="text" tab="文本加密">
          <n-card title="文本 MD5 加密" class="mb-4">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <n-form-item label="输入文本">
                  <n-input
                    v-model:value="textInput"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="请输入要加密的文本内容"
                  />
                </n-form-item>
                
                <div class="flex gap-2 mb-4">
                  <n-button type="primary" @click="generateMd5FromText">生成 MD5</n-button>
                  <n-button @click="resetTextForm">清空</n-button>
                  <n-select 
                    v-model:value="outputCaseType" 
                    :options="[
                      { label: '小写', value: 'lowercase' },
                      { label: '大写', value: 'uppercase' }
                    ]"
                    size="small"
                    style="width: 100px;"
                  />
                </div>
              </div>

              <div>
                <h3 class="text-base font-medium mb-2">MD5 结果</h3>
                <div class="result-display">
                  <div class="flex justify-between items-center mb-2">
                    <div>32 位 MD5</div>
                    <n-button text size="small" @click="copyToClipboard(md5Result32)">
                      <template #icon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 4V16C8 17.1 8.9 18 10 18H18C19.1 18 20 17.1 20 16V7.4L16.6 4H10C8.9 4 8 4.9 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 4V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V9C4 7.9 4.9 7 6 7H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </template>
                      复制
                    </n-button>
                  </div>
                  <div class="hash-value">{{ md5Result32 }}</div>
                </div>
                
                <div class="result-display mt-4">
                  <div class="flex justify-between items-center mb-2">
                    <div>16 位 MD5 (32位中间部分)</div>
                    <n-button text size="small" @click="copyToClipboard(md5Result16)">
                      <template #icon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 4V16C8 17.1 8.9 18 10 18H18C19.1 18 20 17.1 20 16V7.4L16.6 4H10C8.9 4 8 4.9 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 4V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V9C4 7.9 4.9 7 6 7H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </template>
                      复制
                    </n-button>
                  </div>
                  <div class="hash-value">{{ md5Result16 }}</div>
                </div>
              </div>
            </div>
          </n-card>
          
          <n-card title="批量 MD5 生成" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                每行输入一个值，将批量生成对应的 MD5 值
              </n-alert>
            </div>
            
            <n-form-item label="输入多行文本">
              <n-input
                v-model:value="batchInput"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="每行输入一个文本，将批量生成 MD5"
              />
            </n-form-item>
            
            <div class="flex gap-2 mb-4">
              <n-button type="primary" @click="generateBatchMd5">批量生成 MD5</n-button>
              <n-button @click="resetBatchForm">清空</n-button>
            </div>
            
            <div v-if="batchResults.length > 0" class="batch-results">
              <h3 class="text-base font-medium mb-2">批量结果</h3>
              <n-data-table
                :columns="batchColumns"
                :data="batchResults"
                :pagination="{ pageSize: 5 }"
              />
            </div>
          </n-card>
        </n-tab-pane>

        <!-- 文件 MD5 -->
        <n-tab-pane name="file" tab="文件加密">
          <n-card title="文件 MD5 计算" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                上传文件计算 MD5 值，可用于验证文件完整性
              </n-alert>
            </div>

            <div>
              <n-upload
                class="mb-4"
                :max="1"
                :show-file-list="false"
                @change="handleFileUpload"
              >
                <n-upload-dragger>
                  <div class="flex flex-col items-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 16L4 17C4 18.6569 5.34315 20 7 20L17 20C18.6569 20 20 18.6569 20 17L20 16M16 12L12 8M12 8L8 12M12 8L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p class="mt-2">点击或拖动文件到此区域上传</p>
                    <p class="text-xs text-gray-500 mt-1">支持任意文件格式</p>
                  </div>
                </n-upload-dragger>
              </n-upload>
              
              <div v-if="fileInfo.name" class="mb-4 p-4 border border-dashed rounded">
                <div class="flex justify-between items-center mb-2">
                  <div>
                    <span class="font-medium">{{ fileInfo.name }}</span>
                    <span class="text-xs text-gray-500 ml-2">{{ formatFileSize(fileInfo.size) }}</span>
                  </div>
                  <n-button size="small" type="error" @click="resetFileForm">
                    <template #icon>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </template>
                    移除
                  </n-button>
                </div>
                
                <n-progress
                  v-if="fileProcessing"
                  :percentage="fileProgress"
                  :processing="fileProgress < 100"
                  type="line"
                  :show-indicator="false"
                  :height="12"
                />
              </div>
              
              <div v-if="fileMd5Result" class="result-display">
                <div class="flex justify-between items-center mb-2">
                  <div>文件 MD5 值</div>
                  <n-button text size="small" @click="copyToClipboard(fileMd5Result)">
                    <template #icon>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 4V16C8 17.1 8.9 18 10 18H18C19.1 18 20 17.1 20 16V7.4L16.6 4H10C8.9 4 8 4.9 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 4V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V9C4 7.9 4.9 7 6 7H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </template>
                    复制
                  </n-button>
                </div>
                <div class="hash-value">{{ fileMd5Result }}</div>
              </div>
            </div>
          </n-card>
          
          <n-card title="MD5 应用场景" class="mb-4">
            <n-collapse>
              <n-collapse-item title="文件完整性验证" name="1">
                <p>下载文件后，可以通过计算文件的 MD5 值并与提供的 MD5 值比较，确认文件是否完整、未被篡改。</p>
              </n-collapse-item>
              
              <n-collapse-item title="密码存储" name="2">
                <p>MD5 曾被广泛用于存储密码哈希值，但现在不再推荐用于密码存储，因为它容易受到彩虹表攻击。现代系统应使用更安全的哈希算法（如 bcrypt、Argon2）。</p>
              </n-collapse-item>
              
              <n-collapse-item title="数据去重" name="3">
                <p>可以使用 MD5 快速比较两个文件或数据是否相同，而无需进行逐字节比较。</p>
              </n-collapse-item>
              
              <n-collapse-item title="安全限制" name="4">
                <p>MD5 已被证实存在碰撞漏洞，不应用于安全性要求较高的场景。如需更高安全性，建议使用 SHA-256 或更强的哈希算法。</p>
              </n-collapse-item>
            </n-collapse>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  NCard, NButton, NTabs, NTabPane, NForm, NFormItem, 
  NInput, NAlert, NCollapse, NCollapseItem, NUpload,
  NUploadDragger, NProgress, NDataTable, NSelect
} from 'naive-ui'
import md5 from 'crypto-js/md5'
import { enc, lib } from 'crypto-js'
// @ts-ignore
import PageLayout from '@/components/layout/PageLayout.vue'
// @ts-ignore
import ToolsRightSidebar from '@/components/layout/ToolsRightSidebar.vue'

const router = useRouter()
const message = useMessage()

// 文本加密
const textInput = ref('')
const outputCaseType = ref('lowercase')
const md5Result32 = ref('')
const md5Result16 = computed(() => {
  if (!md5Result32.value) return ''
  return md5Result32.value.substring(8, 24)
})

// 批量加密
const batchInput = ref('')
const batchResults = ref<{ original: string; md5: string }[]>([])
const batchColumns = [
  {
    title: '原文本',
    key: 'original'
  },
  {
    title: 'MD5 结果',
    key: 'md5',
    render: (row: { original: string; md5: string }) => {
      return h(
        'div',
        {
          class: 'flex justify-between items-center'
        },
        [
          h('span', {}, row.md5),
          h(
            NButton,
            {
              text: true,
              size: 'small',
              onClick: () => copyToClipboard(row.md5)
            },
            { default: () => '复制' }
          )
        ]
      )
    }
  }
]

// 文件加密
const fileInfo = ref<{ name: string; size: number }>({ name: '', size: 0 })
const fileProcessing = ref(false)
const fileProgress = ref(0)
const fileMd5Result = ref('')

// 生成文本 MD5
function generateMd5FromText() {
  if (!textInput.value) {
    message.warning('请输入文本内容')
    return
  }

  const hashValue = md5(textInput.value).toString(enc.Hex)
  md5Result32.value = outputCaseType.value === 'uppercase' ? hashValue.toUpperCase() : hashValue
  
  message.success('MD5 生成成功')
}

// 批量生成 MD5
function generateBatchMd5() {
  if (!batchInput.value) {
    message.warning('请输入文本内容')
    return
  }
  
  const lines = batchInput.value.split('\n').filter(line => line.trim() !== '')
  
  if (lines.length === 0) {
    message.warning('请输入有效内容')
    return
  }
  
  batchResults.value = lines.map(line => {
    const hashValue = md5(line).toString(enc.Hex)
    return {
      original: line,
      md5: outputCaseType.value === 'uppercase' ? hashValue.toUpperCase() : hashValue
    }
  })
  
  message.success(`已批量生成 ${lines.length} 个 MD5 值`)
}

// 处理文件上传
function handleFileUpload(options: any) {
  const file = options.file?.file || options.file
  if (!file) return
  
  fileInfo.value = {
    name: file.name,
    size: file.size
  }
  
  fileProcessing.value = true
  fileProgress.value = 0
  fileMd5Result.value = ''
  
  // 在实际应用中，我们会使用 FileReader 和 Web Workers 处理大文件
  // 这里为了简化，使用模拟进度
  const reader = new FileReader()
  
  reader.onload = () => {
    const arrayBuffer = reader.result
    if (arrayBuffer) {
      // 由于浏览器限制，大文件实际上应该分块处理
      // 这里简化处理，假设文件已完整读取
      const wordArray = lib.WordArray.create(arrayBuffer as ArrayBuffer)
      const hashValue = md5(wordArray).toString(enc.Hex)
      fileMd5Result.value = outputCaseType.value === 'uppercase' ? hashValue.toUpperCase() : hashValue
      fileProgress.value = 100
      fileProcessing.value = false
      message.success('文件 MD5 计算完成')
    }
  }
  
  reader.onprogress = (event) => {
    if (event.lengthComputable) {
      fileProgress.value = Math.round((event.loaded / event.total) * 100)
    }
  }
  
  reader.onerror = () => {
    message.error('文件读取失败')
    fileProcessing.value = false
  }
  
  // 模拟进度增长
  const simulateProgress = () => {
    const increment = Math.floor(Math.random() * 5) + 1
    fileProgress.value = Math.min(fileProgress.value + increment, 95)
    
    if (fileProgress.value < 95) {
      setTimeout(simulateProgress, 200)
    }
  }
  
  setTimeout(simulateProgress, 200)
  
  // 开始读取文件
  reader.readAsArrayBuffer(file)
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

// 复制到剪贴板
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已复制到剪贴板')
  }).catch(() => {
    message.error('复制失败')
  })
}

// 重置表单
function resetTextForm() {
  textInput.value = ''
  md5Result32.value = ''
}

function resetBatchForm() {
  batchInput.value = ''
  batchResults.value = []
}

function resetFileForm() {
  fileInfo.value = { name: '', size: 0 }
  fileProcessing.value = false
  fileProgress.value = 0
  fileMd5Result.value = ''
}
</script>

<style scoped>
.md5-tools-container {
  padding: 10px;
}

.result-display {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #eee;
}

.hash-value {
  font-family: monospace;
  padding: 8px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  word-break: break-all;
  font-size: 14px;
}

.batch-results {
  margin-top: 16px;
}

:deep(.n-upload-dragger) {
  height: auto;
  padding: 20px;
}
</style> 