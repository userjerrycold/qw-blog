<template>
  <div class="memo-page">
    <!-- 添加FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <PageLayout>
      <div class="memo-container">
        <div class="page-header">
          <h1 class="page-title">备忘录</h1>
          
          <!-- 搜索栏和标签 -->
          <div class="search-and-tags">
            <div class="search-and-add">
              <!-- 搜索框 -->
              <div class="search-container">
                <div class="search-box">
                  <div class="search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="搜索备忘录..." 
                    class="search-input"
                    @keyup.enter="handleSearch"
                  />
                </div>
              </div>
              
              <!-- 添加按钮 -->
              <button class="add-button" @click="addNewMemo" title="添加备忘录">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            
            <!-- 标签筛选 -->
            <div class="tags-container">
              <div class="tag-filters">
                <div 
                  v-for="tag in memoTags" 
                  :key="tag.code"
                  class="tag"
                  :class="[
                    { 'active': activeTagCode === tag.code },
                    `tag-${tag.code}`
                  ]"
                  @click="setActiveTag(tag.code)"
                >
                  <i :class="getTagIcon(tag.code)"></i> {{ tag.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-divider"></div>
        
        <!-- 备忘录列表 -->
        <n-spin :show="isLoading">
          <div v-if="filteredMemos.length === 0" class="empty-memos">
            <div class="empty-illustration">
              <svg width="84" height="84" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </div>
            <p>暂无备忘录，点击 + 按钮添加</p>
          </div>
          <div v-else>
            <!-- 今日备忘录 -->
            <div v-if="todayMemos.length > 0" class="memo-group">
              <h2 class="group-title today-title">
                <span class="title-icon"><i class="fas fa-sun"></i></span>
                <span class="title-text">今日</span>
              </h2>
              <div class="memo-list">
                <div 
                  v-for="memo in todayMemos" 
                  :key="memo.id" 
                  class="memo-card"
                  :class="[`memo-card-${memo.tagCode}`, {'todo-memo': memo.isTodo && !memo.completed, 'completed-memo': memo.isTodo && memo.completed}]"
                  @click="viewMemo(memo)"
                >
                  <div class="memo-header">
                    <div class="memo-title">{{ memo.title }}</div>
                    <div class="memo-category">
                      <i :class="getTagIcon(memo.tagCode)"></i> {{ getTagName(memo.tagCode) }}
                    </div>
                  </div>
                  
                  <div class="memo-content">
                    {{ getContentSnippet(memo.content) }}
                  </div>
                  
                  <div class="memo-footer">
                    <div class="memo-date"><i class="far fa-clock"></i> {{ formatFullDate(memo.createdAt) }}</div>
                    <div class="memo-actions">
                      <i class="fas fa-edit" @click.stop="editMemo(memo)"></i>
                      <i class="fas fa-trash-alt" @click.stop="confirmDelete(memo)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="group-divider" v-if="todayMemos.length > 0 && pastMemos.length > 0"></div>
            
            <!-- 过去备忘录 -->
            <div v-if="pastMemos.length > 0" class="memo-group">
              <h2 class="group-title history-title">
                <span class="title-icon"><i class="fas fa-history"></i></span>
                <span class="title-text">早期时间</span>
              </h2>
              <div class="memo-list">
                <div 
                  v-for="memo in pastMemos" 
                  :key="memo.id" 
                  class="memo-card"
                  :class="[`memo-card-${memo.tagCode}`, {'todo-memo': memo.isTodo && !memo.completed, 'completed-memo': memo.isTodo && memo.completed}]"
                  @click="viewMemo(memo)"
                >
                  <div class="memo-header">
                    <div class="memo-title">{{ memo.title }}</div>
                    <div class="memo-category">
                      <i :class="getTagIcon(memo.tagCode)"></i> {{ getTagName(memo.tagCode) }}
                    </div>
                  </div>
                  
                  <div class="memo-content">
                    {{ getContentSnippet(memo.content) }}
                  </div>
                  
                  <div class="memo-footer">
                    <div class="memo-date"><i class="far fa-clock"></i> {{ formatFullDate(memo.createdAt) }}</div>
                    <div class="memo-actions">
                      <i class="fas fa-edit" @click.stop="editMemo(memo)"></i>
                      <i class="fas fa-trash-alt" @click.stop="confirmDelete(memo)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-spin>
      </div>
      
      <template #rightSidebar>
        <MemoRightSidebar 
          :memos="memos"
          @add-memo="addMemo"
        />
      </template>
    </PageLayout>
    
    <!-- 模态框已被移除，此处可以构建新的弹窗 -->
    
    <!-- 查看备忘录详情模态框 -->
    <n-modal v-model:show="showViewModal" class="memo-modal" style="width: 70vw; max-width: 800px;">
      <div class="modal-container">
        <div class="modal-inner">
          <div class="modal-header">
            <div class="modal-title">
              <span>{{ currentMemo ? currentMemo.title : '' }}</span>
            </div>
            <n-button quaternary circle class="close-btn" @click="showViewModal = false">
              <n-icon>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </n-icon>
            </n-button>
          </div>
          
          <div class="modal-content">
            <div class="memo-view-meta-info">
              <div v-if="currentMemo" class="view-tag">
                <i :class="getTagIcon(currentMemo.tagCode)"></i> {{ currentMemo ? getTagName(currentMemo.tagCode) : '' }}
              </div>
              <div class="memo-view-meta">
                <div>创建于: {{ currentMemo ? formatFullDate(currentMemo.createdAt) : '' }}</div>
              </div>
            </div>

            <div class="memo-view-content">
              <!-- 使用ByteMD渲染Markdown内容 -->
              <BytemdViewer v-if="currentMemo" :value="currentMemo.content" :plugins="viewerPlugins" />
            </div>
            
            <!-- 将待办状态区域移到内容框下方 -->
            <div v-if="currentMemo && currentMemo.isTodo" class="todo-status-view" :class="{'completed': currentMemo.completed}">
              <div class="todo-checkbox" @click="toggleViewTodoStatus">
                <svg v-if="currentMemo.completed" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
                </svg>
              </div>
              <span>{{ currentMemo.completed ? '已完成' : '待办事项' }}</span>
              <div v-if="currentMemo.dueDate" class="due-date-view" :class="{'overdue': isOverdue(currentMemo.dueDate)}">
                截止日期: {{ formatFullDate(currentMemo.dueDate) }}
                <span v-if="isOverdue(currentMemo.dueDate)" class="overdue-label">已过期</span>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <n-button class="cancel-button" @click="editCurrentMemo">编辑</n-button>
            <n-button type="primary" class="save-button" @click="closeViewModal">关闭</n-button>
          </div>
        </div>
      </div>
    </n-modal>
    
    <!-- 编辑备忘录模态框 -->
    <n-modal v-model:show="showEditModal" :mask-closable="false" class="memo-modal" style="width: 70vw; max-width: 800px;">
      <div class="modal-container">
        <div class="modal-inner">
          <div class="modal-header">
            <div class="modal-title">{{ isEditing ? '编辑备忘录' : '添加备忘录' }}</div>
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
              <label class="form-label">标题</label>
              <n-input 
                :value="memoForm.title" 
                placeholder="输入标题"
                class="form-control"
                @update:value="(value) => { memoForm.title = value }"
                clearable
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">内容</label>
              <!-- 使用ByteMD替代之前的编辑器 -->
              <BytemdEditor
                v-model="memoForm.content"
                :plugins="editorPlugins"
                :upload-images="handleUploadImages"
                placeholder="输入内容..."
                class="form-control markdown-editor"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">分类</label>
              <div class="category-selector">
                <button v-for="tag in tagOptions" :key="tag.value" :class="['category-option', { active: memoForm.tagCode === tag.value }]" @click.prevent="memoForm.tagCode = tag.value">
                  <i :class="getTagIcon(tag.value)"></i> {{ tag.label }}
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <div class="todo-switch">
                <label class="form-label">待办事项</label>
                <n-switch 
                  :value="memoForm.isTodo"
                  @update:value="(value) => { 
                    memoForm.isTodo = value;
                    console.log('待办状态更改为:', value);
                    // 如果变为非待办，清空截止日期
                    if (!value) {
                      memoForm.dueDate = null;
                    }
                  }"
                />
              </div>
              <div v-if="memoForm.isTodo" class="due-date-group">
                <label class="form-label">截止日期 <span class="required">*</span></label>
                <n-date-picker
                  :value="memoForm.dueDate"
                  @update:value="(value) => memoForm.dueDate = value"
                  type="date"
                  class="due-date-picker"
                  :is-date-disabled="isDateDisabled"
                />
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <n-button class="cancel-button" @click="cancelEdit">取消</n-button>
            <n-button type="primary" class="save-button" @click="saveMemo">保存</n-button>
          </div>
        </div>
      </div>
    </n-modal>
    
    <!-- 删除确认对话框 -->
    <n-modal v-model:show="showDeleteModal" class="memo-modal delete-modal" style="width: 70vw; max-width: 600px;">
      <div class="modal-container">
        <div class="modal-inner">
          <div class="modal-header">
            <div class="modal-title">确认删除</div>
            <n-button quaternary circle class="close-btn" @click="showDeleteModal = false">
              <n-icon>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </n-icon>
            </n-button>
          </div>
          
          <div class="modal-content delete-content">
            <div class="delete-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="delete-message">
              确定要删除这条备忘录吗？<br>此操作无法撤销。
            </div>
          </div>
          
          <div class="modal-footer">
            <n-button class="cancel-button" @click="showDeleteModal = false">取消</n-button>
            <n-button type="primary" class="save-button danger-button" @click="deleteMemoHandler">删除</n-button>
          </div>
        </div>
      </div>
    </n-modal>
    
    <!-- 消息提示 -->
    <n-message-provider placement="top-right">
      <message-consumer ref="messageRef" />
    </n-message-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, h, nextTick } from 'vue'
