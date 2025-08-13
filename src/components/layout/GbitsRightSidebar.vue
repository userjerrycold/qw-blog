<template>
  <div class="gbits-sidebar">
    <div class="sidebar-header">
      <h3 class="sidebar-title">GBITS 解析</h3>
      <div class="subtitle">问道游戏动画文件</div>
    </div>

    <!-- 选中文件信息 -->
    <div v-if="selectedFile" class="selected-file-section">
      <h4 class="section-title">
        <i class="fas fa-file-image"></i>
        选中文件
      </h4>
      
      <div class="file-card">
        <div class="file-header">
          <div class="file-icon">
            <i class="fas fa-file-image"></i>
          </div>
          <div class="file-info">
            <div class="file-name">{{ selectedFile.name }}</div>
            <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
          </div>
        </div>
        
        <div class="file-details">
          <div class="detail-item">
            <span class="label">路径:</span>
            <span class="value">{{ selectedFile.relativePath }}</span>
          </div>
        </div>
        
        <!-- 解析状态 -->
        <div v-if="parsedFrame" class="parse-status">
          <div v-if="parsedFrame.success" class="status-success">
            <i class="fas fa-check-circle"></i>
            <span>解析成功</span>
          </div>
          <div v-else class="status-failed">
            <i class="fas fa-times-circle"></i>
            <span>解析失败</span>
          </div>
          
          <div v-if="parsedFrame.success" class="frame-info">
            <div class="info-item">
              <span class="label">尺寸:</span>
              <span class="value">{{ parsedFrame.width }}×{{ parsedFrame.height }}</span>
            </div>
            <div class="info-item">
              <span class="label">格式:</span>
              <span class="value">{{ parsedFrame.format }}</span>
            </div>
            <div class="info-item">
              <span class="label">解析时间:</span>
              <span class="value">{{ parsedFrame.parseTime }}ms</span>
            </div>
          </div>
          
          <div v-if="!parsedFrame.success && parsedFrame.error" class="error-info">
            <span class="error-label">错误信息:</span>
            <span class="error-message">{{ parsedFrame.error }}</span>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="file-actions">
          <button 
            class="action-btn primary" 
            @click="$emit('parseFile', selectedFile)"
            :disabled="isParsing"
          >
            <i class="fas fa-play"></i>
            {{ isParsing ? '解析中...' : '解析文件' }}
          </button>
          
          <button 
            v-if="parsedFrame?.success" 
            class="action-btn secondary" 
            @click="$emit('viewFrame', selectedFile)"
          >
            <i class="fas fa-eye"></i>
            查看图像
          </button>
          
          <button 
            v-if="parsedFrame?.success" 
            class="action-btn export" 
            @click="$emit('exportFrame', selectedFile)"
          >
            <i class="fas fa-download"></i>
            导出
          </button>
        </div>
      </div>
    </div>

    <!-- 解析统计 -->
    <div class="stats-section">
      <h4 class="section-title">
        <i class="fas fa-chart-bar"></i>
        解析统计
      </h4>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <i class="fas fa-file"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">总文件</div>
            <div class="stat-value">{{ parsingStats.totalFiles }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon parsed">
            <i class="fas fa-cog"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">已解析</div>
            <div class="stat-value">{{ parsingStats.parsedFiles }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon success">
            <i class="fas fa-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">成功</div>
            <div class="stat-value">{{ parsingStats.successCount }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon failed">
            <i class="fas fa-times"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">失败</div>
            <div class="stat-value">{{ parsingStats.failureCount }}</div>
          </div>
        </div>
      </div>
      
      <div v-if="parsingStats.parsedFiles > 0" class="progress-info">
        <div class="progress-label">解析进度</div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: (parsingStats.parsedFiles / parsingStats.totalFiles * 100) + '%' }"
          ></div>
        </div>
        <div class="progress-text">
          {{ parsingStats.parsedFiles }} / {{ parsingStats.totalFiles }} 
          ({{ Math.round(parsingStats.parsedFiles / parsingStats.totalFiles * 100) }}%)
        </div>
      </div>
      
      <div v-if="parsingStats.averageParseTime > 0" class="performance-info">
        <div class="perf-item">
          <span class="perf-label">平均解析时间:</span>
          <span class="perf-value">{{ Math.round(parsingStats.averageParseTime) }}ms</span>
        </div>
      </div>
    </div>

    <!-- GBITS 格式说明 -->
    <div class="format-info-section">
      <h4 class="section-title">
        <i class="fas fa-info-circle"></i>
        格式说明
      </h4>
      
      <div class="info-content">
        <div class="info-item">
          <h5>什么是 GBITS？</h5>
          <p>GBITS 是《问道》游戏中使用的动画文件格式，包含多帧图像数据，用于角色动作、技能效果等动画展示。</p>
        </div>
        
        <div class="info-item">
          <h5>解析功能</h5>
          <ul>
            <li>提取第一帧图像</li>
            <li>支持 PNG 格式导出</li>
            <li>显示图像尺寸信息</li>
            <li>批量处理多个文件</li>
          </ul>
        </div>
        
        <div class="info-item">
          <h5>技术特点</h5>
          <ul>
            <li>二进制文件格式</li>
            <li>帧序列存储</li>
            <li>压缩图像数据</li>
            <li>索引表结构</li>
          </ul>
        </div>
        
        <div class="warning-note">
          <i class="fas fa-exclamation-triangle"></i>
          <span>注意：请确保你有合法权限处理这些游戏资源文件</span>
        </div>
      </div>
    </div>

    <!-- 操作历史（简化版） -->
    <div v-if="recentOperations.length > 0" class="history-section">
      <h4 class="section-title">
        <i class="fas fa-history"></i>
        最近操作
      </h4>
      
      <div class="history-list">
        <div 
          v-for="operation in recentOperations.slice(0, 5)" 
          :key="operation.id"
          class="history-item"
        >
          <div class="history-icon" :class="operation.type">
            <i :class="getOperationIcon(operation.type)"></i>
          </div>
          <div class="history-content">
            <div class="history-action">{{ operation.action }}</div>
            <div class="history-time">{{ formatTime(operation.timestamp) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 接口定义
interface GbitsFile {
  path: string
  name: string
  relativePath: string
  size: number
}

interface ParsedFrame {
  filePath: string
  fileName: string
  success: boolean
  error?: string
  width?: number
  height?: number
  format?: string
  imageData?: string
  dataSize?: number
  parseTime?: number
}

interface ParsingStats {
  totalFiles: number
  parsedFiles: number
  successCount: number
  failureCount: number
  averageParseTime: number
}

interface Operation {
  id: string
  type: 'parse' | 'export' | 'scan'
  action: string
  timestamp: number
  fileName?: string
}

// Props
const props = defineProps<{
  selectedFile?: GbitsFile | null
  parsedFrame?: ParsedFrame | null
  parsingStats: ParsingStats
}>()

// Emits
defineEmits<{
  parseFile: [file: GbitsFile]
  viewFrame: [file: GbitsFile]
  exportFrame: [file: GbitsFile]
}>()

// 响应式数据
const isParsing = ref(false)
const recentOperations = ref<Operation[]>([
  {
    id: '1',
    type: 'parse',
    action: '解析了 attack.gbits',
    timestamp: Date.now() - 60000,
    fileName: 'attack.gbits'
  },
  {
    id: '2',
    type: 'export',
    action: '导出了 magic.gbits 的第一帧',
    timestamp: Date.now() - 120000,
    fileName: 'magic.gbits'
  },
  {
    id: '3',
    type: 'scan',
    action: '扫描了新文件夹',
    timestamp: Date.now() - 300000
  }
])

// 工具函数
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function getOperationIcon(type: string): string {
  const iconMap = {
    parse: 'fas fa-play',
    export: 'fas fa-download',
    scan: 'fas fa-search'
  }
  return iconMap[type as keyof typeof iconMap] || 'fas fa-cog'
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  
  return new Date(timestamp).toLocaleDateString()
}
</script>

<script lang="ts">
export default {
  name: 'GbitsRightSidebar'
}
</script>

<style scoped>
.gbits-sidebar {
  width: 100%;
  height: 100%;
  padding: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

/* 隐藏滚动条 */
.gbits-sidebar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.gbits-sidebar::-webkit-scrollbar {
  display: none; /* WebKit */
}

.sidebar-header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.subtitle {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.section-title i {
  color: #6b7280;
  font-size: 12px;
}

/* 选中文件区域 */
.selected-file-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.file-card {
  background: white;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #e5e7eb;
}

.file-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.file-icon {
  width: 32px;
  height: 32px;
  background: #3b82f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.file-size {
  font-size: 12px;
  color: #6b7280;
}

.file-details {
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 12px;
}

.detail-item .label {
  color: #6b7280;
  font-weight: 500;
}

.detail-item .value {
  color: #374151;
  font-family: monospace;
  word-break: break-all;
  text-align: right;
  max-width: 60%;
}

/* 解析状态 */
.parse-status {
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 4px;
}

.status-success {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #059669;
  font-size: 13px;
  font-weight: 500;
  background: #d1fae5;
  padding: 6px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.status-failed {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #dc2626;
  font-size: 13px;
  font-weight: 500;
  background: #fee2e2;
  padding: 6px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.frame-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.info-item .label {
  color: #6b7280;
}

.info-item .value {
  color: #374151;
  font-family: monospace;
}

.error-info {
  margin-top: 8px;
  padding: 6px 8px;
  background: #fef2f2;
  border-radius: 4px;
  border-left: 3px solid #ef4444;
}

.error-label {
  font-size: 11px;
  color: #991b1b;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.error-message {
  font-size: 11px;
  color: #dc2626;
  word-break: break-all;
}

/* 操作按钮 */
.file-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  background: #2563eb;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
}

.action-btn.export {
  background: #f59e0b;
  color: white;
}

.action-btn.export:hover {
  background: #d97706;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 统计区域 */
.stats-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.stat-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.stat-icon.total {
  background: #dbeafe;
  color: #3b82f6;
}

.stat-icon.parsed {
  background: #fef3c7;
  color: #f59e0b;
}

.stat-icon.success {
  background: #d1fae5;
  color: #059669;
}

.stat-icon.failed {
  background: #fee2e2;
  color: #dc2626;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 10px;
  color: #6b7280;
  margin-bottom: 1px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* 进度信息 */
.progress-info {
  margin-bottom: 12px;
}

.progress-label {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 10px;
  color: #6b7280;
  text-align: center;
}

.performance-info {
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}

.perf-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.perf-label {
  color: #6b7280;
}

.perf-value {
  color: #374151;
  font-family: monospace;
  font-weight: 500;
}

/* 格式说明区域 */
.format-info-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.info-content {
  font-size: 12px;
  line-height: 1.5;
}

.info-item {
  margin-bottom: 12px;
}

.info-item h5 {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 6px 0;
}

.info-item p {
  color: #6b7280;
  margin: 0 0 8px 0;
}

.info-item ul {
  margin: 0;
  padding-left: 16px;
  color: #6b7280;
}

.info-item li {
  margin-bottom: 2px;
}

.warning-note {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: #fef3c7;
  border-radius: 4px;
  color: #92400e;
  font-size: 11px;
  margin-top: 8px;
}

.warning-note i {
  color: #f59e0b;
}

/* 操作历史区域 */
.history-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.history-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  flex-shrink: 0;
}

.history-icon.parse {
  background: #dbeafe;
  color: #3b82f6;
}

.history-icon.export {
  background: #fef3c7;
  color: #f59e0b;
}

.history-icon.scan {
  background: #d1fae5;
  color: #059669;
}

.history-content {
  flex: 1;
  min-width: 0;
}

.history-action {
  font-size: 11px;
  color: #374151;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-time {
  font-size: 10px;
  color: #9ca3af;
}
</style>
