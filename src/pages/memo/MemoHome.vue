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
          <div v-else class="memo-list">
            <div 
              v-for="memo in filteredMemos" 
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
        </n-spin>
      </div>
      
      <template #rightSidebar>
        <MemoRightSidebar 
          :memos="memos"
          @add-memo="addMemo"
        />
      </template>
    </PageLayout>
    
    <!-- 查看备忘录详情模态框 -->
    <n-modal v-model:show="showViewModal" class="memo-modal">
      <div class="modal-inner">
        <div class="modal-header">
          <div class="modal-title">
            <div v-if="currentMemo" class="view-tag">
              <i :class="getTagIcon(currentMemo.tagCode)"></i> {{ currentMemo ? getTagName(currentMemo.tagCode) : '' }}
            </div>
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
        
        <div class="modal-content view-content">
          <div v-if="currentMemo && currentMemo.isTodo" class="todo-status-view" :class="{'completed': currentMemo.completed}">
            <div class="todo-checkbox large" @click="toggleViewTodoStatus">
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
          
          <div class="memo-view-content">{{ currentMemo ? currentMemo.content : '' }}</div>
          
          <div class="memo-view-meta">
            <div>创建于: {{ currentMemo ? formatFullDate(currentMemo.createdAt) : '' }}</div>
          </div>
        </div>
        
        <div class="modal-footer">
          <n-button class="edit-view-button" @click="editCurrentMemo">编辑</n-button>
          <n-button type="primary" @click="showViewModal = false">关闭</n-button>
        </div>
      </div>
    </n-modal>
    
    <!-- 编辑备忘录模态框 -->
    <n-modal v-model:show="showEditModal" :mask-closable="false" class="memo-modal">
      <div class="modal-inner">
        <div class="modal-header edit-modal-header">
          <div class="modal-title">{{ isEditing ? '编辑备忘录' : '添加备忘录' }}</div>
          <n-button quaternary circle class="close-btn" @click="cancelEdit">
            <n-icon>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </n-icon>
          </n-button>
        </div>
        
        <div class="modal-content edit-modal-content">
          <div class="form-group">
            <label class="form-label">标题</label>
            <n-input 
              v-model:value="memoForm.title" 
              placeholder="输入标题"
              class="form-control" 
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">内容</label>
            <n-input 
              v-model:value="memoForm.content" 
              placeholder="输入内容"
              type="textarea" 
              :autosize="{ minRows: 4, maxRows: 8 }" 
              class="form-control" 
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">分类</label>
            <n-select 
              v-model:value="memoForm.tagCode" 
              :options="tagOptions" 
              placeholder="选择分类"
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <div class="todo-switch-container">
              <label class="form-label">是否是待办事项</label>
              <n-switch v-model:value="memoForm.isTodo" />
            </div>
          </div>
          
          <div class="form-group" v-if="memoForm.isTodo">
            <label class="form-label">截止日期</label>
            <n-date-picker 
              v-model:value="memoForm.dueDate"
              type="date"
              clearable
              class="form-control"
            />
          </div>
        </div>
        
        <div class="modal-footer edit-modal-footer">
          <n-button class="cancel-button" @click="cancelEdit">取消</n-button>
          <n-button type="primary" class="save-button" @click="saveMemo">保存</n-button>
        </div>
      </div>
    </n-modal>
    
    <!-- 删除确认对话框 -->
    <n-modal v-model:show="showDeleteModal" preset="dialog" title="确认删除" content="确定要删除这条备忘录吗？此操作无法撤销。" positive-text="删除" negative-text="取消" @positive-click="deleteMemoHandler" @negative-click="showDeleteModal = false" />
    
    <!-- 消息提示 -->
    <n-message-provider placement="top-right">
      <message-consumer ref="messageRef" />
    </n-message-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, h } from 'vue'
import { NTag, NButton, NModal, NInput, NSelect, NSpace, NMessageProvider, useMessage, NSpin, NIcon, NSwitch, NDatePicker } from 'naive-ui'
import PageLayout from '@/components/layout/PageLayout.vue'
import MemoRightSidebar from '@/components/layout/MemoRightSidebar.vue'

// 创建全局message实例
const message = useMessage();

