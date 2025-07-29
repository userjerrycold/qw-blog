<template>
  <PageLayout :rightSidebar="ToolsRightSidebar">
    <div class="json-tools-container">
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
                  <h3 class="text-base font-medium">转换结果（{{ convertInputType === 'json' ? 'XML' : 'JSON' }}）</h3>
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

        <!-- JSON 生成实体类 -->
        <n-tab-pane name="entity" tab="生成实体类">
          <n-card title="JSON 生成实体类" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                根据 JSON 数据结构，自动生成多种编程语言的实体类定义。
              </n-alert>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">输入 JSON</h3>
                  <div class="flex gap-2">
                    <n-button size="small" @click="loadSampleEntity">加载示例</n-button>
                    <n-button size="small" @click="resetEntityInput">清空</n-button>
                  </div>
                </div>
                <n-input
                  v-model:value="entityInput"
                  type="textarea"
                  :autosize="{ minRows: 10, maxRows: 15 }"
                  placeholder="在此输入 JSON 数据"
                />
                
                <div class="entity-options mt-4">
                  <n-form>
                    <n-form-item label="目标语言">
                      <n-select 
                        v-model:value="entityOptions.language" 
                        :options="languageOptions" 
                      />
                    </n-form-item>
                    
                    <n-form-item label="类名">
                      <n-input v-model:value="entityOptions.className" placeholder="RootEntity" />
                    </n-form-item>
                    
                    <n-form-item label="选项">
                      <div class="flex gap-3">
                        <n-checkbox v-model:checked="entityOptions.useProperty">属性访问器</n-checkbox>
                        <n-checkbox v-model:checked="entityOptions.useConstructor">生成构造函数</n-checkbox>
                      </div>
                    </n-form-item>
                    
                    <n-form-item>
                      <n-button type="primary" @click="generateEntity">生成实体类</n-button>
                    </n-form-item>
                  </n-form>
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-base font-medium">实体类代码</h3>
                  <div class="flex gap-2">
                    <n-button size="small" @click="copyToClipboard(entityOutput)">复制代码</n-button>
                  </div>
                </div>
                <div class="entity-display-container">
                  <pre class="entity-output">{{ entityOutput }}</pre>
                </div>
              </div>
            </div>
          </n-card>
        </n-tab-pane>

        <!-- JSON 常用教程 -->
        <n-tab-pane name="tutorial" tab="JSON 教程">
          <n-card>
            <n-collapse>
              <n-collapse-item title="JSON 语法基础" name="1">
                <div class="tutorial-content">
                  <h4 class="font-medium text-base mb-2">基本语法</h4>
                  <ul class="list-disc list-inside space-y-2">
                    <li>JSON 数据是由键值对构成的，形如 <code>"key": value</code></li>
                    <li>键必须是字符串，并用双引号包围</li>
                    <li>值可以是字符串、数字、对象、数组、布尔值或 null</li>
                    <li>多个键值对之间用逗号分隔</li>
                    <li>对象用花括号 <code>{}</code> 表示</li>
                    <li>数组用方括号 <code>[]</code> 表示</li>
                  </ul>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">示例</h4>
                  <div class="code-block">
                    <pre><code>{
  "name": "张三",
  "age": 28,
  "isStudent": false,
  "courses": ["数学", "语文", "英语"],
  "address": {
    "city": "上海",
    "postcode": "200000"
  },
  "scores": null
}</code></pre>
                  </div>
                </div>
              </n-collapse-item>
              
              <n-collapse-item title="JSON vs XML" name="2">
                <div class="tutorial-content">
                  <h4 class="font-medium text-base mb-2">优缺点对比</h4>
                  <table class="comparison-table">
                    <thead>
                      <tr>
                        <th>特性</th>
                        <th>JSON</th>
                        <th>XML</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>语法</td>
                        <td>简洁，易读</td>
                        <td>冗长，标记较多</td>
                      </tr>
                      <tr>
                        <td>文件大小</td>
                        <td>较小</td>
                        <td>较大</td>
                      </tr>
                      <tr>
                        <td>解析速度</td>
                        <td>较快</td>
                        <td>较慢</td>
                      </tr>
                      <tr>
                        <td>数据类型</td>
                        <td>支持基础类型</td>
                        <td>文本格式，需额外定义类型</td>
                      </tr>
                      <tr>
                        <td>注释</td>
                        <td>不支持</td>
                        <td>支持</td>
                      </tr>
                      <tr>
                        <td>命名空间</td>
                        <td>不支持</td>
                        <td>支持</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </n-collapse-item>
              
              <n-collapse-item title="JSON 使用场景" name="3">
                <div class="tutorial-content">
                  <h4 class="font-medium text-base mb-2">常用场景</h4>
                  <ul class="list-disc list-inside space-y-2">
                    <li>Web API 数据交换格式</li>
                    <li>配置文件（如 package.json, tsconfig.json）</li>
                    <li>NoSQL 数据库存储 (MongoDB, CouchDB)</li>
                    <li>前后端数据通信</li>
                    <li>本地数据缓存</li>
                    <li>国际化资源文件</li>
                  </ul>
                </div>
              </n-collapse-item>
              
              <n-collapse-item title="JSON 常见问题" name="4">
                <div class="tutorial-content">
                  <h4 class="font-medium text-base mb-2">常见错误</h4>
                  <ul class="list-disc list-inside space-y-2">
                    <li>属性名没有使用双引号</li>
                    <li>使用单引号代替双引号</li>
                    <li>尾随逗号（最后一个属性后不能有逗号）</li>
                    <li>包含注释（标准 JSON 不支持注释）</li>
                    <li>数值前导为 0（如 0123）</li>
                  </ul>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">调试工具</h4>
                  <ul class="list-disc list-inside space-y-2">
                    <li>使用 JSON.parse() 验证 JSON 语法</li>
                    <li>在线 JSON 校验工具</li>
                    <li>IDE 插件（如 VS Code 的 JSON Tools）</li>
                  </ul>
                </div>
              </n-collapse-item>
            </n-collapse>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  NCard, NButton, NTabs, NTabPane, NForm, NFormItem, 
  NInput, NAlert, NCollapse, NCollapseItem, NCheckbox,
  NSelect
} from 'naive-ui'
// @ts-ignore
import PageLayout from '@/components/layout/PageLayout.vue'
// @ts-ignore
import ToolsRightSidebar from '@/components/layout/ToolsRightSidebar.vue'

