<template>
  <aside class="recipe-sidebar">
    <!-- 快速操作区域 -->
    <div class="sidebar-section">
      <h3 class="section-title">快速操作</h3>
      <div class="quick-actions">
        <button class="quick-btn add-btn" @click="handleAddRecipe">
          <i class="fas fa-plus-circle"></i>
          快速添加
        </button>
        
        <button class="quick-btn random-btn" @click="handleRandomPick">
          <i class="fas fa-dice"></i>
          随机菜单
        </button>
      </div>
    </div>

    <!-- 菜谱统计 -->
    <div class="sidebar-section">
      <h3 class="section-title">统计信息</h3>
      <div class="recipe-stats">
        <div class="recipe-stat-card">
          <div class="recipe-stat-number">{{ totalRecipes }}</div>
          <div class="recipe-stat-label">总菜谱</div>
        </div>
        <div class="recipe-stat-card">
          <div class="recipe-stat-number">{{ categoriesCount }}</div>
          <div class="recipe-stat-label">分类数</div>
        </div>
        <div class="recipe-stat-card">
          <div class="recipe-stat-number">{{ totalViews }}</div>
          <div class="recipe-stat-label">总浏览</div>
        </div>
      </div>
    </div>

    <!-- 分类统计 -->
    <div class="sidebar-section">
      <h3 class="section-title">分类分布</h3>
      <div class="category-stats">
        <div 
          v-for="category in categories.filter(c => c.code !== 0)" 
          :key="category.code" 
          class="category-stat-item"
        >
          <div class="category-stat-info">
            <span class="category-stat-indicator" :style="{ backgroundColor: getCategoryColor(category.code) }"></span>
            <span class="category-stat-name">{{ category.name }}</span>
          </div>
          <div class="category-stat-bar-container">
            <div 
              class="category-stat-bar" 
              :style="{ 
                width: `${getCategoryPercentage(category.code)}%`, 
                backgroundColor: getCategoryColor(category.code) 
              }"
            ></div>
          </div>
          <span class="category-stat-count">{{ getCategoryCount(category.code) }}</span>
        </div>
      </div>
    </div>

    <!-- 最近浏览 -->
    <div class="sidebar-section">
      <h3 class="section-title">最近浏览</h3>
      <div class="recent-recipes">
        <div 
          v-for="recipe in latestRecipes" 
          :key="recipe.id" 
          class="recipe-item"
          @click="handleViewRecipe(recipe)"
        >
          <div class="recipe-image">
            <img 
              :src="recipe.image || '/placeholder-recipe.jpg'" 
              :alt="recipe.title"
              @error="handleImageError"
            />
          </div>
          <div class="recipe-info">
            <div class="recipe-title">{{ recipe.title }}</div>
            <div class="recipe-meta">
              <span class="category">
                <i :class="getCategoryIcon(recipe.categoryCode)"></i>
                {{ getCategoryName(recipe.categoryCode) }}
              </span>
              <span class="author">{{ recipe.author }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门菜谱 -->
    <div class="sidebar-section">
      <h3 class="section-title">热门菜谱</h3>
      <div class="popular-recipes">
        <div 
          v-for="recipe in popularRecipes" 
          :key="recipe.id" 
          class="recipe-item"
          @click="handleViewRecipe(recipe)"
        >
          <div class="recipe-image">
            <img 
              :src="recipe.image || '/placeholder-recipe.jpg'" 
              :alt="recipe.title"
              @error="handleImageError"
            />
          </div>
          <div class="recipe-info">
            <div class="recipe-title">{{ recipe.title }}</div>
            <div class="recipe-stats">
              <span class="views">
                <i class="fas fa-eye"></i>
                {{ recipe.views }}
              </span>
              <span class="likes">
                <i class="fas fa-heart"></i>
                {{ recipe.likes }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMessage } from 'naive-ui'

// 创建全局message实例
const message = useMessage()

// 添加FontAwesome CDN
const head = document.head || document.getElementsByTagName('head')[0]
const existingLink = head.querySelector('link[href*="font-awesome"]')
if (!existingLink) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
  head.appendChild(link)
}

// 接口定义
interface Recipe {
  id: number
  title: string
  description: string
  image?: string
  steps: any[]
  tips?: string
  categoryCode: number
  author: string
  createdAt: number
  views: number
  likes: number
  bookmarks?: number
  isLiked: boolean
  isBookmarked: boolean
}

interface CategoryType {
  code: number
  name: string
}

// Props定义
const props = defineProps<{
  recipes: Recipe[]
  categories: CategoryType[]
}>()

// Emits定义  
const emit = defineEmits<{
  'add-recipe': [recipe: any]
}>()