import { NTag, NButton, NModal, NInput, NSelect, NSpace, NMessageProvider, useMessage, NSpin, NIcon, NSwitch, NDatePicker } from 'naive-ui'
import PageLayout from '@/components/layout/PageLayout.vue'
import MemoRightSidebar from '@/components/layout/MemoRightSidebar.vue'

// 导入ByteMD编辑器和相关插件
import { Editor as BytemdEditor, Viewer as BytemdViewer } from '@bytemd/vue-next'
import 'bytemd/dist/index.css'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.css'

import { searchMemos, createMemo, updateMemo, deleteMemo, toggleMemoStatus, getMemoStatistics, 
         Memo as ApiMemo, MemoSearchParams, MemoCreateParams, MemoUpdateParams } from '@/services/api';

// ByteMD编辑器插件配置
const editorPlugins = [
  gfm(),
  highlight(),
  math()
];

// ByteMD查看器插件配置
const viewerPlugins = [
  gfm(),
  highlight(),
  math()
];

// 图片上传处理函数
async function handleUploadImages(files: File[]): Promise<string[]> {
  // 这里只是一个简单的实现，将图片转为base64
  // 实际项目中，您可能需要将图片上传到服务器
  const urls: string[] = [];
  for (const file of files) {
    const url = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    urls.push(url);
  }
  return urls;
}