// 备忘录接口
interface Memo {
  id: number;
  title: string;
  content: string;
  tagCode: number;
  createdAt: number;
  isTodo: boolean;
  dueDate?: number | null;
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

// 备忘录数据 - 模拟数据，实际项目中应该从API获取
const memos = ref<Memo[]>([
  {
    id: 1,
    title: '完成Vue项目开发',
    content: '需要实现备忘录功能，包括添加、编辑和删除备忘录等功能。',
    tagCode: 1,
    createdAt: Date.now() - 3600000,
    isTodo: true,
    dueDate: Date.now() + 86400000,
    completed: false
  },
  {
    id: 2,
    title: '学习TypeScript高级特性',
    content: '学习泛型、类型推断、类型守卫等高级特性，提升代码类型安全性。',
    tagCode: 2,
    createdAt: Date.now() - 86400000,
    isTodo: false,
    completed: false
  },
  {
    id: 3,
    title: '购物清单',
    content: '牛奶、面包、鸡蛋、蔬菜、水果',
    tagCode: 3,
    createdAt: Date.now() - 172800000,
    isTodo: true,
    dueDate: Date.now() + 172800000,
    completed: true
  },
  {
    id: 4,
    title: '阅读《设计模式》',
    content: '学习常用设计模式，包括单例模式、工厂模式、观察者模式等',
    tagCode: 2,
    createdAt: Date.now() - 259200000,
    isTodo: false,
    completed: false
  },
  {
    id: 5,
    title: '每周健身计划',
    content: '周一：上肢\n周三：下肢\n周五：核心\n周日：有氧',
    tagCode: 3,
    createdAt: Date.now() - 432000000,
    isTodo: true,
    dueDate: Date.now() + 259200000,
    completed: false
  }
]);

// 本地过滤备忘录列表 - 使用计算属性实现实时过滤
const filteredMemos = computed(() => {
  // 1. 先根据搜索词过滤
  const searchFiltered = searchQuery.value
    ? memos.value.filter(memo => 
        memo.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        memo.content.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    : memos.value;
  
  // 2. 再根据标签过滤
  const tagFiltered = activeTagCode.value === 0
    ? searchFiltered
    : searchFiltered.filter(memo => memo.tagCode === activeTagCode.value);
  
  // 3. 按创建时间排序
  return tagFiltered.sort((a, b) => b.createdAt - a.createdAt);
});

// 设置活动标签
function setActiveTag(code: number): void {
  activeTagCode.value = code;
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
  memoForm.id = memo.id;
  memoForm.title = memo.title;
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
function deleteMemoHandler(): void {
  if (currentMemo.value) {
    // 实际项目中应该调用API删除
    memos.value = memos.value.filter(m => m.id !== currentMemo.value!.id);
    message.success('备忘录已删除');
    showDeleteModal.value = false;
    showViewModal.value = false; // 如果正在查看，也关闭查看模态框
  }
}

// 添加新备忘录的入口函数
function addNewMemo(): void {
  isEditing.value = false;
  resetForm();
  showEditModal.value = true;
}

// 从侧边栏接收新备忘录
function addMemo(newMemo: Omit<Memo, 'id' | 'createdAt'>): void {
  // 实际项目中应该调用API添加
  const memo: Memo = {
    ...newMemo,
    id: Math.max(0, ...memos.value.map(m => m.id)) + 1,
    createdAt: Date.now(),
  };
  
  memos.value.unshift(memo);
  message.success('备忘录已添加');
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
function saveMemo(): void {
  // 表单验证
  if (!memoForm.title) {
    message.error('请填写标题');
    return;
  }
  
  if (isEditing.value && currentMemo.value) {
    // 更新备忘录
    const index = memos.value.findIndex(m => m.id === memoForm.id);
    if (index !== -1) {
      memos.value[index] = {
        ...memos.value[index],
        title: memoForm.title,
        content: memoForm.content,
        tagCode: memoForm.tagCode,
        isTodo: memoForm.isTodo,
        dueDate: memoForm.dueDate,
        completed: memoForm.completed
      };
      message.success('备忘录已更新');
    }
  } else {
    // 添加新备忘录
    const memo: Memo = {
      id: Math.max(0, ...memos.value.map(m => m.id)) + 1,
      title: memoForm.title,
      content: memoForm.content,
      tagCode: memoForm.tagCode,
      createdAt: Date.now(),
      isTodo: memoForm.isTodo,
      dueDate: memoForm.dueDate,
      completed: false
    };
    
    memos.value.unshift(memo);
    message.success('备忘录已添加');
  }
  
  showEditModal.value = false;
  resetForm();
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
function toggleTodoStatus(memo: Memo): void {
  memo.completed = !memo.completed;
  message.success(`待办事项已${memo.completed ? '完成' : '恢复'}`);
}

// 查看备忘录详情
function viewMemo(memo: Memo): void {
  currentMemo.value = memo;
  showViewModal.value = true;
}

// 切换查看备忘录的待办事项状态
function toggleViewTodoStatus(): void {
  if (currentMemo.value) {
    currentMemo.value.completed = !currentMemo.value.completed;
    message.success(`待办事项已${currentMemo.value.completed ? '完成' : '恢复'}`);
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

// 初始化
onMounted(() => {
  // 实际项目中应该从API获取备忘录数据
});
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

/* 备忘录列表 */
.memo-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 16px 4px;
  min-height: 50vh;
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
}

@media (max-width: 480px) {
  .memo-list {
    grid-template-columns: 1fr;
  }
}
</style> 