// 计算属性
const totalRecipes = computed(() => props.recipes.length)

const categoriesCount = computed(() => props.categories.filter(c => c.code !== 0).length)

const totalViews = computed(() => 
  props.recipes.reduce((sum, recipe) => sum + recipe.views, 0)
)

const totalLikes = computed(() => 
  props.recipes.reduce((sum, recipe) => sum + recipe.likes, 0)
)

const latestRecipes = computed(() => 
  [...props.recipes]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3)
)

const popularRecipes = computed(() => 
  [...props.recipes]
    .sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2))
    .slice(0, 3)
)

// 获取分类名称
const getCategoryName = (code: number): string => {
  const category = props.categories.find(c => c.code === code)
  return category ? category.name : '未知'
}

// 获取分类图标
const getCategoryIcon = (code: number): string => {
  const icons: Record<number, string> = {
    0: 'fas fa-utensils',      // 全部
    1: 'fas fa-dragon',        // 中式菜
    2: 'fas fa-hamburger',     // 西式菜
    3: 'fas fa-birthday-cake', // 甜品
    4: 'fas fa-coffee',        // 汤品
    5: 'fas fa-cookie-bite',   // 小食
  }
  return icons[code] || 'fas fa-utensils'
}

// 获取分类颜色
const getCategoryColor = (code: number): string => {
  const colors: Record<number, string> = {
    1: '#3B82F6', // 中式菜 - 蓝色
    2: '#10B981', // 西式菜 - 绿色
    3: '#F59E0B', // 甜品 - 黄色
    4: '#8B5CF6', // 汤品 - 紫色
    5: '#EF4444', // 小食 - 红色
  }
  return colors[code] || '#6B7280'
}

// 获取分类数量
const getCategoryCount = (code: number): number => {
  return props.recipes.filter(recipe => recipe.categoryCode === code).length
}

// 获取分类百分比
const getCategoryPercentage = (code: number): number => {
  if (props.recipes.length === 0) return 0
  return Math.round((getCategoryCount(code) / props.recipes.length) * 100)
}

// 处理图片错误
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-recipe.jpg'
}

// 事件处理
const handleAddRecipe = () => {
  message.info('快速添加功能开发中...')
}

const handleRandomPick = () => {
  if (props.recipes.length === 0) {
    message.warning('暂无菜谱数据')
    return
  }
  
  const randomIndex = Math.floor(Math.random() * props.recipes.length)
  const randomRecipe = props.recipes[randomIndex]
  message.success(`随机推荐菜谱：${randomRecipe.title}`)
}

const handleViewRecipe = (recipe: Recipe) => {
  message.info(`查看菜谱：${recipe.title}`)
}

// 初始化
onMounted(() => {
  // 可以在这里进行初始化操作
})
</script>

<script lang="ts">
export default {
  name: 'RecipeRightSidebar'
}
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

.recipe-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 14px 260px 0;
  height: auto;
  min-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
  max-height: none !important;
}

.recipe-sidebar::-webkit-scrollbar {
  display: none;
}

/* 区域样式 */
.sidebar-section {
  background: transparent;
  backdrop-filter: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  border: none;
  max-width: 100%;
  box-sizing: border-box;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 12px;
  color: #333;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 20px;
  height: 2px;
  background-color: #333;
  border-radius: 2px;
}

/* 快速操作样式 */
.quick-actions {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.quick-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.add-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 3px rgba(16, 185, 129, 0.3);
}

.add-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(16, 185, 129, 0.4);
}

.random-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 2px 3px rgba(245, 158, 11, 0.3);
}

.random-btn:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(245, 158, 11, 0.4);
}

/* 统计卡片样式 */
.recipe-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.recipe-stat-card {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 
    0 3px 8px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recipe-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 5px 12px rgba(0, 0, 0, 0.05),
    0 2px 4px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.5);
}

.recipe-stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.recipe-stat-label {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

/* 分类统计样式 */
.category-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 
    0 3px 10px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.category-stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-stat-info {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 60px;
}

.category-stat-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.category-stat-name {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.category-stat-bar-container {
  height: 5px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  overflow: hidden;
  flex-grow: 1;
}

.category-stat-bar {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.category-stat-count {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  background-color: rgba(0, 0, 0, 0.05);
  height: 20px;
  min-width: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
}

/* 菜谱列表样式 */
.recent-recipes, .popular-recipes {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 
    0 3px 10px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.7);
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recipe-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.recipe-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.recipe-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.recipe-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recipe-meta, .recipe-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #9ca3af;
}

.category {
  display: flex;
  align-items: center;
  gap: 4px;
}

.views, .likes {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .recipe-sidebar {
    gap: 20px;
  }
  
  .recipe-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .quick-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>