const router = useRouter()
const message = useMessage()

// JSON 格式化/压缩
const jsonInput = ref('')
const jsonOutput = ref('')

// 加载示例 JSON
function loadSampleJson() {
  jsonInput.value = `{
  "name": "JSON 格式化示例",
  "version": "1.0.0",
  "description": "这是一个 JSON 格式化工具的示例数据",
  "features": [
    "格式化",
    "压缩",
    "高亮显示",
    "折叠展示"
  ],
  "settings": {
    "indentation": 2,
    "autoFormat": true,
    "theme": {
      "light": "#ffffff",
      "dark": "#1a1a1a"
    }
  },
  "stats": {
    "users": 1000,
    "averageRating": 4.8,
    "lastUpdated": "2023-11-15T08:30:00Z"
  },
  "isOpenSource": true
}`
  formatJson()
}

// 格式化 JSON
function formatJson() {
  if (!jsonInput.value.trim()) {
    message.warning('请输入 JSON 数据')
    return
  }

  try {
    const parsedJson = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(parsedJson, null, 2)
    message.success('JSON 格式化成功')
  } catch (error) {
    message.error('JSON 格式错误，请检查输入')
    jsonOutput.value = error instanceof Error ? `错误: ${error.message}` : '未知错误'
  }
}

// 压缩 JSON
function compressJson() {
  if (!jsonInput.value.trim()) {
    message.warning('请输入 JSON 数据')
    return
  }

  try {
    const parsedJson = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(parsedJson)
    message.success('JSON 压缩成功')
  } catch (error) {
    message.error('JSON 格式错误，请检查输入')
    jsonOutput.value = error instanceof Error ? `错误: ${error.message}` : '未知错误'
  }
}

// 从剪贴板粘贴
async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    jsonInput.value = text
    message.success('已从剪贴板粘贴')
  } catch (error) {
    message.error('无法访问剪贴板，请检查权限')
  }
}

