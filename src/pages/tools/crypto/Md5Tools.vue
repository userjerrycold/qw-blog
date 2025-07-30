<template>
  <div class="tools-container">
    <div class="content-container">
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
                placeholder="每行输入一个文本值，将生成对应的 MD5 值"
              />
            </n-form-item>
            
            <div class="flex gap-2 mb-4">
              <n-button type="primary" @click="generateBatchMd5">批量生成</n-button>
              <n-button @click="resetBatchForm">清空</n-button>
            </div>
            
            <h3 class="text-base font-medium mb-2">批量 MD5 结果</h3>
            <div class="batch-result-container">
              <table class="batch-result-table">
                <thead>
                  <tr>
                    <th>原始文本</th>
                    <th>MD5 值</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in batchResults" :key="index">
                    <td>{{ item.text }}</td>
                    <td class="hash-cell">{{ outputCaseType === 'uppercase' ? item.md5.toUpperCase() : item.md5 }}</td>
                    <td>
                      <n-button text size="small" @click="copyToClipboard(outputCaseType === 'uppercase' ? item.md5.toUpperCase() : item.md5)">
                        复制
                      </n-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </n-card>
        </n-tab-pane>

        <!-- 文件 MD5 -->
        <n-tab-pane name="file" tab="文件加密">
          <n-card title="文件 MD5 计算" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                选择本地文件，计算其 MD5 值，可用于文件完整性校验
              </n-alert>
            </div>
            
            <n-upload
              v-model:file-list="fileList"
              :max="5"
              :default-upload="false"
              :multiple="true"
              @change="handleFileChange"
            >
              <n-button>选择文件</n-button>
            </n-upload>
            
            <div class="mt-4 flex gap-2">
              <n-button type="primary" @click="calculateFilesMd5" :disabled="fileList.length === 0">
                计算 MD5
              </n-button>
              <n-button @click="clearFiles" :disabled="fileList.length === 0">
                清空文件
              </n-button>
            </div>
            
            <div class="file-results mt-4">
              <h3 class="text-base font-medium mb-2">文件 MD5 结果</h3>
              <div v-if="fileResults.length > 0" class="file-results-list">
                <div v-for="(result, index) in fileResults" :key="index" class="file-result-item">
                  <div class="flex justify-between items-center">
                    <div class="file-name">{{ result.fileName }}</div>
                    <n-button text size="small" @click="copyToClipboard(outputCaseType === 'uppercase' ? result.md5.toUpperCase() : result.md5)">
                      复制
                    </n-button>
                  </div>
                  <div class="file-hash">
                    {{ outputCaseType === 'uppercase' ? result.md5.toUpperCase() : result.md5 }}
                  </div>
                </div>
              </div>
              <div v-else class="empty-result">
                <p>请选择文件并点击"计算 MD5"按钮</p>
              </div>
            </div>
          </n-card>
        </n-tab-pane>

        <!-- MD5 对比 -->
        <n-tab-pane name="compare" tab="MD5 对比">
          <n-card title="MD5 值对比" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                比较两个 MD5 哈希值是否相同，可用于验证数据完整性
              </n-alert>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <n-form-item label="MD5 值 1">
                <n-input
                  v-model:value="compareMd5First"
                  placeholder="输入第一个 MD5 值"
                />
              </n-form-item>
              
              <n-form-item label="MD5 值 2">
                <n-input
                  v-model:value="compareMd5Second"
                  placeholder="输入第二个 MD5 值"
                />
              </n-form-item>
            </div>
            
            <div class="flex gap-2 mb-4">
              <n-button type="primary" @click="compareMd5Values">比较 MD5</n-button>
              <n-button @click="resetCompareForm">清空</n-button>
            </div>
            
            <div v-if="compareResult !== null" class="compare-result mt-4">
              <n-alert v-if="compareResult" type="success">
                <template #icon>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </template>
                MD5 值匹配！两个 MD5 哈希值完全相同。
              </n-alert>
              <n-alert v-else type="error">
                <template #icon>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </template>
                MD5 值不匹配！两个 MD5 哈希值不相同。
              </n-alert>
            </div>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  NCard, NButton, NTabs, NTabPane, NForm, NFormItem, 
  NInput, NAlert, NUpload, NSelect 
} from 'naive-ui'
import md5 from 'crypto-js/md5'
import { enc } from 'crypto-js'

const router = useRouter()
const message = useMessage()

// 设置页面标题
onMounted(() => {
  document.title = '薯条-MD5加密工具'
})

// 文本 MD5
const textInput = ref('')
const md5Result32 = ref('')
const md5Result16 = ref('')
const outputCaseType = ref('lowercase')

