<template>
  <aside class="sidebar-container">
    <!-- 创建文档表单 -->
    <div class="sidebar-section">
      <h3 class="section-title">创建文档</h3>
      <div class="create-form">
        <div class="form-item">
          <label>文档名称</label>
          <n-input v-model:value="newDoc.title" placeholder="输入文档名称" size="small" />
        </div>
        <div class="form-item">
          <label>文档类型</label>
          <n-select 
            v-model:value="newDoc.tagCode" 
            :options="tagOptions" 
            placeholder="选择类型"
            size="small"
          />
        </div>
        <div class="form-item">
          <label>文档URL</label>
          <n-input v-model:value="newDoc.url" placeholder="输入文档URL" size="small" />
        </div>
        <div class="form-actions">
          <button class="action-btn cancel-btn" @click="resetForm">取消</button>
          <button class="action-btn create-btn" @click="createDocument">创建</button>
        </div>
      </div>
    </div>
    
    <!-- 文档分类统计 -->
    <div class="sidebar-section">
      <h3 class="section-title">文档分类统计</h3>
      <div class="stats">
        <div class="stat-item" v-for="(tag, index) in docTags" :key="index">
          <span class="stat-tag" :style="{ backgroundColor: getTagColor(tag.code).color, color: getTagColor(tag.code).textColor }">
            {{ tag.name }}
          </span>
          <span class="stat-value">{{ getTagCount(tag.code) }}</span>
        </div>
      </div>
    </div>
    
    <!-- 最近添加 -->
    <div class="sidebar-section">
      <h3 class="section-title">最近添加</h3>
      <div class="recent-docs">
        <div v-if="recentDocuments.length === 0" class="empty-recent">
          暂无文档
        </div>
        <div 
          v-for="doc in recentDocuments" 
          :key="doc.id" 
          class="recent-doc-card"
          @click="openDocUrl(doc.url)"
        >
          <div class="doc-icon" :style="{ backgroundColor: getTagColor(doc.tagCode).color, color: getTagColor(doc.tagCode).textColor }">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="doc-content">
            <h4 class="doc-title">{{ doc.title }}</h4>
            <p class="doc-meta">{{ getTagName(doc.tagCode) }} • {{ formatDate(doc.createdAt) }}</p>
          </div>
          <div class="doc-actions">
            <div class="doc-link-icon" title="访问链接">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="doc-copy-icon" @click.stop="copyDocUrl(doc.url)" title="复制链接">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits, withDefaults, reactive } from 'vue';
import { NInput, NSelect, useMessage } from 'naive-ui';
import { copyToClipboard } from '@/utils/clipboard';

// 创建消息实例
const message = useMessage();

interface Document {
  id: number;
  title: string;
  url: string;
  tagCode: number;
  createdAt: number;
  author?: string;
  status?: boolean;
  typeStr?: string;
  updateDt?: string;
}

interface TagType {
  code: number;
  name: string;
}

const props = withDefaults(defineProps<{
  documents: Document[]
}>(), {
  documents: () => []
});

const emit = defineEmits<{
  (e: 'add-document', doc: Omit<Document, 'id' | 'createdAt'>): void;
}>();

// 文档类型枚举
const DocTypeEnum: Record<string, TagType> = {
  ALL: { code: 0, name: '所有' },
  FEISHU: { code: 1, name: '飞书' },
  GITLAB: { code: 2, name: 'Gitlab' },
  CODE: { code: 3, name: 'Code' },
  REDMINE: { code: 4, name: 'Redmine' },
  OTHER: { code: 5, name: 'Other' }
};

// 所有标签
const docTags: TagType[] = [
  DocTypeEnum.FEISHU,
  DocTypeEnum.GITLAB,
  DocTypeEnum.CODE,
  DocTypeEnum.REDMINE,
  DocTypeEnum.OTHER
];

// 标签选项
const tagOptions = computed(() => {
  return docTags.map(tag => ({
    label: tag.name,
    value: tag.code
  }));
});

// 新文档表单
const newDoc = reactive({
  title: '',
  url: '',
  tagCode: 1 // 默认飞书
});

// 创建文档
function createDocument() {
  if (!newDoc.title || !newDoc.url) {
    return; // 简单验证
  }
  
  emit('add-document', {
    title: newDoc.title,
    url: newDoc.url,
    tagCode: newDoc.tagCode
  });
  
  resetForm();
}

