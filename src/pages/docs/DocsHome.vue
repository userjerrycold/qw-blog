<template>
  <div>
    <PageLayout>
      <div class="docs-container">
        <h1 class="text-2xl font-bold mb-6">文档管理</h1>
        
        <!-- 搜索栏和标签 -->
        <div class="search-and-tags">
          <!-- 搜索框 -->
          <div class="search-container">
            <div class="search-box">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="搜索文档..." 
                class="search-input"
              />
            </div>
          </div>
          
          <!-- 标签筛选 -->
          <div class="tags-container">
            <div class="tag-filters">
              <n-tag 
                v-for="tag in docTags" 
                :key="tag.code"
                :bordered="false"
                :color="activeTagCode === tag.code ? getTagColor(tag.code) : { color: '#f5f5f5', textColor: '#666' }"
                class="tag-filter"
                @click="setActiveTag(tag.code)"
              >
                {{ tag.name }}
              </n-tag>
            </div>
          </div>
        </div>
        
        <!-- 文档列表 -->
        <n-spin :show="isLoading">
          <div v-if="filteredDocuments.length === 0" class="empty-docs">
            <div class="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m5 2H6v16h12v-9h-7V4z"/>
              </svg>
            </div>
            <p>暂无文档</p>
          </div>
          <div v-else class="docs-content-wrapper">
            <div class="fixed-height-container">
              <div class="docs-list">
                <div
                  v-for="doc in filteredDocuments" 
                  :key="doc.id" 
                  class="doc-item"
                >
                  <div class="doc-main">
                    <div class="doc-title-tag">
                      <n-tag 
                        :bordered="false"
                        size="small"
                        :color="getTagColor(doc.tagCode)"
                        class="doc-tag"
                      >
                        {{ getTagName(doc.tagCode) }}
                      </n-tag>
                      <h3 class="doc-title">{{ doc.title }}</h3>
                    </div>
                    <div class="doc-url">
                      <a :href="doc.url" target="_blank" class="url-link">
                        {{ formatUrl(doc.url) }}
                      </a>
                    </div>
                  </div>
                  <div class="doc-actions">
                    <n-button
                      size="small"
                      quaternary
                      circle
                      @click.stop="copyUrl(doc.url)"
                      class="action-btn"
                      title="复制链接"
                    >
                      <n-icon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" fill="currentColor"/>
                        </svg>
                      </n-icon>
                    </n-button>
                    <n-button
                      size="small"
                      quaternary
                      circle
                      @click="editDocument(doc)"
                      class="action-btn"
                      title="编辑"
                    >
                      <n-icon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                      </n-icon>
                    </n-button>
                    <n-button
                      size="small"
                      quaternary
                      circle
                      @click="confirmDelete(doc)"
                      class="action-btn delete-btn"
                      title="删除"
                    >
                      <n-icon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                        </svg>
                      </n-icon>
                    </n-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-spin>
      </div>
      
      <template #rightSidebar>
        <DocsRightSidebar 
          :documents="documents"
          @add-document="addDocument"
        />
      </template>
    </PageLayout>
    
    <!-- 编辑文档模态框 - 全新设计 -->
    <n-modal v-model:show="showAddModal" :mask-closable="false" class="doc-modal">
      <div class="modal-container">
        <div class="modal-inner">
          <div class="modal-header">
            <div class="modal-title">{{ isEditing ? '编辑文档' : '添加文档' }}</div>
            <n-button quaternary circle class="close-btn" @click="cancelEdit">
              <n-icon>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </n-icon>
            </n-button>
          </div>
          
          <div class="modal-content">
            <div class="form-group">
              <label class="form-label">文档名称</label>
              <n-input 
                v-model:value="docForm.title" 
                placeholder="输入文档名称"
                class="form-control" 
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">URL</label>
              <n-input 
                v-model:value="docForm.url" 
                placeholder="输入文档URL"
                class="form-control" 
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">文档分类</label>
              <n-select 
                v-model:value="docForm.tagCode" 
                :options="tagOptions" 
                placeholder="选择分类"
                class="form-control"
              />
            </div>
          </div>
          
          <div class="modal-footer">
            <n-button class="cancel-button" @click="cancelEdit">取消</n-button>
            <n-button type="primary" class="save-button" @click="saveDocument">保存</n-button>
          </div>
        </div>
      </div>
    </n-modal>
    
    <!-- 删除确认对话框 -->
    <n-modal v-model:show="showDeleteModal" preset="dialog" title="确认删除" content="确定要删除这个文档吗？此操作无法撤销。" positive-text="删除" negative-text="取消" @positive-click="deleteDocumentHandler" @negative-click="showDeleteModal = false" />
    
    <!-- 消息提示 -->
    <n-message-provider placement="top-right">
      <message-consumer ref="messageRef" />
    </n-message-provider>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DocsHome'
})
import { ref, computed, reactive, onMounted, h } from 'vue'
import { NTag, NButton, NModal, NInput, NSelect, NSpace, NMessageProvider, useMessage, NSpin, NIcon } from 'naive-ui'
import PageLayout from '@/components/layout/PageLayout.vue'
import DocsRightSidebar from '@/components/layout/DocsRightSidebar.vue'
import { Document, DocumentSearchParams, searchDocuments, createDocument, updateDocument, deleteDocument } from '@/services/api'
import { copyToClipboard } from '@/utils/clipboard'

