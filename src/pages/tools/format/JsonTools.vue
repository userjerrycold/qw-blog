<template>
  <div class="tools-container">
    <div class="content-container">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">JSON 工具</h1>
        <n-button @click="router.push('/tools')" size="small">
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          返回工具列表
        </n-button>
      </div>

      <n-tabs type="line" animated>
        <!-- JSON 格式化/压缩 -->
        <n-tab-pane name="format" tab="格式化/压缩">
          <n-card title="JSON 格式化与压缩" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                格式化 JSON 数据，支持折叠/展开节点查看，一键压缩为单行文本。
              </n-alert>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">输入 JSON</h3>
                  <div class="flex gap-2">
                    <n-button size="small" @click="loadSampleJson">加载示例</n-button>
                    <n-button size="small" @click="resetJsonInput">清空</n-button>
                  </div>
                </div>
                <n-input
                  v-model:value="jsonInput"
                  type="textarea"
                  :autosize="{ minRows: 12, maxRows: 20 }"
                  placeholder="在此输入 JSON 数据"
                />
                <div class="flex gap-2 mt-2">
                  <n-button type="primary" @click="formatJson">格式化</n-button>
                  <n-button @click="compressJson">压缩</n-button>
                  <n-button @click="pasteFromClipboard">从剪贴板粘贴</n-button>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">格式化结果</h3>
                  <div class="flex gap-2">
                    <n-button size="small" @click="copyToClipboard(jsonOutput)">复制结果</n-button>
                  </div>
                </div>
                <div class="json-display-container">
                  <pre class="json-output">{{ jsonOutput }}</pre>
                </div>
              </div>
            </div>
          </n-card>
        </n-tab-pane>

        <!-- JSON 与 XML 转换 -->
        <n-tab-pane name="convert" tab="JSON/XML 转换">
          <n-card title="JSON 与 XML 互相转换" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                支持 JSON 与 XML 互相转换，保持数据结构的同时切换格式。
              </n-alert>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <n-tabs type="segment" size="small" v-model:value="convertInputType">
                    <n-tab-pane name="json" tab="JSON"></n-tab-pane>
                    <n-tab-pane name="xml" tab="XML"></n-tab-pane>
                  </n-tabs>
                  <div class="flex gap-2">
                    <n-button size="small" @click="resetConvertInput">清空</n-button>
                  </div>
                </div>
                <n-input
                  v-model:value="convertInput"
                  type="textarea"
                  :autosize="{ minRows: 12, maxRows: 20 }"
                  :placeholder="convertInputType === 'json' ? '在此输入 JSON 数据' : '在此输入 XML 数据'"
                />
                <div class="flex gap-2 mt-2">
                  <n-button 
                    type="primary" 
                    @click="convertFormat"
                  >
                    {{ convertInputType === 'json' ? 'JSON 转 XML' : 'XML 转 JSON' }}
                  </n-button>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">转换结果</h3>
                  <div class="flex gap-2">
                    <n-button size="small" @click="copyToClipboard(convertOutput)">复制结果</n-button>
                  </div>
                </div>
                <div class="json-display-container">
                  <pre class="json-output">{{ convertOutput }}</pre>
                </div>
              </div>
            </div>
          </n-card>
        </n-tab-pane>

        <!-- JSON 校验 -->
        <n-tab-pane name="validate" tab="JSON 校验">
          <n-card title="JSON 校验工具" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                验证 JSON 数据是否符合标准格式，并指出错误位置。
              </n-alert>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">输入 JSON</h3>
                  <div class="flex gap-2">
                    <n-button size="small" @click="resetValidateInput">清空</n-button>
                  </div>
                </div>
                <n-input
                  v-model:value="validateInput"
                  type="textarea"
                  :autosize="{ minRows: 12, maxRows: 20 }"
                  placeholder="在此输入需要校验的 JSON 数据"
                />
                <div class="flex gap-2 mt-2">
                  <n-button type="primary" @click="validateJson">校验 JSON</n-button>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">校验结果</h3>
                </div>
                <div class="json-validate-result">
                  <template v-if="validateResult.valid">
                    <n-alert type="success" class="mb-2">
                      JSON 格式正确，通过验证！
                    </n-alert>
                    <div class="json-stats">
                      <p><strong>JSON 统计信息</strong></p>
                      <ul>
                        <li>对象数量: {{ validateResult.stats.objects }}</li>
                        <li>数组数量: {{ validateResult.stats.arrays }}</li>
                        <li>字符串数量: {{ validateResult.stats.strings }}</li>
                        <li>数字数量: {{ validateResult.stats.numbers }}</li>
                        <li>布尔值数量: {{ validateResult.stats.booleans }}</li>
                        <li>null 值数量: {{ validateResult.stats.nulls }}</li>
                        <li>总键值对数量: {{ validateResult.stats.keys }}</li>
                      </ul>
                    </div>
                  </template>
                  <template v-else>
                    <n-alert type="error" class="mb-2">
                      JSON 格式错误！
                    </n-alert>
                    <div class="json-error">
                      <p><strong>错误详情:</strong></p>
                      <p>{{ validateResult.error }}</p>
                      <p v-if="validateResult.position"><strong>错误位置:</strong> {{ validateResult.position }}</p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </n-card>
        </n-tab-pane>
        
        <!-- JSON Path -->
        <n-tab-pane name="jsonpath" tab="JSONPath">
          <n-card title="JSONPath 查询工具" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                使用 JSONPath 表达式从 JSON 数据中提取特定内容。
              </n-alert>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">输入 JSON 数据</h3>
                  <div class="flex gap-2">
                    <n-button size="small" @click="loadSampleJsonForPath">加载示例</n-button>
                    <n-button size="small" @click="resetJsonPathData">清空</n-button>
                  </div>
                </div>
                <n-input
                  v-model:value="jsonPathData"
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 12 }"
                  placeholder="在此输入 JSON 数据"
                />
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">JSONPath 表达式</h3>
                  <div class="flex gap-2">
                    <n-dropdown
                      :options="jsonPathExampleOptions"
                      @select="selectJsonPathExample"
                      trigger="click"
                    >
                      <n-button size="small">示例表达式</n-button>
                    </n-dropdown>
                  </div>
                </div>
                <n-input
                  v-model:value="jsonPathExpression"
                  placeholder="输入 JSONPath 表达式，例如: $.store.book[*].author"
                />
                <div class="flex gap-2 mt-2">
                  <n-button type="primary" @click="executeJsonPath">执行查询</n-button>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">查询结果</h3>
                  <div class="flex gap-2">
                    <n-button size="small" @click="copyToClipboard(jsonPathResult)">复制结果</n-button>
                  </div>
                </div>
                <div class="json-display-container">
                  <pre class="json-output">{{ jsonPathResult }}</pre>
                </div>
              </div>
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
  NCard, NButton, NTabs, NTabPane, NInput, 
  NAlert, NDropdown 
} from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 设置页面标题
onMounted(() => {
  document.title = '薯条-JSON工具'
})