// 重置表单
function resetForm() {
  newDoc.title = '';
  newDoc.url = '';
  newDoc.tagCode = 1;
}

// 最近添加的文档
const recentDocuments = computed(() => {
  return [...props.documents]
    .sort((a: Document, b: Document) => b.createdAt - a.createdAt)
    .slice(0, 3); // 显示最近添加的3篇
});

// 获取标签名称
function getTagName(code: number): string {
  const tag = Object.values(DocTypeEnum).find(t => t.code === code);
  return tag ? tag.name : 'Unknown';
}

// 获取标签数量
function getTagCount(code: number): number {
  return props.documents.filter(doc => doc.tagCode === code).length;
}

// 获取标签颜色
function getTagColor(code: number): { color: string, textColor: string } {
  const colors: Record<number, { color: string, textColor: string }> = {
    0: { color: '#f5f5f5', textColor: '#333' }, // 所有
    1: { color: '#E8F5E9', textColor: '#2E7D32' }, // 飞书
    2: { color: '#FFF3E0', textColor: '#E65100' }, // 码云
    3: { color: '#E3F2FD', textColor: '#1565C0' }, // Code
    4: { color: '#F3E5F5', textColor: '#6A1B9A' }, // Redmine
    5: { color: '#ECEFF1', textColor: '#546E7A' }, // Other
  };
  
  return colors[code] || colors[5];
}

// 打开文档URL
function openDocUrl(url: string): void {
  if (url) {
    window.open(url, '_blank');
  }
}

// 复制文档URL
async function copyDocUrl(url: string): Promise<void> {
  try {
    const success = await copyToClipboard(url);
    if (success) {
      message.success('链接已复制到剪贴板');
    } else {
      message.error('复制失败，请手动复制');
    }
  } catch (error) {
    console.error('复制失败:', error);
    message.error('复制失败，请手动复制');
  }
}

// 格式化日期
function formatDate(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);
  
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return '今天';
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit'
    });
  }
}
</script>

<script lang="ts">
export default {
  name: 'DocsRightSidebar'
}
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-right: 12px;
  height: 100%;
  width: 100%;
  overflow-y: auto; /* 启用垂直滚动 */
  overscroll-behavior: contain;
  padding-bottom: 60px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  /* 移除边框样式，由PageLayout提供 */
}

.sidebar-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.sidebar-section {
  background: transparent;
  backdrop-filter: none;
  border-radius: 0;
  padding: 0 0 16px 0;
  box-shadow: none;
  border: none;
  margin-bottom: 8px;
}

.sidebar-section:last-child {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 14px;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(230, 230, 230, 0.7);
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.form-item label {
  font-size: 13px;
  color: #555;
  white-space: nowrap;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
}

.action-btn {
  padding: 6px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  flex: 1;
  text-align: center;
  min-width: 70px;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #555;
  min-width: 70px;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.create-btn {
  background-color: #333;
  color: white;
  min-width: 70px;
}

.create-btn:hover {
  background-color: #555;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(230, 230, 230, 0.3);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-tag {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.stat-value {
  font-weight: 500;
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
  color: #555;
}

.recent-docs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-recent {
  text-align: center;
  padding: 20px 0;
  color: #888;
  font-size: 13px;
  font-style: italic;
}

.recent-doc-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-radius: 0;
  transition: all 0.2s;
  border: none;
  border-bottom: 1px solid rgba(230, 230, 230, 0.3);
  cursor: pointer;
  position: relative;
}

.recent-doc-card:last-child {
  border-bottom: none;
}

.recent-doc-card:hover {
  background-color: rgba(0, 0, 0, 0.03);
  border-color: transparent;
}

.recent-doc-card:hover .doc-title {
  color: #1976D2;
}

.doc-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: all 0.2s;
}

.recent-doc-card:hover .doc-actions {
  opacity: 0.7;
}

.doc-link-icon,
.doc-copy-icon {
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.doc-link-icon:hover,
.doc-copy-icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #1976D2;
}

.doc-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doc-content {
  flex: 1;
  min-width: 0;
}

.doc-title {
  margin: 0 0 2px 0;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-meta {
  margin: 0;
  font-size: 11px;
  color: #666;
}

.create-form .form-item:last-child {
  margin-bottom: 8px;
}

:deep(.n-input__input-el),
:deep(.n-base-selection) {
  min-height: 32px;
  height: 32px;
  font-size: 13px;
}

:deep(.n-base-selection-tags) {
  min-height: 32px;
}
</style> 