<template>
  <div class="gbits-page">
    <PageLayout>
      <div class="gbits-container">
        <!-- 环境提示横幅 -->
        <div v-if="!isElectronEnv() && !hideWarning" class="environment-warning">
          <i class="fas fa-info-circle"></i>
          <span class="warning-text">
            当前运行在浏览器环境下，显示的是演示数据。要使用真实文件解析功能，请在Electron环境下运行此应用。
          </span>
          <i class="fas fa-times close-warning" @click="hideWarning = true"></i>
        </div>
        
        <div class="page-header">
          <h1 class="page-title">GBITS 解析</h1>
          
          <!-- 文件夹路径输入和操作区 -->
          <div class="folder-controls">
            <div class="folder-input-section">
              <!-- 文件夹路径输入 -->
              <div class="folder-path-container">
                <div class="input-group">
                  <div class="input-label">
                    <i class="fas fa-folder-open"></i>
                    文件夹路径
                  </div>
                  <div class="input-wrapper">
                    <input 
                      v-model="folderPath" 
                      type="text" 
                      placeholder="请输入包含 .gbits 文件的文件夹路径"
                      class="folder-input"
                      @keyup.enter="scanFolder"
                    />
                    <button class="browse-btn" @click="browseFolder" title="浏览文件夹">
                      <i class="fas fa-folder"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 操作按钮组 -->
              <div class="action-buttons">
                <button class="action-btn scan-btn" @click="scanFolder" :disabled="!folderPath.trim() || isScanning">
                  <i class="fas fa-search" :class="{ 'fa-spin': isScanning }"></i>
                  {{ isScanning ? '扫描中...' : '扫描文件' }}
                </button>
                
                <button class="action-btn parse-all-btn" @click="parseAllFiles" :disabled="gbitsFiles.length === 0 || isParsing" title="解析所有文件的第一帧">
                  <i class="fas fa-play" :class="{ 'fa-spin': isParsing }"></i>
                  {{ isParsing ? '解析中...' : '解析全部' }}
                </button>
                
                <button class="action-btn export-btn" @click="exportFrames" :disabled="parsedFrames.length === 0" title="导出解析的帧图像">
                  <i class="fas fa-download"></i>
                  导出图像
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-divider"></div>
        
        <!-- GBITS 文件列表和解析结果 -->
        <n-spin :show="isScanning">
          <div v-if="gbitsFiles.length === 0" class="empty-folder">
            <div class="empty-illustration">
              <i class="fas fa-file-image"></i>
            </div>
            <p>请选择一个包含 .gbits 文件的文件夹来开始解析</p>
            <small>支持《问道》游戏的 gbits 动画文件格式</small>
          </div>
          
          <div v-else>
            <!-- 文件统计信息 -->
            <div class="stats-section">
              <div class="stats-header" @click="toggleStats">
                <div class="stats-title">
                  <i class="fas fa-chevron-down" :class="{ rotated: !statsExpanded }"></i>
                  <span>文件统计</span>
                </div>
                <div class="stats-count">
                  <span class="count-badge">{{ gbitsFiles.length }}</span>
                </div>
              </div>
              
              <div class="stats-content" v-show="statsExpanded">
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-label">GBITS 文件</div>
                    <div class="stat-value">{{ gbitsFiles.length }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">已解析</div>
                    <div class="stat-value">{{ parsedFrames.length }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">解析成功</div>
                    <div class="stat-value">{{ parsedFrames.filter(f => f.success).length }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">解析失败</div>
                    <div class="stat-value">{{ parsedFrames.filter(f => !f.success).length }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- GBITS 文件列表 -->
            <div class="files-section">
              <div class="files-header" @click="toggleFiles">
                <div class="files-title">
                  <i class="fas fa-chevron-down" :class="{ rotated: !filesExpanded }"></i>
                  <span>GBITS 文件</span>
                </div>
              </div>
              
              <div class="files-content" v-show="filesExpanded">
                <div class="file-list-container">
                  <div class="file-list">
                    <div 
                      v-for="file in gbitsFiles" 
                      :key="file.path" 
                      class="file-item"
                      :class="{ 
                        selected: selectedFile?.path === file.path,
                        parsed: getParsedFrame(file.path),
                        'parse-success': getParsedFrame(file.path)?.success,
                        'parse-failed': getParsedFrame(file.path) && !getParsedFrame(file.path)?.success
                      }"
                      @click="selectFile(file)"
                    >
                      <div class="file-info">
                        <div class="file-icon">
                          <i class="fas fa-file-image"></i>
                        </div>
                        <div class="file-details">
                          <div class="file-name">{{ file.name }}</div>
                          <div class="file-path">{{ file.relativePath }}</div>
                          <div class="file-size">{{ formatFileSize(file.size) }}</div>
                        </div>
                      </div>
                      
                      <div class="file-status">
                        <span v-if="getParsedFrame(file.path)" class="status-badge" :class="getParsedFrame(file.path)?.success ? 'status-success' : 'status-failed'">
                          {{ getParsedFrame(file.path)?.success ? '已解析' : '失败' }}
                        </span>
                        <span v-else class="status-badge status-pending">待解析</span>
                      </div>
                      
                      <div class="file-actions">
                        <button class="file-action-btn" @click.stop="parseFile(file)" :disabled="isParsing" title="解析第一帧">
                          <i class="fas fa-play"></i>
                        </button>
                        <button v-if="getParsedFrame(file.path)?.success" class="file-action-btn" @click.stop="viewFrame(file)" title="查看帧图像">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button v-if="getParsedFrame(file.path)?.success" class="file-action-btn" @click.stop="exportSingleFrame(file)" title="导出图像">
                          <i class="fas fa-download"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-spin>
      </div>
      
      <template #rightSidebar>
        <GbitsRightSidebar
          :selected-file="selectedFile"
          :parsed-frame="selectedFile ? getParsedFrame(selectedFile.path) : null"
          :parsing-stats="parsingStats"
          @parse-file="parseFile"
          @view-frame="viewFrame"
          @export-frame="exportSingleFrame"
        />
      </template>
    </PageLayout>
    
    <!-- 图像查看弹窗 -->
    <n-modal v-model:show="showImageModal" class="image-modal" style="width: 80vw; max-width: 1000px;">
      <div class="modal-container">
        <div class="modal-inner">
          <div class="modal-header">
            <div class="modal-title">
              <span>{{ currentFrame?.fileName }}</span>
              <div class="frame-info">
                <span class="frame-size">{{ currentFrame?.width }}x{{ currentFrame?.height }}</span>
                <span class="frame-format">{{ currentFrame?.format }}</span>
              </div>
            </div>
            <n-button quaternary circle class="close-btn" @click="showImageModal = false">
              <n-icon>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </n-icon>
            </n-button>
          </div>
          
          <div class="modal-content">
            <div v-if="currentFrame?.imageData" class="frame-viewer">
              <img :src="currentFrame.imageData" :alt="currentFrame.fileName" class="frame-image" />
              <div class="frame-details">
                <div class="detail-item">
                  <span class="label">文件名:</span>
                  <span class="value">{{ currentFrame.fileName }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">尺寸:</span>
                  <span class="value">{{ currentFrame.width }} × {{ currentFrame.height }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">格式:</span>
                  <span class="value">{{ currentFrame.format }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">大小:</span>
                  <span class="value">{{ formatFileSize(currentFrame.dataSize) }}</span>
                </div>
              </div>
            </div>
            <div v-else class="loading-frame">
              <n-spin size="large" />
              <p>正在加载图像...</p>
            </div>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
// 组件名称 - 用于keep-alive缓存
defineOptions({
  name: 'GbitsHome'
})
import { ref, computed, reactive, onMounted, defineAsyncComponent } from 'vue'
import { NButton, NModal, NIcon, NSpin } from 'naive-ui'
import PageLayout from '@/components/layout/PageLayout.vue'
import { useGlobalNotification } from '@/services/notification'

// 导入右侧边栏组件 
const GbitsRightSidebar = defineAsyncComponent(() => import('@/components/layout/GbitsRightSidebar.vue'))

// 添加FontAwesome CDN
const head = document.head || document.getElementsByTagName('head')[0]
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
head.appendChild(link)

// GBITS文件接口
interface GbitsFile {
  path: string
  name: string
  relativePath: string
  size: number
}

// 解析的帧数据接口
interface ParsedFrame {
  filePath: string
  fileName: string
  success: boolean
  error?: string
  width?: number
  height?: number
  format?: string
  imageData?: string // base64编码的图像数据
  dataSize?: number
  parseTime?: number
}

// 解析统计接口
interface ParsingStats {
  totalFiles: number
  parsedFiles: number
  successCount: number
  failureCount: number
  averageParseTime: number
}

const notification = useGlobalNotification()

// 响应式状态
const folderPath = ref('')
const gbitsFiles = ref<GbitsFile[]>([])
const selectedFile = ref<GbitsFile | null>(null)
const parsedFrames = ref<ParsedFrame[]>([])
const isScanning = ref(false)
const isParsing = ref(false)
const hideWarning = ref(false)

// 界面状态
const statsExpanded = ref(true)
const filesExpanded = ref(true)
const showImageModal = ref(false)
const currentFrame = ref<ParsedFrame | null>(null)

// 计算属性
const parsingStats = computed((): ParsingStats => {
  const total = gbitsFiles.value.length
  const parsed = parsedFrames.value.length
  const success = parsedFrames.value.filter(f => f.success).length
  const failure = parsed - success
  const avgTime = parsed > 0 ? parsedFrames.value.reduce((sum, f) => sum + (f.parseTime || 0), 0) / parsed : 0
  
  return {
    totalFiles: total,
    parsedFiles: parsed,
    successCount: success,
    failureCount: failure,
    averageParseTime: avgTime
  }
})

// 检查是否为Electron环境
function isElectronEnv(): boolean {
  return typeof window !== 'undefined' && !!(window as any).electronAPI
}

// 扫描文件夹中的GBITS文件
async function scanFolder(): Promise<void> {
  if (!folderPath.value.trim()) {
    notification.error('请输入文件夹路径')
    return
  }

  isScanning.value = true
  
  try {
    // 在Electron环境中扫描真实文件
    if (isElectronEnv() && (window as any).electronAPI) {
      try {
        const result = await (window as any).electronAPI.scanGbitsFiles(folderPath.value.trim())
        if (result.success) {
          gbitsFiles.value = result.files
          notification.success(`找到 ${result.files.length} 个 GBITS 文件`)
        } else {
          notification.error(`扫描失败: ${result.error}`)
          gbitsFiles.value = []
        }
      } catch (error: any) {
        notification.error(`扫描失败: ${error.message}`)
        gbitsFiles.value = []
      }
    } else {
      // 浏览器环境模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟延迟
      
      // 如果输入的是产品目录，包含 attack.gbits
      if (folderPath.value.includes('product')) {
        gbitsFiles.value = [
          {
            path: '/Users/qianhu/Desktop/workspace/vue/qw-blog/product/attack.gbits',
            name: 'attack.gbits',
            relativePath: 'attack.gbits',
            size: 15420
          },
          // 模拟更多文件
          {
            path: '/Users/qianhu/Desktop/workspace/vue/qw-blog/product/defense.gbits',
            name: 'defense.gbits',
            relativePath: 'defense.gbits',
            size: 12800
          },
          {
            path: '/Users/qianhu/Desktop/workspace/vue/qw-blog/product/magic.gbits',
            name: 'magic.gbits',
            relativePath: 'magic.gbits',
            size: 18900
          }
        ]
        notification.success(`找到 ${gbitsFiles.value.length} 个 GBITS 文件（演示数据）`)
      } else {
        gbitsFiles.value = []
        notification.warning('演示模式下，请输入包含 "product" 的路径')
      }
    }
    
    // 智能保留解析结果：只保留当前扫描到的文件的解析结果
    const scannedFilePaths = new Set(gbitsFiles.value.map(f => f.path))
    parsedFrames.value = parsedFrames.value.filter(frame => 
      scannedFilePaths.has(frame.filePath)
    )
    
    // 如果选中的文件不在新扫描的文件中，清空选择
    if (selectedFile.value && !scannedFilePaths.has(selectedFile.value.path)) {
      selectedFile.value = null
    }
    
  } catch (error: any) {
    notification.error(`扫描失败: ${error.message}`)
    gbitsFiles.value = []
  } finally {
    isScanning.value = false
  }
}

// 浏览文件夹
async function browseFolder(): Promise<void> {
  try {
    // 优先使用Electron API
    if (isElectronEnv() && (window as any).electronAPI) {
      try {
        const result = await (window as any).electronAPI.selectDirectory()
        if (result.success && result.path) {
          folderPath.value = result.path
          notification.success(`已选择文件夹: ${result.path}`)
          // 自动扫描文件夹
          await scanFolder()
          return
        } else if (result.error && !result.error.includes('未选择')) {
          notification.error(`选择文件夹失败: ${result.error}`)
          return
        }
      } catch (error: any) {
        console.warn('Electron directory picker error:', error)
      }
    }
    
    // 浏览器环境下的处理
    if ('showDirectoryPicker' in window) {
      try {
        const dirHandle = await (window as any).showDirectoryPicker()
        folderPath.value = dirHandle.name
        notification.success(`已选择文件夹: ${dirHandle.name}`)
        await scanFolder()
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.warn('Directory picker error:', error)
          fallbackFolderSelect()
        }
      }
    } else {
      fallbackFolderSelect()
    }
  } catch (error) {
    console.error('Folder browse error:', error)
    fallbackFolderSelect()
  }
}

// 备用文件夹选择方案
function fallbackFolderSelect(): void {
  // 简单的输入提示
  const path = prompt('请输入文件夹路径:', '/Users/qianhu/Desktop/workspace/vue/qw-blog/product')
  if (path) {
    folderPath.value = path
    scanFolder()
  }
}

// 解析单个文件
async function parseFile(file: GbitsFile): Promise<void> {
  if (isParsing.value) return
  
  isParsing.value = true
  const startTime = Date.now()
  
  try {
    let result: ParsedFrame
    
    // 在Electron环境中解析真实文件
    if (isElectronEnv() && (window as any).electronAPI) {
      try {
        const parseResult = await (window as any).electronAPI.parseGbitsFile(file.path)
        result = {
          filePath: file.path,
          fileName: file.name,
          success: parseResult.success,
          error: parseResult.error,
          width: parseResult.frameData?.width,
          height: parseResult.frameData?.height,
          format: 'PNG', // 固定格式
          imageData: parseResult.frameData?.imageData,
          dataSize: parseResult.frameData?.dataSize,
          parseTime: Date.now() - startTime
        }
      } catch (error: any) {
        result = {
          filePath: file.path,
          fileName: file.name,
          success: false,
          error: error.message,
          parseTime: Date.now() - startTime
        }
      }
    } else {
      // 浏览器环境模拟解析
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000)) // 模拟解析时间
      
      // 模拟解析结果
      const isSuccess = Math.random() > 0.2 // 80% 成功率
      if (isSuccess) {
        // 创建一个简单的彩色矩形作为模拟图像
        const canvas = document.createElement('canvas')
        canvas.width = 64 + Math.floor(Math.random() * 128)
        canvas.height = 64 + Math.floor(Math.random() * 128)
        const ctx = canvas.getContext('2d')!
        
        // 随机颜色背景
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // 添加一些形状
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20)
        
        ctx.fillStyle = '#333'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(file.name.substring(0, 8), canvas.width / 2, canvas.height / 2)
        
        const imageData = canvas.toDataURL('image/png')
        
        result = {
          filePath: file.path,
          fileName: file.name,
          success: true,
          width: canvas.width,
          height: canvas.height,
          format: 'PNG',
          imageData: imageData,
          dataSize: Math.floor(imageData.length * 0.75), // 大概估算
          parseTime: Date.now() - startTime
        }
      } else {
        result = {
          filePath: file.path,
          fileName: file.name,
          success: false,
          error: '模拟解析失败：文件格式不支持或数据损坏',
          parseTime: Date.now() - startTime
        }
      }
    }
    
    // 更新解析结果
    const existingIndex = parsedFrames.value.findIndex(f => f.filePath === file.path)
    if (existingIndex >= 0) {
      parsedFrames.value[existingIndex] = result
    } else {
      parsedFrames.value.push(result)
    }
    
    if (result.success) {
      notification.success(`解析成功: ${file.name}`)
    } else {
      notification.error(`解析失败: ${file.name} - ${result.error}`)
    }
    
  } catch (error: any) {
    notification.error(`解析失败: ${error.message}`)
  } finally {
    isParsing.value = false
  }
}

// 解析所有文件
async function parseAllFiles(): Promise<void> {
  if (gbitsFiles.value.length === 0 || isParsing.value) return
  
  isParsing.value = true
  
  try {
    for (const file of gbitsFiles.value) {
      // 如果已经解析过且成功，则跳过
      const existing = getParsedFrame(file.path)
      if (existing?.success) continue
      
      await parseFile(file)
      
      // 短暂延迟，避免过于频繁的操作
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    const stats = parsingStats.value
    notification.success(`批量解析完成: ${stats.successCount} 成功, ${stats.failureCount} 失败`)
    
  } catch (error: any) {
    notification.error(`批量解析失败: ${error.message}`)
  } finally {
    isParsing.value = false
  }
}

// 获取文件的解析结果
function getParsedFrame(filePath: string): ParsedFrame | null {
  return parsedFrames.value.find(f => f.filePath === filePath) || null
}

// 检查文件是否已成功解析
function isFileParsed(filePath: string): boolean {
  const frame = getParsedFrame(filePath)
  return !!(frame && frame.success)
}

// 获取文件解析状态标识
function getFileParseStatus(file: GbitsFile): 'success' | 'failed' | 'pending' {
  const frame = getParsedFrame(file.path)
  if (!frame) return 'pending'
  return frame.success ? 'success' : 'failed'
}

// 选择文件
function selectFile(file: GbitsFile): void {
  selectedFile.value = file
}

// 查看帧图像
function viewFrame(file: GbitsFile): void {
  const frame = getParsedFrame(file.path)
  
  if (frame?.success && frame.imageData) {
    currentFrame.value = frame
    showImageModal.value = true
  } else if (frame && !frame.success) {
    notification.error(`解析失败: ${frame.error || '未知错误'}`)
  } else {
    notification.warning(`${file.name} 尚未解析，请先点击"解析"按钮`)
  }
}

// 导出单个帧图像
function exportSingleFrame(file: GbitsFile): void {
  const frame = getParsedFrame(file.path)
  
  if (!frame) {
    notification.warning(`${file.name} 尚未解析，请先点击"解析"按钮`)
    return
  }
  
  if (!frame.success || !frame.imageData) {
    notification.error(`解析失败，无法导出: ${frame.error || '未知错误'}`)
    return
  }
  
  try {
    // 创建下载链接
    const link = document.createElement('a')
    link.href = frame.imageData
    link.download = `${file.name.replace('.gbits', '')}_frame1.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    notification.success(`已导出: ${link.download}`)
  } catch (error: any) {
    notification.error(`导出失败: ${error.message}`)
  }
}

// 导出所有成功解析的帧图像
function exportFrames(): void {
  const successFrames = parsedFrames.value.filter(f => f.success && f.imageData)
  
  if (successFrames.length === 0) {
    notification.warning('没有可导出的图像')
    return
  }
  
  try {
    successFrames.forEach((frame, index) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = frame.imageData!
        link.download = `${frame.fileName.replace('.gbits', '')}_frame1.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, index * 200) // 间隔200ms避免浏览器阻止
    })
    
    notification.success(`正在导出 ${successFrames.length} 个图像文件`)
  } catch (error: any) {
    notification.error(`导出失败: ${error.message}`)
  }
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 切换统计展开状态
function toggleStats(): void {
  statsExpanded.value = !statsExpanded.value
}

// 切换文件列表展开状态
function toggleFiles(): void {
  filesExpanded.value = !filesExpanded.value
}

// 组件挂载时设置默认路径
onMounted(() => {
  // 设置默认路径为product目录，方便测试
  folderPath.value = '/Users/qianhu/Desktop/workspace/vue/qw-blog/product'
})
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

.gbits-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  position: relative;
}

