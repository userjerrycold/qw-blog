<template>
  <PageLayout :rightSidebar="DocsRightSidebar">
    <div class="docs-container">
      <h1 class="text-2xl font-bold mb-6">技术文档</h1>
      
      <!-- Search and filters -->
      <div class="search-container mb-6">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索文档..." 
            class="search-input"
            @input="filterDocuments"
          />
          <svg class="search-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
        </div>
        
        <!-- Tag filters -->
        <div class="tag-filters">
          <n-tag 
            :bordered="false"
            :color="activeTag === null ? { color: '#f0f0f0', textColor: '#333' } : { color: '#e0e0e0', textColor: '#666' }"
            class="tag-filter"
            @click="setActiveTag(null)"
          >
            全部
          </n-tag>
          <n-tag 
            v-for="tag in uniqueTags" 
            :key="tag"
            :bordered="false"
            :color="activeTag === tag ? { color: '#f0f0f0', textColor: '#333' } : { color: '#e0e0e0', textColor: '#666' }"
            class="tag-filter"
            @click="setActiveTag(tag)"
          >
            {{ tag }}
          </n-tag>
        </div>
      </div>
      
      <!-- Add new document button -->
      <div class="add-doc-container mb-6">
        <n-button type="primary" @click="showAddModal = true">
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
            </svg>
          </template>
          添加文档
        </n-button>
      </div>
      
      <!-- Documents list -->
      <div class="docs-list">
        <div v-if="filteredDocuments.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="#e0e0e0"/>
            <path d="M8 12H16V14H8V12Z" fill="#e0e0e0"/>
            <path d="M8 16H16V18H8V16Z" fill="#e0e0e0"/>
          </svg>
          <p class="text-gray-500">没有找到匹配的文档</p>
        </div>
        
        <template v-else>
          <div v-for="doc in filteredDocuments" :key="doc.id" class="doc-item">
            <div class="doc-item-icon" :style="{ backgroundColor: getTagColor(doc.tag).bgColor }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" :fill="getTagColor(doc.tag).textColor"/>
              </svg>
            </div>
            <div class="doc-item-content">
              <div class="doc-item-header">
                <h3 class="doc-item-title">{{ doc.title }}</h3>
                <n-tag size="small" :color="{ color: getTagColor(doc.tag).bgColor, textColor: getTagColor(doc.tag).textColor }">
                  {{ doc.tag }}
                </n-tag>
              </div>
              <p class="doc-item-desc">{{ doc.description }}</p>
              <div class="doc-item-footer">
                <span class="doc-item-date">{{ formatDate(doc.createdAt) }}</span>
                <div class="doc-item-actions">
                  <a :href="doc.url" target="_blank" class="doc-item-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="currentColor"/>
                    </svg>
                  </a>
                  <button class="doc-item-action" @click="copyUrl(doc.url)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    
    <!-- Add document modal -->
    <n-modal v-model:show="showAddModal" preset="card" title="添加文档" style="width: 500px;">
      <n-form :model="newDoc" label-placement="left" label-width="80">
        <n-form-item label="标题" path="title">
          <n-input v-model:value="newDoc.title" placeholder="输入文档标题" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input v-model:value="newDoc.description" type="textarea" placeholder="输入文档描述" />
        </n-form-item>
        <n-form-item label="URL" path="url">
          <n-input v-model:value="newDoc.url" placeholder="输入文档URL" />
        </n-form-item>
        <n-form-item label="标签" path="tag">
          <n-select v-model:value="newDoc.tag" :options="tagOptions" placeholder="选择标签" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showAddModal = false">取消</n-button>
          <n-button type="primary" @click="addDocument">添加</n-button>
        </n-space>
      </template>
    </n-modal>
    
    <!-- Toast message -->
    <n-message-provider>
      <message-consumer ref="messageRef" />
    </n-message-provider>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { NTag, NButton, NModal, NForm, NFormItem, NInput, NSelect, NSpace, NMessageProvider, useMessage } from 'naive-ui'
import PageLayout from '@/components/layout/PageLayout.vue'
import DocsRightSidebar from '@/components/layout/DocsRightSidebar.vue'

interface Document {
  id: number;
  title: string;
  description: string;
  url: string;
  tag: string;
  createdAt: number;
}

interface TagColor {
  bgColor: string;
  textColor: string;
}