// 创建全局message实例
const message = useMessage();

// 备忘录接口
interface Memo {
  id: number;
  title: string;
  content: string;
  tagCode: number;
  createdAt: number; // 前端使用时间戳
  isTodo: boolean;
  dueDate?: number | null; // 前端使用时间戳
  completed?: boolean;
}

// 标签类型接口
interface TagType {
  code: number;
  name: string;
}

// 备忘录类型枚举
const MemoTypeEnum: Record<string, TagType> = {
  ALL: { code: 0, name: '所有' },
  WORK: { code: 1, name: '工作' },
  STUDY: { code: 2, name: '学习' },
  LIFE: { code: 3, name: '生活' },
  OTHER: { code: 4, name: '其他' },
};

// 所有标签
const memoTags: TagType[] = [
  MemoTypeEnum.ALL,
  MemoTypeEnum.WORK,
  MemoTypeEnum.STUDY,
  MemoTypeEnum.LIFE,
  MemoTypeEnum.OTHER
];

// UI状态
const searchQuery = ref('');
const activeTagCode = ref(0); // 默认显示所有
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showViewModal = ref(false); // 显示查看备忘录模态框
const isEditing = ref(false);
const currentMemo = ref<Memo | null>(null);
const MessageConsumer = h('div');
const messageRef = ref(null);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const totalItems = ref(0);
const username = ref('qianhu'); // 当前用户名，实际项目中可能从用户状态或配置中获取

// 备忘录表单数据
const memoForm = reactive({
  id: 0,
  title: '',
  content: '',
  tagCode: 1, // 默认工作
  isTodo: false,
  dueDate: null as number | null,
  completed: false
});

// 标签选项
const tagOptions = computed(() => {
  return Object.values(MemoTypeEnum)
    .filter(tag => tag.code !== 0) // 排除"所有"选项
    .map(tag => ({
      label: tag.name,
      value: tag.code
    }));
});

// 备忘录数据 - 从API获取
const memos = ref<Memo[]>([]);

// 构造搜索参数
const searchParams = computed((): MemoSearchParams => {
  return {
    username: username.value,
    tagCode: activeTagCode.value === 0 ? undefined : activeTagCode.value,
    keyword: searchQuery.value ? searchQuery.value : undefined,
    page: currentPage.value,
    pageSize: pageSize.value
  };
});