.gbits-container {
  padding: 0 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 60px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 4px;
  padding: 16px 0 12px 0;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
  text-align: left;
}

.content-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.08);
  margin: 0;
}

/* 环境警告横幅样式 */
.environment-warning {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.environment-warning i.fas.fa-info-circle {
  color: #856404;
  font-size: 16px;
  flex-shrink: 0;
}

.warning-text {
  flex: 1;
  color: #856404;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
}

.close-warning {
  color: #856404;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-warning:hover {
  background: rgba(133, 100, 4, 0.1);
  color: #333;
}

/* 文件夹控制区样式 */
.folder-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.folder-input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.folder-path-container {
  flex: 1;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.input-label i {
  color: #6b7280;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.folder-input {
  flex: 1;
  height: 40px;
  padding: 0 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  transition: border-color 0.2s ease;
}

.folder-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.browse-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #f3f4f6;
  border: 2px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.browse-btn:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scan-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.scan-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
}

.scan-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.parse-all-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.parse-all-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
}

.parse-all-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.export-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

.export-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
}

.export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 空状态 */
.empty-folder {
  text-align: center;
  padding: 80px 0;
  color: #8c9396;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 50vh;
}

.empty-illustration {
  width: 84px;
  height: 84px;
  color: #bbc3cd;
  font-size: 84px;
}

