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
          
          <div class="modal-content">
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
            
            <div class="memo-view-content">{{ currentMemo ? currentMemo.content : '' }}</div>
            
            <div class="memo-view-meta">
              <div>创建于: {{ currentMemo ? formatFullDate(currentMemo.createdAt) : '' }}</div>
            </div>
          </div>
          
          <div class="modal-footer">
            <n-button class="cancel-button" @click="editCurrentMemo">编辑</n-button>
            <n-button type="primary" class="save-button" @click="showViewModal = false">关闭</n-button>
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
                v-model="memoForm.title" 
                placeholder="输入标题"
                class="form-control" 
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">内容</label>
              <v-md-editor
                v-model="memoForm.content"
                height="220px"
                :toolbar="customToolbar"
                :disabled-menus="[]"
                mode="edit"
                class="form-control markdown-editor"
                placeholder="输入内容..."
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
                <n-switch v-model="memoForm.isTodo" />
              </div>
              <div v-if="memoForm.isTodo" class="due-date-group">
                <label class="form-label">截止日期</label>
                <n-date-picker
                  v-model="memoForm.dueDate"
                  type="date"
                  clearable
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
import { ref, computed, reactive, onMounted, h } from 'vue'
import { NTag, NButton, NModal, NInput, NSelect, NSpace, NMessageProvider, useMessage, NSpin, NIcon, NSwitch, NDatePicker } from 'naive-ui'
import PageLayout from '@/components/layout/PageLayout.vue'
import MemoRightSidebar from '@/components/layout/MemoRightSidebar.vue'
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// import createToolbar from '@kangc/v-md-editor/lib/plugins/toolbar/index';
// import '@kangc/v-md-editor/lib/plugins/toolbar/toolbar.css';

VMdEditor.use(githubTheme);
// VMdEditor.use(createToolbar());

// 自定义极简工具栏
const customToolbar = [
  'bold', 'italic', '|',
  'unorderedList', 'orderedList', '|',
  'undo', 'redo'
];

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
    content: '需要实现备忘录功能，包括添加、编辑和删除备忘录等功能。实现标签筛选、搜索和按日期排序等高级功能。',
    tagCode: 1,
    createdAt: Date.now(), // 今天
    isTodo: true,
    dueDate: Date.now() + 86400000,
    completed: false
  },
  {
    id: 2,
    title: '学习TypeScript高级特性',
    content: '学习泛型、类型推断、类型守卫等高级特性，提升代码类型安全性。阅读官方文档并完成相关练习。',
    tagCode: 2,
    createdAt: Date.now() - 1800000, // 今天，半小时前
    isTodo: false,
    completed: false
  },
  {
    id: 3,
    title: '购物清单',
    content: '牛奶、面包、鸡蛋、蔬菜、水果、咖啡豆、洗衣液、牙膏、洗发水',
    tagCode: 3,
    createdAt: Date.now() - 172800000, // 2天前
    isTodo: true,
    dueDate: Date.now() + 172800000,
    completed: true
  },
  {
    id: 4,
    title: '阅读《设计模式》',
    content: '学习常用设计模式，包括单例模式、工厂模式、观察者模式等。注重理解每种模式的适用场景和实现方式。',
    tagCode: 2,
    createdAt: Date.now() - 259200000, // 3天前
    isTodo: false,
    completed: false
  },
  {
    id: 5,
    title: '每周健身计划',
    content: '周一：上肢\n周三：下肢\n周五：核心\n周日：有氧',
    tagCode: 3,
    createdAt: Date.now() - 432000000, // 5天前
    isTodo: true,
    dueDate: Date.now() + 259200000,
    completed: false
  },
  {
    id: 6,
    title: '新产品创意brainstorm',
    content: '针对年轻用户群体，设计一款更加用户友好的社交应用，关注隐私保护和个性化推荐。考虑AR/VR集成的可能性。',
    tagCode: 1,
    createdAt: Date.now(), // 今天
    isTodo: false,
    completed: false
  },
  {
    id: 7,
    title: 'React vs Vue对比分析',
    content: '比较两个框架的优缺点、生态系统、性能和开发体验。整理成技术博客分享给团队成员。重点关注Hooks和Composition API。',
    tagCode: 2,
    createdAt: Date.now() - 86400000, // 1天前
    isTodo: false,
    completed: false
  },
  {
    id: 8,
    title: '旅行计划 - 日本',
    content: '研究东京、京都、大阪的景点和美食。预订机票和住宿。准备行程安排和预算规划。了解当地文化和礼仪。',
    tagCode: 3,
    createdAt: Date.now() - 345600000, // 4天前
    isTodo: true,
    dueDate: Date.now() + 2592000000, // 30天后
    completed: false
  },
  {
    id: 9,
    title: '团队会议安排',
    content: '讨论项目进度、资源分配和下一阶段计划。解决团队成员遇到的技术问题。准备演示材料。',
    tagCode: 1,
    createdAt: Date.now(), // 今天
    isTodo: true,
    dueDate: Date.now() + 86400000, // 明天
    completed: false
  },
  {
    id: 10,
    title: '学习Docker容器化',
    content: '掌握Docker基础概念、镜像构建和容器编排。尝试将现有项目容器化并部署到云服务。',
    tagCode: 2,
    createdAt: Date.now() - 518400000, // 6天前
    isTodo: true,
    dueDate: Date.now() + 604800000, // 7天后
    completed: false
  },
  {
    id: 11,
    title: '家庭聚会准备',
    content: '准备食物和饮料、装饰房间、制作播放列表、规划活动和游戏。联系家人确认时间。',
    tagCode: 3,
    createdAt: Date.now() - 1800000, // 今天，半小时前
    isTodo: true,
    dueDate: Date.now() + 432000000, // 5天后
    completed: false
  },
  {
    id: 12,
    title: '创业点子记录',
    content: '在线教育平台、健康追踪应用、远程工作协作工具、可持续发展产品。分析市场需求和竞争情况。',
    tagCode: 4,
    createdAt: Date.now() - 691200000, // 8天前
    isTodo: false,
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
  margin-bottom: 4px;
}

.memo-modal .todo-status-view {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 0;
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
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.8;
  color: #4b5563;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  white-space: pre-wrap;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.memo-modal .memo-view-meta {
  font-size: 13px;
  color: #6b7280;
  margin-top: 16px;
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
.memo-modal :deep(.v-md-editor) {
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
</style> 