// 从API获取备忘录数据
const fetchMemos = async () => {
  isLoading.value = true;
  try {
    const response = await searchMemos(searchParams.value);
    if (response.data.code === 200) {
      // 转换API返回的数据为前端需要的格式
      const responseData = response.data.data;
      // 注意：实际API返回的是data.data数组而不是data.list
      memos.value = (responseData.data || []).map(apiMemo => ({
        id: apiMemo.id,
        title: apiMemo.title,
        content: apiMemo.content,
        tagCode: apiMemo.tagCode,
        createdAt: new Date(apiMemo.createDt).getTime(), // 转换为时间戳
        isTodo: apiMemo.isTodo,
        dueDate: apiMemo.dueDate ? new Date(apiMemo.dueDate).getTime() : null,
        completed: apiMemo.completed
      }));
      totalItems.value = responseData.total;
    } else {
      message.error(`获取备忘录失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error('获取备忘录错误:', error);
    message.error('获取备忘录失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 本地过滤备忘录列表 - 使用计算属性实现实时过滤
const filteredMemos = computed(() => {
  // 数据已在后端按条件过滤，这里仅按创建时间排序
  return [...memos.value].sort((a, b) => b.createdAt - a.createdAt);
});

// 按时间分组的备忘录
const todayMemos = computed(() => {
  // 获取今天的起始时间
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  
  return filteredMemos.value.filter(memo => memo.createdAt >= todayTimestamp);
});

const pastMemos = computed(() => {
  // 获取今天的起始时间
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  
  return filteredMemos.value.filter(memo => memo.createdAt < todayTimestamp);
});

// 设置活动标签
function setActiveTag(code: number): void {
  activeTagCode.value = code;
  // 切换标签时重新获取数据
  currentPage.value = 1; // 重置到第一页
  fetchMemos();
}

// 获取标签名称
function getTagName(code: number): string {
  const tag = Object.values(MemoTypeEnum).find(t => t.code === code);
  return tag ? tag.name : 'Unknown';
}

// 获取标签颜色
function getTagColor(code: number): { color: string, textColor: string } {
  const colors: Record<number, { color: string, textColor: string }> = {
    0: { color: '#f5f5f5', textColor: '#333' }, // 所有
    1: { color: '#3B82F6', textColor: '#ffffff' }, // 工作
    2: { color: '#10B981', textColor: '#ffffff' }, // 学习
    3: { color: '#F59E0B', textColor: '#ffffff' }, // 生活
    4: { color: '#8B5CF6', textColor: '#ffffff' }, // 其他
  };
  
  return colors[code] || colors[4];
}

// 获取内容摘要
function getContentSnippet(content: string): string {
  if (!content) return '';
  
  // 截取前100个字符，如果超过100个字符则添加省略号
  return content.length > 100 ? content.substring(0, 100) + '...' : content;
}

// 编辑备忘录
function editMemo(memo: Memo): void {
  isEditing.value = true;
  currentMemo.value = memo;
  
  // 赋值到表单
  memoForm.id = memo.id;
  memoForm.title = String(memo.title || '');
  memoForm.content = memo.content;
  memoForm.tagCode = memo.tagCode;
  memoForm.isTodo = memo.isTodo;
  memoForm.dueDate = memo.dueDate || null;
  memoForm.completed = memo.completed || false;
  
  showEditModal.value = true;
  showViewModal.value = false; // 关闭查看模态框
}

// 确认删除
function confirmDelete(memo: Memo): void {
  currentMemo.value = memo;
  showDeleteModal.value = true;
}

// 删除备忘录
async function deleteMemoHandler(): Promise<void> {
  if (currentMemo.value) {
    isLoading.value = true;
    try {
      const response = await deleteMemo(currentMemo.value.id);
      if (response.data.code === 200 && response.data.data) {
        memos.value = memos.value.filter(m => m.id !== currentMemo.value!.id);
        message.success('备忘录已删除');
        showDeleteModal.value = false;
        showViewModal.value = false; // 如果正在查看，也关闭查看模态框
      } else {
        message.error(`删除备忘录失败: ${response.data.msg}`);
      }
    } catch (error) {
      console.error('删除备忘录错误:', error);
      message.error('删除备忘录失败，请稍后重试');
    } finally {
      isLoading.value = false;
    }
  }
}

// 添加新备忘录的入口函数
function addNewMemo(): void {
  isEditing.value = false;
  resetForm();
  showEditModal.value = true;
}

// 从侧边栏接收新备忘录
async function addMemo(newMemo: Omit<MemoCreateParams, 'author'>): Promise<void> {
  isLoading.value = true;
  const params: MemoCreateParams = {
    ...newMemo,
    author: username.value
  };
  
  try {
    const response = await createMemo(params);
    if (response.data.code === 200) {
      // 添加成功后刷新列表
      fetchMemos();
      message.success('备忘录已添加');
    } else {
      message.error(`添加备忘录失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error('添加备忘录错误:', error);
    message.error('添加备忘录失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
}

// 取消编辑
function cancelEdit(): void {
  showEditModal.value = false;
  resetForm();
}

// 重置表单
function resetForm(): void {
  isEditing.value = false;
  currentMemo.value = null;
  memoForm.id = 0;
  memoForm.title = '';
  memoForm.content = '';
  memoForm.tagCode = 1;
  memoForm.isTodo = false;
  memoForm.dueDate = null;
  memoForm.completed = false;
}

// 保存备忘录
async function saveMemo(): Promise<void> {
  // 表单验证
  const titleValue = String(memoForm.title || '');
  
  if (!titleValue.trim()) {
    message.error('请填写标题');
    return;
  }
  
  // 验证待办事项的截止日期
  if (memoForm.isTodo && !memoForm.dueDate) {
    message.error('待办事项的截止日期不能为空');
    return;
  }
  
  isLoading.value = true;
  
  try {
    if (isEditing.value && currentMemo.value) {
      // 更新备忘录
      const updateParams: MemoUpdateParams = {
        id: memoForm.id,
        title: memoForm.title,
        content: memoForm.content,
        tagCode: memoForm.tagCode,
        isTodo: memoForm.isTodo,
        dueDate: memoForm.dueDate ? formatDateForBackend(memoForm.dueDate) : undefined,
        completed: memoForm.completed
      };
      
      const response = await updateMemo(updateParams);
      if (response.data.code === 200 && response.data.data) {
        // 更新成功后刷新列表
        fetchMemos();
        message.success('备忘录已更新');
      } else {
        message.error(`更新备忘录失败: ${response.data.msg}`);
      }
    } else {
      // 添加新备忘录
      const createParams: MemoCreateParams = {
        title: memoForm.title,
        content: memoForm.content,
        tagCode: memoForm.tagCode,
        isTodo: memoForm.isTodo,
        dueDate: memoForm.dueDate ? formatDateForBackend(memoForm.dueDate) : undefined,
        author: username.value
      };
      
      const response = await createMemo(createParams);
      if (response.data.code === 200) {
        // 添加成功后刷新列表
        fetchMemos();
        message.success('备忘录已添加');
      } else {
        message.error(`添加备忘录失败: ${response.data.msg}`);
      }
    }
    
    showEditModal.value = false;
    resetForm();
  } catch (error) {
    console.error('保存备忘录错误:', error);
    message.error('保存备忘录失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
}

// 格式化日期为后端接受的格式: yyyy-MM-dd HH:mm:ss
function formatDateForBackend(timestamp: number | null): string | undefined {
  if (!timestamp) return undefined;
  
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 获取随机颜色用于备忘录图标
function getRandomColor(memo: Memo): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#A855F7'  // Violet
  ];
  
  // 使用备忘录ID作为索引，这样同一备忘录每次渲染都是同一颜色
  return colors[memo.id % colors.length];
}

// 格式化完整日期
function formatFullDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// 格式化相对时间
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  // 不到1分钟
  if (diff < 60000) {
    return '刚刚';
  }
  
  // 分钟级
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`;
  }
  
  // 小时级
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`;
  }
  
  // 天级
  if (diff < 2592000000) {
    return `${Math.floor(diff / 86400000)}天前`;
  }
  
  // 月级
  if (diff < 31536000000) {
    return `${Math.floor(diff / 2592000000)}月前`;
  }
  
  // 年级
  return `${Math.floor(diff / 31536000000)}年前`;
}

// 格式化截止日期
function formatDueDate(timestamp: number | null): string {
  if (!timestamp) return '';
  const dueDate = new Date(timestamp);
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();

  if (diff < 0) {
    return '已过期';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) {
    return '今天';
  }
  if (days === 1) {
    return '明天';
  }
  if (days < 7) {
    return `${days}天后`;
  }
  return `${Math.floor(days / 7)}周后`;
}

// 判断是否过期
function isOverdue(timestamp: number | null): boolean {
  if (!timestamp) return false;
  const dueDate = new Date(timestamp);
  const now = new Date();
  return dueDate < now;
}

// 切换待办事项状态
async function toggleTodoStatus(memo: Memo): Promise<void> {
  isLoading.value = true;
  try {
    const newStatus = !memo.completed;
    const response = await toggleMemoStatus(memo.id, newStatus);
    
    if (response.data.code === 200 && response.data.data) {
      memo.completed = newStatus;
      message.success(`待办事项已${memo.completed ? '完成' : '恢复'}`);
    } else {
      message.error(`更新待办状态失败: ${response.data.msg}`);
    }
  } catch (error) {
    console.error('更新待办状态错误:', error);
    message.error('更新待办状态失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
}

// 查看备忘录详情
function viewMemo(memo: Memo): void {
  currentMemo.value = memo;
  showViewModal.value = true;
}

// 关闭查看模态框并刷新数据
function closeViewModal(): void {
  showViewModal.value = false;
  // 刷新数据
  fetchMemos();
  // 更新右侧边栏统计数据
  updateSidebarStatistics();
}

// 切换查看备忘录的待办事项状态
async function toggleViewTodoStatus(): Promise<void> {
  if (currentMemo.value) {
    isLoading.value = true;
    try {
      const newStatus = !currentMemo.value.completed;
      const response = await toggleMemoStatus(currentMemo.value.id, newStatus);
      
      if (response.data.code === 200 && response.data.data) {
        currentMemo.value.completed = newStatus;
        // 同时更新列表中的状态
        const memoInList = memos.value.find(m => m.id === currentMemo.value!.id);
        if (memoInList) {
          memoInList.completed = newStatus;
        }
        // 立即更新右侧边栏统计数据
        updateSidebarStatistics();
        message.success(`待办事项已${currentMemo.value.completed ? '完成' : '恢复'}`);
      } else {
        message.error(`更新待办状态失败: ${response.data.msg}`);
      }
    } catch (error) {
      console.error('更新待办状态错误:', error);
      message.error('更新待办状态失败，请稍后重试');
    } finally {
      isLoading.value = false;
    }
  }
}

// 编辑当前查看的备忘录
function editCurrentMemo(): void {
  if (currentMemo.value) {
    editMemo(currentMemo.value);
  }
}

// 获取标签图标
function getTagIcon(code: number): string {
  const icons: Record<number, string> = {
    0: 'fas fa-star',       // 所有
    1: 'fas fa-briefcase',  // 工作
    2: 'fas fa-book',       // 学习
    3: 'fas fa-heart',      // 生活
    4: 'fas fa-lightbulb',  // 其他
  };
  
  return icons[code] || 'fas fa-tag';
}

// 弹窗样式
const modalStyle = {
  width: '50vw',
  margin: '100px auto',
  height: '80vh',
  // display: 'flex',
  // flexDirection: 'column',
  // justifyContent: 'center',
  // alignItems: 'center',
  borderRadius: '20px',
  background: 'rgba(255,255,255,0.25)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  border: '1px solid rgba(255,255,255,0.2)',
  padding: '0',
  overflow: 'visible',
};

// 日期禁用函数
const isDateDisabled = (timestamp: number): boolean => {
  return timestamp < Date.now() - 86400000;
};

// 搜索处理函数
function handleSearch(): void {
  currentPage.value = 1; // 重置到第一页
  fetchMemos();
}

// 监听搜索框回车事件
function handleSearchKeyUp(e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    handleSearch();
  }
}

// 初始化
onMounted(() => {
  // 从API获取备忘录数据
  fetchMemos();
});

// 更新右侧边栏的统计数据
function updateSidebarStatistics() {
  // 获取MemoRightSidebar组件实例
  const sidebarComponent = document.querySelector('memo-right-sidebar');
  if (sidebarComponent) {
    // 获取组件实例并调用其刷新方法
    nextTick(() => {
      // 触发一个自定义事件通知右侧边栏更新数据
      const event = new CustomEvent('update-statistics', { detail: { memos: memos.value } });
      sidebarComponent.dispatchEvent(event);
    });
  }
}
</script>

<style scoped>
.memo-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  position: relative;
}

.memo-container {
  padding: 0 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 80px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 4px;
  padding: 24px 0 16px 0;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
  text-align: left;
}

.content-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.08);
  margin: 0;
}

/* 搜索框和标签样式 */
.search-and-tags {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-and-add {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 搜索框容器 */
.search-container {
  display: flex;
  flex-grow: 1;
}

/* 美化后的搜索框 */
.search-box {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 38px;
  border-radius: 8px;
  background: #f7f7f7;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.search-box:hover, .search-box:focus-within {
  background: #f0f0f0;
}

.search-input {
  width: 100%;
  height: 100%;
  padding: 0 16px 0 40px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 14px;
  color: #333;
}

.search-input:focus {
  outline: none;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 添加按钮 */
.add-button {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background-color: #3B82F6;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.2s ease;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
}

.add-button:hover {
  background-color: #2563EB;
  transform: translateY(-1px);
}

.add-button:active {
  transform: translateY(0);
}

/* 标签栏 */
.tags-container {
  margin-top: 16px;
  width: 100%;
  overflow-x: auto;
}

.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag {
  cursor: pointer;
  padding: 6px 14px;
  background: rgba(244, 244, 245, 0.8);
  color: #666;
  font-size: 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-weight: 500;
}

.tag i {
  font-size: 12px;
  opacity: 0.8;
}

.tag:hover {
  background: rgba(234, 234, 235, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
}

.tag.active {
  color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

/* 所有标签激活样式 */
.tag-0.active {
  background: linear-gradient(135deg, #5e72e4, #825ee4);
}

/* 工作标签激活样式 - 对应工作卡片渐变色 */
.tag-1.active {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

/* 学习标签激活样式 - 对应学习卡片渐变色 */
.tag-2.active {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

/* 生活标签激活样式 - 对应生活卡片渐变色 */
.tag-3.active {
  background: linear-gradient(135deg, #fa709a, #fee140);
}

/* 其他标签激活样式 - 对应其他卡片渐变色 */
.tag-4.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.tag.active i {
  opacity: 1;
}

/* 空备忘录状态 */
.empty-memos {
  text-align: center;
  padding: 60px 0;
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
}

/* 分组样式 */
.memo-group {
  margin-bottom: 40px;
}

/* 分组标题样式 */
.group-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 28px 0 20px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  position: relative;
}

.title-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.title-text {
  position: relative;
  letter-spacing: 0.5px;
}

.title-text::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  border-radius: 2px;
}

.title-decoration {
  flex: 1;
  height: 1px;
  margin-left: 15px;
  background: rgba(0, 0, 0, 0.06);
  position: relative;
}

.today-title .title-icon {
  background: linear-gradient(135deg, #ffd34e, #ff9b44);
  color: white;
}

.today-title .title-text {
  background: linear-gradient(to right, #ff9a44, #ff3d77);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.today-title .title-text::after {
  background: linear-gradient(to right, #ff9a44, #ff3d77);
}

.history-title .title-icon {
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
}

.history-title .title-text {
  background: linear-gradient(to right, #6e8efb, #a777e3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.history-title .title-text::after {
  background: linear-gradient(to right, #6e8efb, #a777e3);
}

.group-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 30px 0;
  position: relative;
}

.group-divider::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(to right, rgba(110, 142, 251, 0.4), rgba(167, 119, 227, 0.4));
}

/* 备忘录列表 */
.memo-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 4px 0;
}

.memo-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 220px;
  position: relative;
}

.memo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  z-index: 0;
}

.memo-card > * {
  position: relative;
  z-index: 1;
}

.memo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

/* 工作类别 - 蓝色渐变 */
.memo-card-1 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* 学习类别 - 绿色渐变 */
.memo-card-2 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* 生活类别 - 橙色渐变 */
.memo-card-3 {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

/* 其他类别 - 紫色渐变 */
.memo-card-4 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.todo-memo.memo-card::before {
  background: linear-gradient(135deg, rgba(239, 246, 255, 0.9) 0%, rgba(219, 234, 254, 0.7) 100%);
}

.completed-memo.memo-card::before {
  background: linear-gradient(135deg, rgba(240, 253, 244, 0.9) 0%, rgba(220, 252, 231, 0.7) 100%);
}

.memo-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.memo-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.memo-category {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.15);
  margin-left: 8px;
}

.memo-card-1 .memo-category {
  background: rgba(79, 172, 254, 0.4);
}

.memo-card-2 .memo-category {
  background: rgba(67, 233, 123, 0.4);
}

.memo-card-3 .memo-category {
  background: rgba(250, 112, 154, 0.4);
}

.memo-card-4 .memo-category {
  background: rgba(102, 126, 234, 0.4);
}

.memo-content {
  padding: 16px;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  flex-grow: 1;
}

.memo-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 12px;
  color: #666;
}

.memo-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.memo-actions {
  display: flex;
  gap: 12px;
}

.memo-actions i {
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
  font-size: 14px;
}

.memo-actions i:hover {
  opacity: 1;
}

.fa-edit:hover {
  color: #3B82F6;
}

.fa-trash-alt:hover {
  color: #EF4444;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .memo-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .group-title {
    font-size: 18px;
    margin: 20px 0 12px;
  }
}

@media (max-width: 480px) {
  .memo-list {
    grid-template-columns: 1fr;
  }
}

/* 新弹窗样式将在这里添加 */

/* 全新设计的弹窗样式 */
.memo-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 修改这里可以改变弹窗大小 */
.memo-modal .modal-container {
  position: relative;

  margin: 0 auto;
}

.memo-modal :deep(.n-modal) {
  width: auto !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.memo-modal :deep(.n-modal-body),
.memo-modal :deep(.n-modal-body-wrapper),
.memo-modal :deep(.n-card),
.memo-modal :deep(.n-card__content) {
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  width: 100% !important;
}

.memo-modal .modal-inner {
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.memo-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.memo-modal .modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.required {
  color: #f56c6c;
  margin-left: 2px;
  font-weight: bold;
}

.memo-modal .close-btn {
  margin-right: -8px;
  color: #999;
}

.memo-modal .modal-content {
  padding: 24px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.memo-modal .form-group {
  margin-bottom: 24px;
  text-align: left;
  width: 100%;
}

.memo-modal .form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  text-align: left;
}

.memo-modal .form-control {
  width: 100%;
}

.memo-modal .form-control :deep(.n-input),
.memo-modal .form-control :deep(.n-base-selection) {
  width: 100% !important;
}

.memo-modal .modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px 20px;
  border-top: 1px solid #f0f0f0;
  gap: 12px;
}



.memo-modal .cancel-button {
  min-width: 80px;
  color: #333 !important;
}

.memo-modal .save-button {
  min-width: 80px;
  background-color: #333 !important;
  border-color: #333 !important;
}

.memo-modal .save-button:hover {
  background-color: #555 !important;
  border-color: #555 !important;
}

.memo-modal .danger-button {
  background-color: #f56c6c !important;
  border-color: #f56c6c !important;
}

.memo-modal .danger-button:hover {
  background-color: #e64242 !important;
  border-color: #e64242 !important;
}

/* 查看备忘录样式 */
.memo-modal .view-tag {
  background: #f3f4f6;
  color: #4b5563;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 12px;
}

.memo-view-meta-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.memo-modal .todo-status-view {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.memo-modal .todo-status-view.completed {
  background: rgba(16, 185, 129, 0.05);
}

.memo-modal .todo-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.memo-modal .todo-status-view.completed .todo-checkbox {
  background: #10B981;
  border-color: #10B981;
}

.memo-modal .memo-view-content {
  padding: 0;
  background: #f9fafb;
  border-radius: 12px;
  min-height: 200px; /* 减小最小高度 */
  max-height: 400px; /* 减小最大高度 */
  overflow-y: auto;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px; /* 添加下边距，与下方的待办状态区域分开 */
}

.memo-modal .memo-view-meta {
  font-size: 13px;
  color: #6b7280;
}

/* 简单的内容预览样式 */
.content-preview {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
  white-space: pre-wrap;
  word-break: break-word;
  padding: 20px;
  margin: 0;
  background: transparent;
  border: none;
}

.content-preview code {
  background-color: #f6f8fa;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 85%;
}

.content-preview pre code {
  display: block;
  padding: 16px;
  overflow-x: auto;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
  margin: 12px 0;
}

/* 编辑弹窗特有样式 */
.memo-modal .category-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.memo-modal .category-option {
  background: #f9fafb;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.memo-modal .category-option:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.memo-modal .category-option.active {
  background: #ebf5ff;
  border-color: #93c5fd;
  color: #2563eb;
}

.memo-modal .todo-switch {
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.memo-modal .todo-switch .form-label {
  margin-bottom: 0;
  flex: 1;
  margin-right: 80px; /* 让开关不要太靠右 */
}

.memo-modal .due-date-group {
  margin-top: 16px;
  width: 100%;
}

.memo-modal .due-date-picker {
  width: 100%;
}

/* 为markdown编辑器应用自定义样式 */
.memo-modal .markdown-editor {
  border-radius: 12px;
  overflow: hidden;
}

/* 隐藏预览功能 */
.memo-modal :deep(.v-md-editor .v-md-editor__preview) {
  display: none !important;
}

/* 强化编辑区域 */
.memo-modal :deep(.v-md-editor .v-md-editor__editor) {
  width: 100% !important;
  flex: 1 1 auto !important;
  border-right: none !important;
}

.memo-modal :deep(.v-md-editor) {
  border-radius: 12px !important;
  overflow: hidden;
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
  box-shadow: none !important;
}

.memo-modal :deep(.v-md-editor .v-md-editor__toolbar) {
  border-bottom: 1px solid #e5e7eb !important;
  background: #f9fafb !important;
  padding: 8px !important;
}

.memo-modal :deep(.v-md-editor .v-md-editor__edit-content) {
  background: #ffffff !important;
  color: #4b5563 !important;
  padding: 16px !important;
  font-size: 15px !important;
}

/* 强制设置弹窗内容宽度 */
.memo-modal :deep(.n-modal-body-wrapper) {
  width: 70vw !important;
  max-width: 800px !important;
}

.memo-modal .modal-container {
  width: 100% !important;
}

.memo-modal :deep(.n-modal-body) {
  width: 100% !important;
}

/* 强制设置markdown编辑器宽度 */
.memo-modal :deep(.md-editor) {
  width: 100% !important;
}

/* 删除弹窗样式 */
.memo-modal .delete-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.memo-modal .delete-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.memo-modal .delete-message {
  text-align: center;
  font-size: 16px;
  line-height: 1.6;
  color: #4b5563;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .memo-modal .modal-container {
    width: 90vw;
    max-width: 90vw;
  }
  
  .memo-modal .modal-inner {
    padding: 20px;
  }
  
  .memo-modal .category-selector {
    flex-wrap: wrap;
  }
  
  .memo-modal .category-option {
    flex: 1 0 45%;
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .memo-modal .modal-container {
    width: 95vw;
    max-width: 95vw;
  }
  
  .memo-modal .modal-inner {
    padding: 16px;
  }
  
  .memo-modal .modal-footer {
    flex-direction: column;
    gap: 12px;
  }
  
  .memo-modal .cancel-button,
  .memo-modal .save-button {
    width: 100%;
    padding: 12px;
  }
}

/* 修改markdown编辑器的样式 */
.form-control.markdown-editor {
  height: auto;
  border-radius: 8px;
  overflow: hidden;
  border: none;
}

:deep(.bytemd) {
  height: 350px !important;
  border-radius: 8px !important;
  border: 1px solid #e5e7eb !important;
}

:deep(.bytemd-toolbar) {
  background-color: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
}

:deep(.bytemd-status) {
  background-color: #f9fafb !important;
  border-top: 1px solid #e5e7eb !important;
}

/* ByteMD 预览样式 */
.memo-view-content {
  padding: 0;
  background: #f9fafb;
  border-radius: 12px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

:deep(.markdown-body) {
  padding: 20px !important;
  background-color: transparent !important;
}

:deep(.markdown-body pre) {
  background-color: #f6f8fa !important;
  padding: 16px !important;
  border-radius: 8px !important;
}

:deep(.markdown-body code) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
}

/* 强制设置markdown编辑器宽度 */
:deep(.md-editor) {
  width: 100% !important;
}
</style> 