/* 统计区域样式 */
.stats-section {
  margin-bottom: 20px;
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 1px solid #0ea5e9;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.stats-header:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
}

.stats-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #0c4a6e;
}

.stats-title i {
  transition: transform 0.2s ease;
  color: #0ea5e9;
}

.stats-title i.rotated {
  transform: rotate(-90deg);
}

.stats-count {
  display: flex;
  align-items: center;
}

.count-badge {
  background: #0ea5e9;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(14, 165, 233, 0.3);
}

.stats-content {
  margin-top: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

/* 文件区域样式 */
.files-section {
  margin-bottom: 20px;
}

.files-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.files-header:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.files-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.files-title i {
  transition: transform 0.2s ease;
  color: #6b7280;
}

.files-title i.rotated {
  transform: rotate(-90deg);
}

.files-content {
  margin-top: 16px;
}

/* 文件列表 */
.file-list-container {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.file-list {
  display: flex;
  flex-direction: column;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-item:last-child {
  border-bottom: none;
}

.file-item:hover {
  background: #f8fafc;
}

.file-item.selected {
  background: rgba(59, 130, 246, 0.05);
  border-left: 3px solid #3b82f6;
}

.file-item.parse-success {
  border-left: 3px solid #10b981;
}

.file-item.parse-failed {
  border-left: 3px solid #ef4444;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  width: 20px;
  display: flex;
  justify-content: center;
  color: #6b7280;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-path {
  font-size: 12px;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

.file-status {
  margin-right: 12px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}

.status-success {
  background: #10b981;
}

.status-failed {
  background: #ef4444;
}

.status-pending {
  background: #6b7280;
}

.file-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.file-item:hover .file-actions {
  opacity: 1;
}

.file-action-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 12px;
}

.file-action-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.file-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 弹窗样式 */
.image-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-modal .modal-container {
  position: relative;
  margin: 0 auto;
}

.image-modal .modal-inner {
  width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.image-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.image-modal .modal-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.frame-info {
  display: flex;
  gap: 12px;
  font-size: 12px;
  opacity: 0.9;
}

.frame-size, .frame-format {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.image-modal .close-btn {
  color: rgba(255, 255, 255, 0.8);
}

.image-modal .close-btn:hover {
  color: white;
}

.image-modal .modal-content {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.frame-viewer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.frame-image {
  max-width: 100%;
  max-height: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  image-rendering: pixelated; /* 保持像素艺术的清晰度 */
}

.frame-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  max-width: 400px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 14px;
}

.detail-item .label {
  color: #6b7280;
  font-weight: 500;
}

.detail-item .value {
  color: #374151;
  font-family: monospace;
  font-size: 13px;
}

.loading-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: #6b7280;
}

/* 响应式 */
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .file-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .file-actions {
    opacity: 1;
    align-self: flex-end;
  }
  
  .frame-details {
    grid-template-columns: 1fr;
  }
}
</style>