function generateMd5FromText() {
  if (!textInput.value) {
    message.warning('请输入文本内容')
    return
  }
  
  try {
    const hashValue = md5(textInput.value).toString(enc.Hex)
    md5Result32.value = outputCaseType.value === 'uppercase' ? hashValue.toUpperCase() : hashValue
    md5Result16.value = outputCaseType.value === 'uppercase' 
      ? hashValue.substring(8, 24).toUpperCase() 
      : hashValue.substring(8, 24)
    message.success('MD5 生成成功')
  } catch (error) {
    message.error('MD5 生成失败')
    md5Result32.value = ''
    md5Result16.value = ''
  }
}

function resetTextForm() {
  textInput.value = ''
  md5Result32.value = ''
  md5Result16.value = ''
}

// 批量 MD5
const batchInput = ref('')
const batchResults = ref<Array<{text: string, md5: string}>>([])

function generateBatchMd5() {
  if (!batchInput.value) {
    message.warning('请输入批量文本内容')
    return
  }
  
  try {
    const lines = batchInput.value.split('\n').filter(line => line.trim())
    if (lines.length === 0) {
      message.warning('请至少输入一行文本')
      return
    }
    
    batchResults.value = lines.map(line => ({
      text: line,
      md5: md5(line).toString(enc.Hex)
    }))
    
    message.success(`已生成 ${batchResults.value.length} 个 MD5 值`)
  } catch (error) {
    message.error('批量 MD5 生成失败')
    batchResults.value = []
  }
}

function resetBatchForm() {
  batchInput.value = ''
  batchResults.value = []
}

// 文件 MD5
const fileList = ref<any[]>([])
const fileResults = ref<Array<{fileName: string, md5: string}>>([])

function handleFileChange() {
  // 仅用于触发文件选择事件
}

function calculateFilesMd5() {
  if (fileList.value.length === 0) {
    message.warning('请先选择文件')
    return
  }
  
  // 清空之前的结果
  fileResults.value = []
  
  // 处理每个文件
  const promises = fileList.value.map(file => {
    return new Promise<{fileName: string, md5: string}>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file.file)
      
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result
          if (arrayBuffer) {
            // 使用crypto-js处理ArrayBuffer
            const wordArray = enc.Latin1.parse(
              new Uint8Array(arrayBuffer as ArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
            )
            const hashValue = md5(wordArray).toString(enc.Hex)
            resolve({ fileName: file.name, md5: hashValue })
          } else {
            reject(new Error('文件读取失败'))
          }
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => {
        reject(new Error('文件读取错误'))
      }
    })
  })
  
  Promise.all(promises)
    .then(results => {
      fileResults.value = results
      message.success(`已计算 ${results.length} 个文件的 MD5 值`)
    })
    .catch(error => {
      message.error(`文件处理错误: ${error instanceof Error ? error.message : '未知错误'}`)
    })
}

function clearFiles() {
  fileList.value = []
  fileResults.value = []
}

// MD5 对比
const compareMd5First = ref('')
const compareMd5Second = ref('')
const compareResult = ref<boolean | null>(null)

function compareMd5Values() {
  if (!compareMd5First.value || !compareMd5Second.value) {
    message.warning('请输入两个 MD5 值进行比较')
    return
  }
  
  // 标准化比较（忽略大小写）
  const md5First = compareMd5First.value.toLowerCase().replace(/[^a-f0-9]/g, '')
  const md5Second = compareMd5Second.value.toLowerCase().replace(/[^a-f0-9]/g, '')
  
  // 检查是否是有效的MD5
  const isValidMd5 = (md5: string) => md5.length === 32 || md5.length === 16
  
  if (!isValidMd5(md5First) || !isValidMd5(md5Second)) {
    message.warning('请输入有效的 MD5 值（16位或32位十六进制字符串）')
    return
  }
  
  // 执行比较
  compareResult.value = md5First === md5Second
}

function resetCompareForm() {
  compareMd5First.value = ''
  compareMd5Second.value = ''
  compareResult.value = null
}

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

.result-display {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #eee;
}

.hash-value {
  font-family: monospace;
  word-break: break-all;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
}

.batch-result-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8px;
}

.batch-result-table {
  width: 100%;
  border-collapse: collapse;
}

.batch-result-table th,
.batch-result-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.batch-result-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.hash-cell {
  font-family: monospace;
  font-size: 14px;
  max-width: 320px;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.file-results-list {
  margin-top: 16px;
}

.file-result-item {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #eee;
}

.file-name {
  font-weight: 600;
  margin-bottom: 8px;
}

.file-hash {
  font-family: monospace;
  word-break: break-all;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
}

.empty-result {
  padding: 20px;
  text-align: center;
  color: #999;
}

.compare-result {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .content-container {
    padding: 15px;
  }
  
  .hash-cell {
    max-width: 180px;
  }
}
</style> 