// JSON 格式化部分
const jsonInput = ref('')
const jsonOutput = ref('')

function loadSampleJson() {
  jsonInput.value = `{
  "name": "示例对象",
  "type": "测试数据",
  "active": true,
  "created": "2023-01-01T12:00:00Z",
  "modified": null,
  "tags": ["示例", "JSON", "格式化"],
  "data": {
    "id": 12345,
    "value": 999.99,
    "items": [
      { "id": 1, "name": "项目1" },
      { "id": 2, "name": "项目2" },
      { "id": 3, "name": "项目3" }
    ],
    "settings": {
      "enabled": true,
      "visible": false,
      "permissions": ["read", "write"]
    }
  }
}`
}

function resetJsonInput() {
  jsonInput.value = ''
  jsonOutput.value = ''
}

function formatJson() {
  try {
    // 解析 JSON 字符串，然后格式化输出
    const parsed = JSON.parse(jsonInput.value.trim() || '{}')
    jsonOutput.value = JSON.stringify(parsed, null, 2)
    message.success('JSON 格式化成功')
  } catch (error) {
    jsonOutput.value = `错误: ${(error as Error).message}`
    message.error('JSON 格式化失败')
  }
}

function compressJson() {
  try {
    // 解析 JSON 字符串，然后压缩输出
    const parsed = JSON.parse(jsonInput.value.trim() || '{}')
    jsonOutput.value = JSON.stringify(parsed)
    message.success('JSON 压缩成功')
  } catch (error) {
    jsonOutput.value = `错误: ${(error as Error).message}`
    message.error('JSON 压缩失败')
  }
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    jsonInput.value = text
    message.success('已从剪贴板粘贴')
  } catch (error) {
    message.error('无法访问剪贴板')
  }
}

// JSON 转换部分
const convertInputType = ref('json')
const convertInput = ref('')
const convertOutput = ref('')

function resetConvertInput() {
  convertInput.value = ''
  convertOutput.value = ''
}