// 创建全局message实例
const message = useMessage();

// 文档接口
interface DocumentUI {
  id: number;
  title: string;
  url: string;
  tagCode: number;
  createdAt: number;
  author: string;
  status: boolean;
  typeStr: string;
  updateDt?: string;
}

// 新文档接口
interface NewDocument {
  title: string;
  url: string;
  tagCode: number;
}

// 标签类型接口
interface TagType {
  code: number;
  name: string;
}

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
  DocTypeEnum.ALL,
  DocTypeEnum.FEISHU,
  DocTypeEnum.GITLAB,
  DocTypeEnum.CODE,
  DocTypeEnum.REDMINE,
  DocTypeEnum.OTHER
];

// UI状态
const searchQuery = ref('');
const activeTagCode = ref(0); // 默认显示所有
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const currentDoc = ref<DocumentUI | null>(null);
const MessageConsumer = h('div');
const messageRef = ref(null);
const isLoading = ref(false);

// 原始文档列表
const allDocuments = ref<DocumentUI[]>([]);

// 表单数据
const docForm = reactive({
  id: 0,
  title: '',
  url: '',
  tagCode: 1 // 默认飞书
});

// 标签选项
const tagOptions = computed(() => {
  return Object.values(DocTypeEnum)
    .filter(tag => tag.code !== 0) // 排除"所有"选项
    .map(tag => ({
      label: tag.name,
      value: tag.code
    }));
});

// 文档数据
const documents = ref<DocumentUI[]>([]);

// 获取文档列表
async function fetchDocuments() {
  isLoading.value = true;
  try {
    const params: DocumentSearchParams = {
      username: 'qianhu',
      type: activeTagCode.value,
      fileUrl: '',
      fileName: '',
      id: 0
    };

    const response = await searchDocuments(params);
    if (response.data && response.data.code === 200) {
      // 将API返回的文档数据转换为UI使用的格式
      allDocuments.value = response.data.data.map(doc => ({
        id: doc.id,
        title: doc.name,
        url: doc.url,
        tagCode: doc.type,
        author: doc.author,
        status: doc.status,
        typeStr: doc.typeStr,
        createdAt: new Date(doc.createDt).getTime(),
        updateDt: doc.updateDt
      }));
      
      // 更新文档列表
      documents.value = [...allDocuments.value];
    } else {
      message.error('获取文档列表失败：' + (response.data?.msg || '未知错误'));
    }
  } catch (error) {
    console.error('获取文档列表失败:', error);
    message.error('获取文档列表失败，请检查网络连接');
  } finally {
    isLoading.value = false;
  }
}

