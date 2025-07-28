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
    
    <!-- 待办事项进度 -->
    <div class="sidebar-section">
      <h3 class="section-title">完成进度</h3>
      <div class="progress-container">
        <div class="progress-stats">
          <div class="progress-percentage">{{ completionPercentage }}%</div>
          <div class="progress-label">已完成</div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: `${completionPercentage}%` }"></div>
        </div>
        <div class="progress-details">
          <div class="progress-item">
            <div class="progress-item-label">已完成</div>
            <div class="progress-item-value">{{ completedCount }}</div>
          </div>
          <div class="progress-item">
            <div class="progress-item-label">总待办</div>
            <div class="progress-item-value">{{ totalTodoCount }}</div>
          </div>
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
          <div class="tag-stat-bar-container">
            <div class="tag-stat-bar" :style="{ width: `${getTagPercentage(tag.code)}%`, backgroundColor: getTagColor(tag.code).color }"></div>
          </div>
          <span class="tag-stat-count">{{ getTagCount(tag.code) }}</span>
        </div>
      </div>
    </div>
    
    <!-- 简易日历视图 -->
    <div class="sidebar-section">
      <h3 class="section-title">待办日历</h3>
      <div class="calendar-container">
        <div class="calendar-header">
          <button class="calendar-nav-btn" @click="previousMonth">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="calendar-title">{{ currentMonthYear }}</div>
          <button class="calendar-nav-btn" @click="nextMonth">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div class="calendar-weekdays">
          <div class="calendar-weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
        </div>
        <div class="calendar-days">
          <div 
            v-for="day in calendarDays" 
            :key="day.date"
            class="calendar-day"
            :class="{
              'other-month': !day.isCurrentMonth,
              'today': day.isToday,
              'has-todos': day.hasTodos
            }"
          >
            <div class="calendar-day-number">{{ day.dayNumber }}</div>
            <div v-if="day.hasTodos" class="calendar-day-indicator"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 快速添加备忘录 -->
    <div class="sidebar-section">
      <h3 class="section-title">快速添加</h3>
      <div class="quick-add-container">
        <input 
          v-model="quickAddTitle" 
          type="text" 
          class="quick-add-input" 
          placeholder="输入标题..." 
          @keyup.enter="quickAddMemo"
        />
        <button class="quick-add-button" @click="quickAddMemo">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits, withDefaults, ref } from 'vue';

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

interface CalendarDay {
  date: number;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasTodos: boolean;
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

const totalTodoCount = computed(() => {
  return props.memos.filter(memo => memo.isTodo).length;
});

const completionPercentage = computed(() => {
  if (totalTodoCount.value === 0) return 0;
  return Math.round((completedCount.value / totalTodoCount.value) * 100);
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

// 获取标签百分比
function getTagPercentage(code: number): number {
  if (props.memos.length === 0) return 0;
  return Math.round((getTagCount(code) / props.memos.length) * 100);
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

// 日历功能
const currentDate = ref(new Date());
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long'
  });
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // 当月第一天
  const firstDayOfMonth = new Date(year, month, 1);
  // 当月最后一天
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // 上个月需要显示的天数
  const daysFromPrevMonth = firstDayOfMonth.getDay();
  
  // 日历开始日期（可能是上个月的某一天）
  const startDate = new Date(year, month, 1 - daysFromPrevMonth);
  
  // 创建42天的日历（6周）
  const days: CalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const dateTimestamp = date.getTime();
    const nextDayTimestamp = dateTimestamp + 24 * 60 * 60 * 1000;
    
    // 检查这一天是否有待办事项
    const hasTodos = props.memos.some(memo => 
      memo.isTodo && 
      memo.dueDate && 
      memo.dueDate >= dateTimestamp && 
      memo.dueDate < nextDayTimestamp
    );
    
    days.push({
      date: dateTimestamp,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: date.getTime() === todayTimestamp,
      hasTodos
    });
  }
  
  return days;
});

function previousMonth() {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
}

function nextMonth() {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
}

// 快速添加备忘录
const quickAddTitle = ref('');

function quickAddMemo() {
  if (!quickAddTitle.value.trim()) return;
  
  const newMemo = {
    title: quickAddTitle.value.trim(),
    content: '',
    tagCode: 1, // 默认工作分类
    isTodo: true, // 默认为待办事项
    dueDate: null,
    completed: false
  };
  
  emit('add-memo', newMemo);
  quickAddTitle.value = '';
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
  padding: 20px 16px 300px 0; /* 大幅增加底部内边距，确保可以滚动到底部 */
  height: auto;
  min-height: 100%;
  overflow-x: hidden; /* 防止水平滚动 */
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
  max-height: none !important;
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
  max-width: 100%; /* 限制最大宽度 */
  box-sizing: border-box;
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

/* 进度条样式 */
.progress-container {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.03),
    0 1px 3px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.progress-stats {
  text-align: center;
  margin-bottom: 16px;
}

.progress-percentage {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.progress-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.progress-bar-container {
  height: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3B82F6, #10B981);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-details {
  display: flex;
  justify-content: space-between;
}

.progress-item {
  text-align: center;
}

.progress-item-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.progress-item-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* 标签统计样式 */
.tag-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.03),
    0 1px 3px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.tag-stat-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tag-stat-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.tag-stat-bar-container {
  height: 6px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  overflow: hidden;
  flex-grow: 1;
  margin: 0 8px;
}

.tag-stat-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
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

/* 日历样式 */
.calendar-container {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.03),
    0 1px 3px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden; /* 防止日历内容溢出 */
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.calendar-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.calendar-nav-btn {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background-color: rgba(0, 0, 0, 0.05);
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.calendar-nav-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #333;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}

.calendar-weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  padding: 4px 0;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.calendar-day:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.calendar-day-number {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.calendar-day.other-month .calendar-day-number {
  color: #aaa;
}

.calendar-day.today {
  background-color: rgba(59, 130, 246, 0.1);
}

.calendar-day.today .calendar-day-number {
  color: #3B82F6;
  font-weight: 700;
}

.calendar-day-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #f56c6c;
  margin-top: 2px;
}

/* 快速添加样式 */
.quick-add-container {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.quick-add-input {
  flex-grow: 1;
  height: 38px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0 12px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: all 0.2s ease;
}

.quick-add-input:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.quick-add-button {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: none;
  background-color: #3B82F6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.quick-add-button:hover {
  background-color: #2563EB;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(59, 130, 246, 0.4);
}
</style> 