// 重置 JSON 输入
function resetJsonInput() {
  jsonInput.value = ''
  jsonOutput.value = ''
}

// JSON/XML 转换
const convertInputType = ref('json')
const convertInput = ref('')
const convertOutput = ref('')

// 转换格式
function convertFormat() {
  if (!convertInput.value.trim()) {
    message.warning('请输入数据')
    return
  }

  try {
    if (convertInputType.value === 'json') {
      // JSON 转 XML
      const parsedJson = JSON.parse(convertInput.value)
      convertOutput.value = jsonToXml(parsedJson)
      message.success('JSON 转换为 XML 成功')
    } else {
      // XML 转 JSON
      // 简化版 XML 转换，实际应用中应使用专门的 XML 解析库
      message.info('当前是简化版 XML 转 JSON，复杂 XML 可能转换不准确')
      convertOutput.value = '{"message": "XML 转 JSON 功能待完善，敬请期待"}'
    }
  } catch (error) {
    message.error('转换失败，请检查输入格式')
    convertOutput.value = error instanceof Error ? `错误: ${error.message}` : '未知错误'
  }
}

// JSON 转 XML（简化版）
function jsonToXml(json: any, rootName = 'root'): string {
  let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n<${rootName}>`
  
  const processValue = (value: any, key: string): string => {
    if (value === null) return `<${key} />`
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(item => {
          if (typeof item === 'object') {
            return `<${key}>${jsonToXml(item, 'item').replace(/^<\?xml.*\?>\n/, '')}</${key}>`
          } else {
            return `<${key}>${item}</${key}>`
          }
        }).join('\n')
      } else {
        return `<${key}>${jsonToXml(value, key).replace(/^<\?xml.*\?>\n/, '')}</${key}>`
      }
    }
    
    return `<${key}>${value}</${key}>`
  }
  
  for (const key in json) {
    xml += '\n  ' + processValue(json[key], key)
  }
  
  xml += `\n</${rootName}>`
  return xml
}

// 重置转换输入
function resetConvertInput() {
  convertInput.value = ''
  convertOutput.value = ''
}

// JSON 生成实体类
const entityInput = ref('')
const entityOutput = ref('')
const entityOptions = ref({
  language: 'java',
  className: 'RootEntity',
  useProperty: true,
  useConstructor: true
})

const languageOptions = [
  { label: 'Java', value: 'java' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'C#', value: 'csharp' }
]

// 加载示例实体
function loadSampleEntity() {
  entityInput.value = `{
  "id": 1,
  "name": "张三",
  "age": 28,
  "email": "zhangsan@example.com",
  "isActive": true,
  "tags": ["用户", "会员"],
  "address": {
    "city": "上海",
    "street": "南京路",
    "zipCode": "200000"
  },
  "orders": [
    {
      "orderId": "ORD-001",
      "total": 199.99,
      "items": [
        {
          "productId": 101,
          "quantity": 2,
          "price": 99.99
        }
      ]
    }
  ]
}`
}

// 生成实体类
function generateEntity() {
  if (!entityInput.value.trim()) {
    message.warning('请输入 JSON 数据')
    return
  }

  try {
    const parsedJson = JSON.parse(entityInput.value)
    const language = entityOptions.value.language
    const className = entityOptions.value.className || 'RootEntity'
    
    if (language === 'java') {
      entityOutput.value = generateJavaEntity(parsedJson, className)
    } else if (language === 'typescript') {
      entityOutput.value = generateTypeScriptInterface(parsedJson, className)
    } else if (language === 'csharp') {
      entityOutput.value = generateCSharpClass(parsedJson, className)
    }
    
    message.success('实体类生成成功')
  } catch (error) {
    message.error('JSON 格式错误，请检查输入')
    entityOutput.value = error instanceof Error ? `错误: ${error.message}` : '未知错误'
  }
}

// 生成 Java 实体类
function generateJavaEntity(json: any, className: string, depth = 0): string {
  const indent = '  '.repeat(depth)
  let result = `${indent}public class ${className} {\n`
  
  // 字段定义
  for (const key in json) {
    const value = json[key]
    const fieldType = getJavaType(value, key)
    
    result += `${indent}  private ${fieldType} ${key};\n`
  }
  
  // 如果需要生成 getter/setter
  if (entityOptions.value.useProperty) {
    result += '\n'
    // Getters
    for (const key in json) {
      const value = json[key]
      const fieldType = getJavaType(value, key)
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1)
      
      result += `${indent}  public ${fieldType} get${capitalizedKey}() {\n`
      result += `${indent}    return ${key};\n`
      result += `${indent}  }\n\n`
      
      result += `${indent}  public void set${capitalizedKey}(${fieldType} ${key}) {\n`
      result += `${indent}    this.${key} = ${key};\n`
      result += `${indent}  }\n\n`
    }
  }
  
  // 如果需要生成构造函数
  if (entityOptions.value.useConstructor) {
    result += `${indent}  public ${className}() {\n`
    result += `${indent}  }\n\n`
    
    // 带参数的构造函数
    result += `${indent}  public ${className}(`
    
    const params = []
    for (const key in json) {
      const value = json[key]
      const fieldType = getJavaType(value, key)
      params.push(`${fieldType} ${key}`)
    }
    
    result += params.join(', ') + ') {\n'
    
    for (const key in json) {
      result += `${indent}    this.${key} = ${key};\n`
    }
    
    result += `${indent}  }\n`
  }
  
  result += `${indent}}\n`
  
  // 生成嵌套类
  for (const key in json) {
    const value = json[key]
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nestedClassName = key.charAt(0).toUpperCase() + key.slice(1)
      const nestedClass = generateJavaEntity(value, nestedClassName, depth)
      result = nestedClass + '\n' + result
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const singularKey = key.endsWith('s') ? key.slice(0, -1) : key + 'Item'
      const nestedClassName = singularKey.charAt(0).toUpperCase() + singularKey.slice(1)
      const nestedClass = generateJavaEntity(value[0], nestedClassName, depth)
      result = nestedClass + '\n' + result
    }
  }
  
  return result
}

// 获取 Java 类型
function getJavaType(value: any, key: string): string {
  if (value === null) return 'Object'
  
  if (typeof value === 'string') return 'String'
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return 'Integer'
    return 'Double'
  }
  if (typeof value === 'boolean') return 'Boolean'
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<Object>'
    
    const firstItem = value[0]
    if (typeof firstItem === 'object' && firstItem !== null) {
      const singularKey = key.endsWith('s') ? key.slice(0, -1) : key + 'Item'
      const nestedClassName = singularKey.charAt(0).toUpperCase() + singularKey.slice(1)
      return `List<${nestedClassName}>`
    } else if (typeof firstItem === 'string') {
      return 'List<String>'
    } else if (typeof firstItem === 'number') {
      if (Number.isInteger(firstItem)) return 'List<Integer>'
      return 'List<Double>'
    } else if (typeof firstItem === 'boolean') {
      return 'List<Boolean>'
    }
    return 'List<Object>'
  }
  
  if (typeof value === 'object') {
    const nestedClassName = key.charAt(0).toUpperCase() + key.slice(1)
    return nestedClassName
  }
  
  return 'Object'
}

// 生成 TypeScript 接口
function generateTypeScriptInterface(json: any, interfaceName: string): string {
  let result = `interface ${interfaceName} {\n`
  
  for (const key in json) {
    const value = json[key]
    const fieldType = getTypeScriptType(value, key)
    
    result += `  ${key}: ${fieldType};\n`
  }
  
  result += '}\n\n'
  
  // 生成嵌套接口
  for (const key in json) {
    const value = json[key]
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nestedInterfaceName = key.charAt(0).toUpperCase() + key.slice(1)
      result += generateTypeScriptInterface(value, nestedInterfaceName)
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const singularKey = key.endsWith('s') ? key.slice(0, -1) : key + 'Item'
      const nestedInterfaceName = singularKey.charAt(0).toUpperCase() + singularKey.slice(1)
      result += generateTypeScriptInterface(value[0], nestedInterfaceName)
    }
  }
  
  return result
}

// 获取 TypeScript 类型
function getTypeScriptType(value: any, key: string): string {
  if (value === null) return 'null'
  
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]'
    
    const firstItem = value[0]
    if (typeof firstItem === 'object' && firstItem !== null) {
      const singularKey = key.endsWith('s') ? key.slice(0, -1) : key + 'Item'
      const nestedInterfaceName = singularKey.charAt(0).toUpperCase() + singularKey.slice(1)
      return `${nestedInterfaceName}[]`
    } else if (typeof firstItem === 'string') {
      return 'string[]'
    } else if (typeof firstItem === 'number') {
      return 'number[]'
    } else if (typeof firstItem === 'boolean') {
      return 'boolean[]'
    }
    return 'any[]'
  }
  
  if (typeof value === 'object') {
    const nestedInterfaceName = key.charAt(0).toUpperCase() + key.slice(1)
    return nestedInterfaceName
  }
  
  return 'any'
}

// 生成 C# 类
function generateCSharpClass(json: any, className: string): string {
  let result = `public class ${className}\n{\n`
  
  for (const key in json) {
    const value = json[key]
    const fieldType = getCSharpType(value, key)
    const propName = key.charAt(0).toUpperCase() + key.slice(1)
    
    if (entityOptions.value.useProperty) {
      result += `    public ${fieldType} ${propName} { get; set; }\n`
    } else {
      result += `    public ${fieldType} ${propName};\n`
    }
  }
  
  if (entityOptions.value.useConstructor) {
    result += '\n    public ' + className + '() {}\n\n'
    
    result += '    public ' + className + '('
    
    const params = []
    for (const key in json) {
      const value = json[key]
      const fieldType = getCSharpType(value, key)
      const paramName = key.charAt(0).toLowerCase() + key.slice(1)
      params.push(`${fieldType} ${paramName}`)
    }
    
    result += params.join(', ') + ')\n    {\n'
    
    for (const key in json) {
      const propName = key.charAt(0).toUpperCase() + key.slice(1)
      const paramName = key.charAt(0).toLowerCase() + key.slice(1)
      result += `        ${propName} = ${paramName};\n`
    }
    
    result += '    }\n'
  }
  
  result += '}\n\n'
  
  // 生成嵌套类
  for (const key in json) {
    const value = json[key]
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nestedClassName = key.charAt(0).toUpperCase() + key.slice(1)
      result += generateCSharpClass(value, nestedClassName)
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const singularKey = key.endsWith('s') ? key.slice(0, -1) : key + 'Item'
      const nestedClassName = singularKey.charAt(0).toUpperCase() + singularKey.slice(1)
      result += generateCSharpClass(value[0], nestedClassName)
    }
  }
  
  return result
}

// 获取 C# 类型
function getCSharpType(value: any, key: string): string {
  if (value === null) return 'object'
  
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return 'int'
    return 'double'
  }
  if (typeof value === 'boolean') return 'bool'
  
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<object>'
    
    const firstItem = value[0]
    if (typeof firstItem === 'object' && firstItem !== null) {
      const singularKey = key.endsWith('s') ? key.slice(0, -1) : key + 'Item'
      const nestedClassName = singularKey.charAt(0).toUpperCase() + singularKey.slice(1)
      return `List<${nestedClassName}>`
    } else if (typeof firstItem === 'string') {
      return 'List<string>'
    } else if (typeof firstItem === 'number') {
      if (Number.isInteger(firstItem)) return 'List<int>'
      return 'List<double>'
    } else if (typeof firstItem === 'boolean') {
      return 'List<bool>'
    }
    return 'List<object>'
  }
  
  if (typeof value === 'object') {
    const nestedClassName = key.charAt(0).toUpperCase() + key.slice(1)
    return nestedClassName
  }
  
  return 'object'
}

// 重置实体生成
function resetEntityInput() {
  entityInput.value = ''
  entityOutput.value = ''
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
.json-tools-container {
  padding: 10px;
}

.json-display-container, .entity-display-container {
  height: 400px;
  overflow: auto;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #eee;
}

.json-output, .entity-output {
  font-family: monospace;
  white-space: pre;
  font-size: 13px;
}

.code-block {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
}

.code-block pre {
  font-family: monospace;
  font-size: 13px;
  white-space: pre;
  overflow-x: auto;
}

.tutorial-content code {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 13px;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.comparison-table th,
.comparison-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.comparison-table th {
  background-color: #f2f2f2;
  font-weight: 600;
}

.comparison-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style> 