// 本地过滤文档列表 - 使用计算属性实现实时过滤
const filteredDocuments = computed(() => {
  // 1. 先根据搜索词过滤
  const searchFiltered = searchQuery.value
    ? documents.value.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : documents.value;
  
  // 2. 再根据标签过滤（如果已经在API中过滤，此步可忽略）
  const tagFiltered = activeTagCode.value === 0
    ? searchFiltered
    : searchFiltered.filter(doc => doc.tagCode === activeTagCode.value);
  
  // 3. 按创建时间排序
  return tagFiltered.sort((a, b) => b.createdAt - a.createdAt);
});

// 设置活动标签
async function setActiveTag(code: number): Promise<void> {
  activeTagCode.value = code;
  await fetchDocuments(); // 重新获取文档列表
}

// 获取标签名称
function getTagName(code: number): string {
  const tag = Object.values(DocTypeEnum).find(t => t.code === code);
  return tag ? tag.name : 'Unknown';
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

// 格式化URL显示
function formatUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
  } catch {
    return url;
  }
}

// 复制URL到剪贴板
async function copyUrl(url: string): Promise<void> {
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

// 从侧边栏接收新文档
async function addDocument(newDoc: NewDocument): Promise<void> {
  try {
    const doc = {
      name: newDoc.title,
      url: newDoc.url,
      type: newDoc.tagCode,
      author: 'qianhu'
    };
    
    const response = await createDocument(doc);
    
    if (response.data && response.data.code === 200) {
      message.success('文档已添加');
      fetchDocuments(); // 刷新文档列表
    } else {
      message.error('添加文档失败：' + (response.data?.msg || '未知错误'));
    }
  } catch (error) {
    console.error('添加文档失败:', error);
    message.error('添加文档失败，请检查网络连接');
  }
}

// 编辑文档
function editDocument(doc: DocumentUI): void {
  isEditing.value = true;
  currentDoc.value = doc;
  docForm.id = doc.id;
  docForm.title = doc.title;
  docForm.url = doc.url;
  docForm.tagCode = doc.tagCode;
  showAddModal.value = true;
}

// 确认删除
function confirmDelete(doc: DocumentUI): void {
  currentDoc.value = doc;
  showDeleteModal.value = true;
}

// 删除文档
async function deleteDocumentHandler(): Promise<void> {
  if (currentDoc.value) {
    try {
      const response = await deleteDocument(currentDoc.value.id);
      
      if (response.data && response.data.code === 200) {
        message.success('文档已删除');
        fetchDocuments(); // 刷新文档列表
      } else {
        message.error('删除文档失败：' + (response.data?.msg || '未知错误'));
      }
    } catch (error) {
      console.error('删除文档失败:', error);
      message.error('删除文档失败，请检查网络连接');
    } finally {
      showDeleteModal.value = false;
    }
  }
}

// 取消编辑
function cancelEdit(): void {
  showAddModal.value = false;
  resetForm();
}

// 重置表单
function resetForm(): void {
  isEditing.value = false;
  currentDoc.value = null;
  docForm.id = 0;
  docForm.title = '';
  docForm.url = '';
  docForm.tagCode = 1;
}

// 保存文档
async function saveDocument(): Promise<void> {
  // 表单验证
  if (!docForm.title || !docForm.url) {
    message.error('请填写完整信息');
    return;
  }
  
  if (isEditing.value && currentDoc.value) {
    // 更新文档
    try {
      const doc = {
        id: docForm.id,
        name: docForm.title,
        url: docForm.url,
        type: docForm.tagCode,
        author: 'qianhu'
      };
      
      const response = await updateDocument(doc);
      
      if (response.data && response.data.code === 200) {
        message.success('文档已更新');
        fetchDocuments(); // 刷新文档列表
      } else {
        message.error('更新文档失败：' + (response.data?.msg || '未知错误'));
      }
    } catch (error) {
      console.error('更新文档失败:', error);
      message.error('更新文档失败，请检查网络连接');
    }
  } else {
    // 添加新文档
    const doc = {
      name: docForm.title,
      url: docForm.url,
      type: docForm.tagCode,
      author: 'qianhu'
    };
    
    try {
      const response = await createDocument(doc);
      
      if (response.data && response.data.code === 200) {
        message.success('文档已添加');
        fetchDocuments(); // 刷新文档列表
      } else {
        message.error('添加文档失败：' + (response.data?.msg || '未知错误'));
      }
    } catch (error) {
      console.error('添加文档失败:', error);
      message.error('添加文档失败，请检查网络连接');
    }
  }
  
  showAddModal.value = false;
  resetForm();
}

// 初始化加载文档
onMounted(() => {
  fetchDocuments();
});
</script>

<style scoped>
.docs-container {
  padding: 0 16px;
}

/* 搜索框和标签样式 */
.search-and-tags {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
}

/* 搜索框容器 */
.search-container {
  display: flex;
}

/* 美化后的搜索框 */
.search-box {
  position: relative;
  width: 100%;
  max-width: 360px;
  height: 42px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  box-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(230, 230, 230, 0.7);
}

.search-input {
  width: 100%;
  height: 100%;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 14px;
  color: #333;
}

.search-input:focus {
  outline: none;
}

/* 标签栏 */
.tags-container {
  margin-top: 2px;
  width: 100%;
}

.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-filter {
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.tag-filter:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

/* 添加按钮容器 */
.add-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

/* 文档列表样式 - 极简列表 */
.empty-docs {
  text-align: center;
  padding: 40px 0;
  color: #8c9396;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #d0d7de;
}

.docs-content-wrapper {
  display: flex;
  flex-direction: column;
}

.fixed-height-container {
  height: 65vh;
  max-height: 65vh;
  position: relative;
  overflow: hidden;
  background-color: #fafafa;
  border-radius: 8px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
}

.docs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  overflow-y: auto;
  height: 100%;
  max-height: 100%;
}

.doc-item {
  padding: 12px 16px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.doc-item:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.doc-main {
  flex: 1;
  min-width: 0; /* 确保flex子项可以正确收缩 */
}

.doc-title-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.doc-tag {
  flex-shrink: 0;
}

.doc-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-url {
  margin-top: 2px;
}

.url-link {
  font-size: 12px;
  color: #666;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  white-space: nowrap;
  transition: color 0.2s;
}

.url-link:hover {
  color: #3366ff;
  text-decoration: underline;
}

.doc-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.action-btn {
  opacity: 0.7;
  transition: all 0.2s;
}

.action-btn:hover {
  opacity: 1;
}

.delete-btn:hover {
  color: #f56c6c;
}

/* 全新设计的编辑弹窗样式 */
.doc-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.doc-modal :deep(.n-modal) {
  width: auto !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  max-width: 500px !important;
}

.doc-modal :deep(.n-modal-body),
.doc-modal :deep(.n-modal-body-wrapper),
.doc-modal :deep(.n-card),
.doc-modal :deep(.n-card__content) {
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  width: 100% !important;
}

.modal-inner {
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: left;
}

.close-btn {
  margin-right: -8px;
  color: #999;
}

.modal-content {
  padding: 24px;
  text-align: left;
}

.form-group {
  margin-bottom: 24px;
  text-align: left;
  width: 100%;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  text-align: left;
}

.form-control {
  width: 100%;
}

.form-control :deep(.n-input),
.form-control :deep(.n-base-selection) {
  width: 100% !important;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px 20px;
  border-top: 1px solid #f0f0f0;
  gap: 12px;
}

.cancel-button {
  min-width: 80px;
  color: #333 !important;
}

.save-button {
  min-width: 80px;
  background-color: #333 !important;
  border-color: #333 !important;
}

.save-button:hover {
  background-color: #555 !important;
  border-color: #555 !important;
}

/* 响应式样式调整 */
@media (max-width: 768px) {
  .search-box {
    width: 100%;
    max-width: 100%;
  }
  
  .search-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .doc-title-tag {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .doc-actions {
    margin-left: 8px;
  }
}

@media (max-width: 480px) {
  .doc-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .doc-actions {
    margin-top: 8px;
    align-self: flex-end;
  }
  
  .modal-container {
    width: 90vw;
  }
}
</style> 