// Mock data for documents
const documents = ref<Document[]>([
  {
    id: 1,
    title: 'Spring Boot 配置指南',
    description: '详细介绍 Spring Boot 的配置方法，包括属性文件、YAML、环境变量等多种配置源的使用方法。',
    url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html',
    tag: 'Java',
    createdAt: new Date('2023-11-20').getTime()
  },
  {
    id: 2,
    title: 'Vue 3 组合式 API 参考',
    description: 'Vue 3 组合式 API 的完整参考，包括响应式系统、生命周期钩子、依赖注入等核心概念。',
    url: 'https://vuejs.org/api/composition-api-setup.html',
    tag: '前端',
    createdAt: new Date('2023-11-18').getTime()
  },
  {
    id: 3,
    title: 'Docker 容器化部署指南',
    description: '从基础到进阶的 Docker 容器化部署教程，包括镜像构建、网络配置、数据卷管理等内容。',
    url: 'https://docs.docker.com/get-started/',
    tag: 'DevOps',
    createdAt: new Date('2023-11-15').getTime()
  },
  {
    id: 4,
    title: 'MySQL 性能优化实践',
    description: '关于 MySQL 数据库性能优化的实用技巧，包括索引设计、查询优化、配置调优等方面的内容。',
    url: 'https://dev.mysql.com/doc/refman/8.0/en/optimization.html',
    tag: '数据库',
    createdAt: new Date('2023-11-12').getTime()
  },
  {
    id: 5,
    title: 'Git 工作流最佳实践',
    description: '详解企业级 Git 工作流的最佳实践，包括分支管理、提交规范、代码审查等流程的建议。',
    url: 'https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows',
    tag: 'Git',
    createdAt: new Date('2023-11-10').getTime()
  },
  {
    id: 6,
    title: 'React Hooks 完全指南',
    description: '深入解析 React Hooks 的工作原理和使用方法，包括自定义 Hook 的创建和常见问题的解决方案。',
    url: 'https://reactjs.org/docs/hooks-intro.html',
    tag: '前端',
    createdAt: new Date('2023-11-08').getTime()
  },
  {
    id: 7,
    title: 'Java 并发编程实战',
    description: '全面介绍 Java 并发编程的核心概念和实践技巧，包括线程安全、锁机制、并发集合等内容。',
    url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/',
    tag: 'Java',
    createdAt: new Date('2023-11-05').getTime()
  },
  {
    id: 8,
    title: 'Kubernetes 入门到精通',
    description: '从零开始学习 Kubernetes，包括核心概念、架构设计、部署管理、扩展开发等全方位内容。',
    url: 'https://kubernetes.io/docs/home/',
    tag: 'DevOps',
    createdAt: new Date('2023-11-02').getTime()
  }
]);

// UI state
const searchQuery = ref('');
const activeTag = ref<string | null>(null);
const showAddModal = ref(false);
const MessageConsumer = h('div');
const messageRef = ref(null);

// New document form
const newDoc = ref({
  title: '',
  description: '',
  url: '',
  tag: null as string | null
});

// Get unique tags for filter
const uniqueTags = computed(() => {
  const tags = documents.value.map(doc => doc.tag);
  return [...new Set(tags)];
});

// Tag options for select
const tagOptions = computed(() => {
  return uniqueTags.value.map(tag => ({
    label: tag,
    value: tag
  }));
});

// Filter documents by search query and active tag
const filteredDocuments = computed(() => {
  return documents.value
    .filter(doc => {
      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        return (
          doc.title.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          doc.tag.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(doc => {
      // Filter by active tag
      if (activeTag.value) {
        return doc.tag === activeTag.value;
      }
      return true;
    })
    .sort((a, b) => b.createdAt - a.createdAt); // Sort by creation date (newest first)
});

// Set active tag for filtering
function setActiveTag(tag: string | null): void {
  activeTag.value = tag;
}

// Filter documents (for search input)
function filterDocuments(): void {
  // The filtering is handled by the computed property
}

// Format date for display
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Get color for tag
function getTagColor(tag: string): TagColor {
  const colors: Record<string, TagColor> = {
    'Java': { bgColor: '#e8f4fa', textColor: '#0277bd' },
    '前端': { bgColor: '#fff8e1', textColor: '#ff8f00' },
    'DevOps': { bgColor: '#e8f5e9', textColor: '#2e7d32' },
    '数据库': { bgColor: '#f3e5f5', textColor: '#7b1fa2' },
    'Git': { bgColor: '#fbe9e7', textColor: '#d84315' }
  };
  
  return colors[tag] || { bgColor: '#f5f5f5', textColor: '#616161' };
}

// Copy URL to clipboard
function copyUrl(url: string): void {
  navigator.clipboard.writeText(url).then(() => {
    // Show success message
    const message = useMessage();
    message.success('已复制链接到剪贴板');
  });
}

// Add new document
function addDocument(): void {
  // Validate form
  if (!newDoc.value.title || !newDoc.value.url || !newDoc.value.tag) {
    const message = useMessage();
    message.error('请填写完整信息');
    return;
  }
  
  // Add document to list
  const newId = documents.value.length > 0 ? Math.max(...documents.value.map(d => d.id)) + 1 : 1;
  
  documents.value.push({
    id: newId,
    title: newDoc.value.title,
    description: newDoc.value.description || '',
    url: newDoc.value.url,
    tag: newDoc.value.tag as string,
    createdAt: new Date().getTime()
  });
  
  // Reset form and close modal
  newDoc.value = {
    title: '',
    description: '',
    url: '',
    tag: null
  };
  
  showAddModal.value = false;
  
  // Show success message
  const message = useMessage();
  message.success('文档添加成功');
  
  // TODO: Save to backend
  saveToBackend();
}

// Save documents to backend
function saveToBackend(): void {
  // This would be replaced with actual API call
  console.log('Saving to backend:', documents.value);
  
  // Mock API call
  // fetch('/api/docs', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(documents.value),
  // });
  
  // For now, we'll just write to a file in the cursor/ruler/技术文档.md
  // This would be handled by your backend API
}

// Load documents on mount
onMounted(() => {
  // This would be replaced with actual API call
  // fetch('/api/docs')
  //   .then(response => response.json())
  //   .then(data => {
  //     documents.value = data;
  //   });
});
</script>

<style scoped>
.docs-container {
  max-width: 100%;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-box {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  padding-left: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #d0d0d0;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #999;
}

.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-filter {
  cursor: pointer;
}

.add-doc-container {
  display: flex;
  justify-content: flex-end;
}

.docs-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 16px;
}

.doc-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.doc-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.doc-item-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doc-item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.doc-item-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.doc-item-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.doc-item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.doc-item-date {
  font-size: 12px;
  color: #999;
}

.doc-item-actions {
  display: flex;
  gap: 8px;
}

.doc-item-action {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.doc-item-action:hover {
  background-color: #e0e0e0;
}
</style> 