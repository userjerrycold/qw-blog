<template>
  <aside class="sidebar-container">
    <!-- 待办事项统计 -->
    <div class="sidebar-section">
      <h3 class="section-title">待办事项</h3>
      <div class="todo-stats">
        <div class="todo-stat-card">
          <div class="todo-stat-number">{{ todayTodoCount }}</div>
          <div class="todo-stat-label">今日待办</div>
          <div v-if="todayTodoCount > 0" class="todo-stat-badge"></div>
        </div>
        <div class="todo-stat-card">
          <div class="todo-stat-number">{{ allTodoCount }}</div>
          <div class="todo-stat-label">所有待办</div>
          <div v-if="allTodoCount > 0" class="todo-stat-badge"></div>
        </div>
        <div class="todo-stat-card">
          <div class="todo-stat-number">{{ completedCount }}</div>
          <div class="todo-stat-label">已完成</div>
        </div>
      </div>
    </div>
    
    <!-- 备忘录分类统计 -->
    <div class="sidebar-section">
      <h3 class="section-title">分类统计</h3>
      <div class="tag-stats">
        <div class="tag-stat-item" v-for="(tag, index) in memoTags" :key="index">
          <div class="tag-stat-info">
            <span class="tag-stat-indicator" :style="{ backgroundColor: getTagColor(tag.code).color }"></span>
            <span class="tag-stat-name">{{ tag.name }}</span>
          </div>
          <span class="tag-stat-count">{{ getTagCount(tag.code) }}</span>
        </div>
      </div>
    </div>
    
    <!-- 最近添加 -->
    <div class="sidebar-section">
      <h3 class="section-title">最近添加</h3>
      <div class="recent-memos">
        <div v-if="recentMemos.length === 0" class="empty-recent">
          暂无备忘录
        </div>
        <div 
          v-for="memo in recentMemos" 
          :key="memo.id" 
          class="recent-memo-card"
        >
          <div class="memo-icon" :style="{ backgroundColor: getTagColor(memo.tagCode).color }">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="white"/>
            </svg>
          </div>
          <div class="memo-content">
            <h4 class="memo-title">{{ memo.title }}</h4>
            <div class="memo-meta-row">
              <span class="memo-tag-small" :style="{ backgroundColor: getTagColor(memo.tagCode).color, color: '#fff' }">
                {{ getTagName(memo.tagCode) }}
              </span>
              <span class="memo-date">{{ formatDate(memo.createdAt) }}</span>
            </div>
            <div v-if="memo.isTodo" class="memo-todo-status" :class="{ 'completed': memo.completed }">
              {{ memo.completed ? '已完成' : '待办' }}
              <span v-if="!memo.completed && isDueToday(memo.dueDate)" class="due-today">今日到期</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits, withDefaults } from 'vue';

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

interface TagType {
  code: number;
  name: string;
}

const props = withDefaults(defineProps<{
  memos: Memo[]
}>(), {
  memos: () => []
});

const emit = defineEmits<{
  (e: 'add-memo', memo: Omit<Memo, 'id' | 'createdAt'>): void;
}>();

// 备忘录类型枚举
const MemoTypeEnum: Record<string, TagType> = {
  WORK: { code: 1, name: '工作' },
  STUDY: { code: 2, name: '学习' },
  LIFE: { code: 3, name: '生活' },
  OTHER: { code: 4, name: '其他' },
};

// 所有标签
const memoTags: TagType[] = [
  MemoTypeEnum.WORK,
  MemoTypeEnum.STUDY,
  MemoTypeEnum.LIFE,
  MemoTypeEnum.OTHER
];

// 最近添加的备忘录
const recentMemos = computed(() => {
  return [...props.memos]
    .sort((a: Memo, b: Memo) => b.createdAt - a.createdAt)
    .slice(0, 3); // 显示最近添加的3条
});

// 待办事项统计
const allTodoCount = computed(() => {
  return props.memos.filter(memo => memo.isTodo && !memo.completed).length;
});

const todayTodoCount = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  const tomorrow = new Date(todayTimestamp + 24 * 60 * 60 * 1000).getTime();
  
  return props.memos.filter(memo => 
    memo.isTodo && 
    !memo.completed && 
    memo.dueDate && 
    memo.dueDate >= todayTimestamp && 
    memo.dueDate < tomorrow
  ).length;
});

const completedCount = computed(() => {
  return props.memos.filter(memo => memo.isTodo && memo.completed).length;
});

// 获取标签名称
function getTagName(code: number): string {
  const tag = Object.values(MemoTypeEnum).find(t => t.code === code);
  return tag ? tag.name : 'Unknown';
}

// 获取标签数量
function getTagCount(code: number): number {
  return props.memos.filter(memo => memo.tagCode === code).length;
}

// 获取标签颜色
function getTagColor(code: number): { color: string, textColor: string } {
  const colors: Record<number, { color: string, textColor: string }> = {
    1: { color: '#3B82F6', textColor: '#ffffff' }, // 工作
    2: { color: '#10B981', textColor: '#ffffff' }, // 学习
    3: { color: '#F59E0B', textColor: '#ffffff' }, // 生活
    4: { color: '#8B5CF6', textColor: '#ffffff' }, // 其他
  };
  
  return colors[code] || colors[4];
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

// 检查是否今日到期
function isDueToday(dueDate?: number | null): boolean {
  if (!dueDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  const tomorrow = new Date(todayTimestamp + 24 * 60 * 60 * 1000).getTime();
  
  return dueDate >= todayTimestamp && dueDate < tomorrow;
}
</script>

<script lang="ts">
export default {
  name: 'MemoRightSidebar'
}
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 20px 16px 20px 0;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-bottom: 60px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar-container::-webkit-scrollbar {
  display: none;
}

.sidebar-section {
  background: transparent;
  backdrop-filter: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  border: none;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 24px;
  height: 2px;
  background-color: #333;
  border-radius: 2px;
}

/* 待办事项统计样式 */
.todo-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.todo-stat-card {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.03),
    0 1px 3px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.todo-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 16px rgba(0, 0, 0, 0.06),
    0 2px 5px rgba(0, 0, 0, 0.03),
    inset 0 1px 1px rgba(255, 255, 255, 0.5);
}

.todo-stat-number {
  font-size: 22px;
  font-weight: 700;
  color: #333;
}

.todo-stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 6px;
}

.todo-stat-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  background-color: #f56c6c;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 标签统计样式 */
.tag-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.03),
    0 1px 3px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.tag-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.tag-stat-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-stat-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.tag-stat-name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.tag-stat-count {
  font-size: 13px;
  font-weight: 600;
  color: #555;
  background-color: rgba(0, 0, 0, 0.05);
  height: 24px;
  min-width: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

/* 最近添加样式 */
.recent-memos {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-recent {
  text-align: center;
  padding: 24px 0;
  color: #888;
  font-size: 13px;
  font-style: italic;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.03),
    0 1px 3px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.recent-memo-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.03),
    0 1px 3px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.recent-memo-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.04),
    inset 0 1px 1px rgba(255, 255, 255, 0.5);
}

.memo-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.memo-content {
  flex: 1;
  min-width: 0;
}

.memo-title {
  margin: 0 0 6px 0;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
}

.memo-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.memo-tag-small {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.memo-date {
  font-size: 10px;
  color: #666;
}

.memo-todo-status {
  margin-top: 4px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f56c6c;
}

.memo-todo-status.completed {
  color: #67c23a;
}

.due-today {
  background-color: #fef0f0;
  color: #f56c6c;
  padding: 1px 4px;
  border-radius: 4px;
  font-size: 10px;
}
</style> 