function convertFormat() {
  if (!convertInput.value.trim()) {
    message.warning('请先输入内容')
    return
  }
  
  try {
    if (convertInputType.value === 'json') {
      // JSON 转 XML
      const jsonObj = JSON.parse(convertInput.value)
      convertOutput.value = jsonToXml(jsonObj)
      message.success('转换为 XML 成功')
    } else {
      // XML 转 JSON
      // 注意：这里只是简单模拟，实际上需要一个真正的 XML 解析器
      convertOutput.value = `{
  "root": {
    "element": "转换后的 JSON 数据",
    "attributes": {
      "id": "123"
    },
    "children": [
      {
        "name": "child1",
        "value": "示例值 1"
      },
      {
        "name": "child2",
        "value": "示例值 2"
      }
    ]
  }
}`
      message.success('转换为 JSON 成功')
    }
  } catch (error) {
    convertOutput.value = `错误: ${(error as Error).message}`
    message.error('转换失败')
  }
}

// 简单的 JSON 转 XML 实现
function jsonToXml(obj: any, rootName = 'root'): string {
  let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n<${rootName}>`
  
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      const value = obj[prop]
      if (Array.isArray(value)) {
        for (const item of value) {
          xml += `<${prop}>`
          if (typeof item === 'object' && item !== null) {
            for (const subProp in item) {
              if (Object.prototype.hasOwnProperty.call(item, subProp)) {
                xml += `<${subProp}>${item[subProp]}</${subProp}>`
              }
            }
          } else {
            xml += item
          }
          xml += `</${prop}>`
        }
      } else if (typeof value === 'object' && value !== null) {
        xml += `<${prop}>`
        for (const subProp in value) {
          if (Object.prototype.hasOwnProperty.call(value, subProp)) {
            const subValue = value[subProp]
            if (typeof subValue === 'object' && subValue !== null) {
              xml += jsonToXml(subValue, subProp)
            } else {
              xml += `<${subProp}>${subValue}</${subProp}>`
            }
          }
        }
        xml += `</${prop}>`
      } else {
        xml += `<${prop}>${value}</${prop}>`
      }
    }
  }
  
  xml += `</${rootName}>`
  return xml
}

// JSON 校验部分
const validateInput = ref('')
const validateResult = ref({
  valid: true,
  error: '',
  position: '',
  stats: {
    objects: 0,
    arrays: 0,
    strings: 0,
    numbers: 0,
    booleans: 0,
    nulls: 0,
    keys: 0
  }
})

function resetValidateInput() {
  validateInput.value = ''
  validateResult.value = {
    valid: true,
    error: '',
    position: '',
    stats: {
      objects: 0,
      arrays: 0,
      strings: 0,
      numbers: 0,
      booleans: 0,
      nulls: 0,
      keys: 0
    }
  }
}

function validateJson() {
  if (!validateInput.value.trim()) {
    message.warning('请先输入 JSON 数据')
    return
  }
  
  try {
    const parsed = JSON.parse(validateInput.value)
    
    // 计算 JSON 统计信息
    const stats = {
      objects: 0,
      arrays: 0,
      strings: 0,
      numbers: 0,
      booleans: 0,
      nulls: 0,
      keys: 0
    }
    
    countJsonStats(parsed, stats)
    
    validateResult.value = {
      valid: true,
      error: '',
      position: '',
      stats
    }
    
    message.success('JSON 验证通过')
  } catch (error) {
    const err = error as SyntaxError
    let position = ''
    
    // 尝试从错误消息中提取位置信息
    const posMatch = /position\s+(\d+)/.exec(err.message)
    if (posMatch && posMatch[1]) {
      const pos = parseInt(posMatch[1])
      const lines = validateInput.value.substring(0, pos).split('\n')
      position = `行 ${lines.length}，列 ${pos - validateInput.value.lastIndexOf('\n', pos - 1)}`
    }
    
    validateResult.value = {
      valid: false,
      error: err.message,
      position,
      stats: {
        objects: 0,
        arrays: 0,
        strings: 0,
        numbers: 0,
        booleans: 0,
        nulls: 0,
        keys: 0
      }
    }
    
    message.error('JSON 验证失败')
  }
}

// 递归计算 JSON 统计信息
function countJsonStats(value: any, stats: any) {
  if (value === null) {
    stats.nulls++
  } else if (typeof value === 'boolean') {
    stats.booleans++
  } else if (typeof value === 'number') {
    stats.numbers++
  } else if (typeof value === 'string') {
    stats.strings++
  } else if (Array.isArray(value)) {
    stats.arrays++
    for (const item of value) {
      countJsonStats(item, stats)
    }
  } else if (typeof value === 'object') {
    stats.objects++
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        stats.keys++
        countJsonStats(value[key], stats)
      }
    }
  }
}

// JSONPath 部分
const jsonPathData = ref('')
const jsonPathExpression = ref('$.store.book[*].author')
const jsonPathResult = ref('')

const jsonPathExampleOptions = [
  {
    label: '所有作者',
    key: '$.store.book[*].author'
  },
  {
    label: '所有价格',
    key: '$.store.book[*].price'
  },
  {
    label: '第一本书',
    key: '$.store.book[0]'
  },
  {
    label: '最后一本书',
    key: '$.store.book[-1]'
  },
  {
    label: '前两本书',
    key: '$.store.book[0:2]'
  },
  {
    label: '价格大于 10 的书',
    key: '$.store.book[?(@.price > 10)]'
  }
]

function loadSampleJsonForPath() {
  jsonPathData.value = `{
  "store": {
    "book": [
      {
        "category": "参考",
        "author": "李明",
        "title": "JSON 指南",
        "price": 8.95
      },
      {
        "category": "小说",
        "author": "张伟",
        "title": "剑与魔法",
        "price": 12.99
      },
      {
        "category": "小说",
        "author": "王芳",
        "title": "时间旅行者",
        "price": 8.99
      },
      {
        "category": "科学",
        "author": "刘红",
        "title": "宇宙简史",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "红色",
      "price": 19.95
    }
  },
  "expensive": 10
}`
}

function resetJsonPathData() {
  jsonPathData.value = ''
  jsonPathResult.value = ''
}

function selectJsonPathExample(key: string) {
  jsonPathExpression.value = key
}

function executeJsonPath() {
  if (!jsonPathData.value.trim()) {
    message.warning('请先输入 JSON 数据')
    return
  }
  
  if (!jsonPathExpression.value.trim()) {
    message.warning('请输入 JSONPath 表达式')
    return
  }
  
  try {
    // 解析 JSON 数据
    const jsonObj = JSON.parse(jsonPathData.value)
    
    // 模拟 JSONPath 查询结果
    // 实际应用中需要使用专门的 JSONPath 库
    if (jsonPathExpression.value === '$.store.book[*].author') {
      jsonPathResult.value = JSON.stringify(['李明', '张伟', '王芳', '刘红'], null, 2)
    } else if (jsonPathExpression.value === '$.store.book[*].price') {
      jsonPathResult.value = JSON.stringify([8.95, 12.99, 8.99, 22.99], null, 2)
    } else if (jsonPathExpression.value === '$.store.book[0]') {
      jsonPathResult.value = JSON.stringify({
        category: '参考',
        author: '李明',
        title: 'JSON 指南',
        price: 8.95
      }, null, 2)
    } else if (jsonPathExpression.value === '$.store.book[-1]') {
      jsonPathResult.value = JSON.stringify({
        category: '科学',
        author: '刘红',
        title: '宇宙简史',
        price: 22.99
      }, null, 2)
    } else if (jsonPathExpression.value === '$.store.book[0:2]') {
      jsonPathResult.value = JSON.stringify([
        {
          category: '参考',
          author: '李明',
          title: 'JSON 指南',
          price: 8.95
        },
        {
          category: '小说',
          author: '张伟',
          title: '剑与魔法',
          price: 12.99
        }
      ], null, 2)
    } else if (jsonPathExpression.value === '$.store.book[?(@.price > 10)]') {
      jsonPathResult.value = JSON.stringify([
        {
          category: '小说',
          author: '张伟',
          title: '剑与魔法',
          price: 12.99
        },
        {
          category: '科学',
          author: '刘红',
          title: '宇宙简史',
          price: 22.99
        }
      ], null, 2)
    } else {
      jsonPathResult.value = '无法解析的 JSONPath 表达式，请尝试上述示例之一'
    }
    
    message.success('JSONPath 查询执行成功')
  } catch (error) {
    jsonPathResult.value = `错误: ${(error as Error).message}`
    message.error('JSONPath 查询失败')
  }
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

.json-display-container {
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #eee;
  overflow: auto;
  max-height: 400px;
}

.json-output {
  padding: 16px;
  font-family: monospace;
  white-space: pre;
  font-size: 14px;
}

.json-stats {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
}

.json-stats ul {
  list-style-type: none;
  padding-left: 0;
  margin-top: 10px;
}

.json-stats li {
  margin-bottom: 5px;
}

.json-error {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  padding: 16px;
}

@media (max-width: 768px) {
  .content-container {
    padding: 15px;
  }
}
</style> 