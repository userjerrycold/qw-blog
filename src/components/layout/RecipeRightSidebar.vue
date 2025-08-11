<template>
  <div class="recipe-sidebar">
    <!-- 添加FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- 快速统计 -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-chart-pie"></i>
        菜谱统计
      </h3>
      <div class="stats-grid">
        <div class="stat-card total-recipes">
          <div class="stat-icon">
            <i class="fas fa-utensils"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ totalRecipes }}</div>
            <div class="stat-label">总菜谱</div>
          </div>
        </div>
        
        <div class="stat-card total-views">
          <div class="stat-icon">
            <i class="fas fa-eye"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ totalViews }}</div>
            <div class="stat-label">总浏览</div>
          </div>
        </div>
        
        <div class="stat-card total-likes">
          <div class="stat-icon">
            <i class="fas fa-heart"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ totalLikes }}</div>
            <div class="stat-label">总点赞</div>
          </div>
        </div>
        
        <div class="stat-card bookmarked">
          <div class="stat-icon">
            <i class="fas fa-bookmark"></i>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ totalBookmarks }}</div>
            <div class="stat-label">总收藏</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分类统计 -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-tags"></i>
        分类分布
      </h3>
      <div class="category-stats">
        <div 
          v-for="category in categoryStats" 
          :key="category.code"
          class="category-stat-item"
          :class="`category-${category.code}`"
        >
          <div class="category-stat-info">
            <div class="category-stat-header">
              <i :class="getCategoryIcon(category.code)"></i>
              <span class="category-name">{{ category.name }}</span>
            </div>
            <div class="category-stat-number">{{ category.count }} 道菜</div>
          </div>
          <div class="category-stat-bar">
            <div 
              class="category-stat-fill" 
              :style="{ width: category.percentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 热门菜谱 -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-fire"></i>
        热门菜谱
      </h3>
      <div class="popular-recipes">
        <div 
          v-for="(recipe, index) in popularRecipes" 
          :key="recipe.id"
          class="popular-recipe-item"
          @click="$emit('view-recipe', recipe)"
        >
          <div class="popular-rank">{{ index + 1 }}</div>
          <div class="popular-recipe-info">
            <div class="popular-recipe-title">{{ recipe.title }}</div>
            <div class="popular-recipe-stats">
              <span class="popular-stat">
                <i class="fas fa-eye"></i>
                {{ recipe.views }}
              </span>
              <span class="popular-stat">
                <i class="fas fa-heart"></i>
                {{ recipe.likes }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="popularRecipes.length === 0" class="no-popular">
          <i class="fas fa-utensils"></i>
          <p>暂无热门菜谱</p>
        </div>
      </div>
    </div>
    
    <!-- 最近更新 -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-clock"></i>
        最近更新
      </h3>
      <div class="recent-recipes">
        <div 
          v-for="recipe in recentRecipes" 
          :key="recipe.id"
          class="recent-recipe-item"
          @click="$emit('view-recipe', recipe)"
        >
          <div class="recent-recipe-info">
            <div class="recent-recipe-title">{{ recipe.title }}</div>
            <div class="recent-recipe-meta">
              <span class="recent-author">
                <i class="fas fa-user-circle"></i>
                {{ recipe.author }}
              </span>
              <span class="recent-time">{{ formatTimeAgo(recipe.createdAt) }}</span>
            </div>
          </div>
          <div class="recent-recipe-category">
            <i :class="getCategoryIcon(recipe.categoryCode)"></i>
          </div>
        </div>
        
        <div v-if="recentRecipes.length === 0" class="no-recent">
          <i class="fas fa-clock"></i>
          <p>暂无最近更新</p>
        </div>
      </div>
    </div>
    
    <!-- 快速添加 -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-plus-circle"></i>
        快速操作
      </h3>
      <div class="quick-actions">
        <button class="quick-action-btn add-recipe-btn" @click="openQuickAdd">
          <i class="fas fa-utensils"></i>
          <span>添加菜谱</span>
        </button>
        
        <button class="quick-action-btn import-btn" @click="openImport">
          <i class="fas fa-file-import"></i>
          <span>导入菜谱</span>
        </button>
        
        <button class="quick-action-btn export-btn" @click="openExport">
          <i class="fas fa-file-export"></i>
          <span>导出菜谱</span>
        </button>
      </div>
    </div>
    
    <!-- 使用提示 -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <i class="fas fa-lightbulb"></i>
        使用提示
      </h3>
      <div class="tips-content">
        <div class="tip-item">
          <i class="fas fa-camera"></i>
          <span>上传清晰的菜品图片能获得更多关注</span>
        </div>
        <div class="tip-item">
          <i class="fas fa-list-ol"></i>
          <span>详细的制作步骤让别人更容易学会</span>
        </div>
        <div class="tip-item">
          <i class="fas fa-heart"></i>
          <span>分享制作心得能帮助其他人避坑</span>
        </div>
        <div class="tip-item">
          <i class="fas fa-tags"></i>
          <span>选择合适的分类让菜谱更容易被发现</span>
        </div>
      </div>
    </div>
    
    <!-- 快速添加弹窗 -->
    <n-modal v-model:show="showQuickAddModal" class="quick-add-modal" style="width: 500px;">
      <div class="modal-container">
        <div class="modal-inner">
          <div class="modal-header">
            <div class="modal-title">快速添加菜谱</div>
            <n-button quaternary circle class="close-btn" @click="showQuickAddModal = false">
              <n-icon>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </n-icon>
            </n-button>
          </div>
          
          <div class="modal-content">
            <div class="form-group">
              <label class="form-label">菜谱名称 <span class="required">*</span></label>
              <n-input 
                v-model:value="quickForm.title" 
                placeholder="输入菜谱名称"
                clearable
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">简单描述 <span class="required">*</span></label>
              <n-input 
                v-model:value="quickForm.description" 
                type="textarea" 
                placeholder="简单介绍一下这道菜..."
                :rows="3"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">分类</label>
              <n-select
                v-model:value="quickForm.categoryCode"
                :options="quickCategoryOptions"
                placeholder="选择分类"
              />
            </div>
          </div>
          
          <div class="modal-footer">
            <n-button @click="showQuickAddModal = false">取消</n-button>
            <n-button type="primary" @click="submitQuickAdd">添加</n-button>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { NButton, NModal, NInput, NSelect, NIcon, useMessage } from 'naive-ui'

// 添加FontAwesome CDN
const head = document.head || document.getElementsByTagName('head')[0]
const existingLink = head.querySelector('link[href*="font-awesome"]')
if (!existingLink) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
  head.appendChild(link)
}

interface Recipe {
  id: number
  title: string
  description: string
  image?: string
  steps: string[]
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

// Props
const props = defineProps<{
  recipes: Recipe[]
  categories: CategoryType[]
}>()

// Emits
const emit = defineEmits<{
  'add-recipe': [recipe: any]
  'view-recipe': [recipe: Recipe]
}>()

// UI状态
const showQuickAddModal = ref(false)

// 创建message实例
const message = useMessage()

// 快速添加表单
const quickForm = reactive({
  title: '',
  description: '',
  categoryCode: 1
})

// 快速分类选项
const quickCategoryOptions = computed(() => {
  return props.categories
    .filter(category => category.code !== 0)
    .map(category => ({
      label: category.name,
      value: category.code
    }))
})

// 统计计算
const totalRecipes = computed(() => props.recipes.length)

const totalViews = computed(() => 
  props.recipes.reduce((sum, recipe) => sum + recipe.views, 0)
)

const totalLikes = computed(() => 
  props.recipes.reduce((sum, recipe) => sum + recipe.likes, 0)
)

const totalBookmarks = computed(() => 
  props.recipes.reduce((sum, recipe) => sum + (recipe.bookmarks || 0), 0)
)

// 分类统计
const categoryStats = computed(() => {
  const stats = props.categories
    .filter(category => category.code !== 0)
    .map(category => {
      const count = props.recipes.filter(recipe => recipe.categoryCode === category.code).length
      return {
        code: category.code,
        name: category.name,
        count,
        percentage: totalRecipes.value > 0 ? (count / totalRecipes.value) * 100 : 0
      }
    })
  
  return stats.sort((a, b) => b.count - a.count)
})

// 热门菜谱
const popularRecipes = computed(() => {
  return [...props.recipes]
    .sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2))
    .slice(0, 5)
})

// 最近更新菜谱
const recentRecipes = computed(() => {
  return [...props.recipes]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)
})

// 获取分类图标
function getCategoryIcon(code: number): string {
  const icons: Record<number, string> = {
    1: 'fas fa-dragon',        // 中式菜
    2: 'fas fa-hamburger',     // 西式菜
    3: 'fas fa-birthday-cake', // 甜品
    4: 'fas fa-coffee',        // 汤品
    5: 'fas fa-cookie-bite',   // 小食
  }
  return icons[code] || 'fas fa-utensils'
}

// 格式化相对时间
function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
  
  return new Date(timestamp).toLocaleDateString()
}

// 打开快速添加
function openQuickAdd(): void {
  resetQuickForm()
  showQuickAddModal.value = true
}

// 打开导入
function openImport(): void {
  message.info('导入功能开发中...')
}

// 打开导出
function openExport(): void {
  if (props.recipes.length === 0) {
    message.warning('暂无菜谱可导出')
    return
  }
  message.success('导出功能开发中...')
}

// 重置快速表单
function resetQuickForm(): void {
  quickForm.title = ''
  quickForm.description = ''
  quickForm.categoryCode = 1
}

// 提交快速添加
function submitQuickAdd(): void {
  if (!quickForm.title.trim()) {
    message.error('请填写菜谱名称')
    return
  }
  
  if (!quickForm.description.trim()) {
    message.error('请填写菜谱描述')
    return
  }
  
  const newRecipe = {
    title: quickForm.title,
    description: quickForm.description,
    image: '',
    steps: ['请添加制作步骤...'],
    tips: '',
    categoryCode: quickForm.categoryCode
  }
  
  emit('add-recipe', newRecipe)
  showQuickAddModal.value = false
  resetQuickForm()
}

// 监听数据变化，触发统计更新
watch(() => props.recipes, () => {
  // 统计数据会自动通过computed重新计算
}, { deep: true })

// 初始化
onMounted(() => {
  // 初始化操作
})
</script>

<style scoped>
.recipe-sidebar {
  height: 100%;
  background: white;
  padding: 0;
  overflow-y: auto;
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.recipe-sidebar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 侧边栏章节 */
.sidebar-section {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-section:last-child {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
}

.section-title i {
  font-size: 14px;
  color: #3b82f6;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.total-recipes .stat-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.total-views .stat-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.total-likes .stat-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.bookmarked .stat-icon {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

/* 分类统计 */
.category-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-stat-item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.category-stat-item:hover {
  background: #f3f4f6;
}

.category-1 {
  border-left-color: #dc2626;
}

.category-2 {
  border-left-color: #2563eb;
}

.category-3 {
  border-left-color: #ec4899;
}

.category-4 {
  border-left-color: #059669;
}

.category-5 {
  border-left-color: #d97706;
}

.category-stat-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.category-stat-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-stat-header i {
  font-size: 12px;
  color: #6b7280;
}

.category-name {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.category-stat-number {
  font-size: 12px;
  color: #6b7280;
}

.category-stat-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.category-stat-fill {
  height: 100%;
  background: currentColor;
  transition: width 0.3s ease;
}

.category-1 .category-stat-fill {
  background: #dc2626;
}

.category-2 .category-stat-fill {
  background: #2563eb;
}

.category-3 .category-stat-fill {
  background: #ec4899;
}

.category-4 .category-stat-fill {
  background: #059669;
}

.category-5 .category-stat-fill {
  background: #d97706;
}

/* 热门菜谱 */
.popular-recipes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popular-recipe-item {
  display: flex;
  gap: 12px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.popular-recipe-item:hover {
  background: #f3f4f6;
  transform: translateX(2px);
}

.popular-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.popular-recipe-info {
  flex: 1;
  min-width: 0;
}

.popular-recipe-title {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popular-recipe-stats {
  display: flex;
  gap: 12px;
}

.popular-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #6b7280;
}

.popular-stat i {
  font-size: 10px;
}

/* 最近更新 */
.recent-recipes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-recipe-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recent-recipe-item:hover {
  background: #f3f4f6;
  transform: translateX(2px);
}

.recent-recipe-info {
  flex: 1;
  min-width: 0;
}

.recent-recipe-title {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-recipe-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recent-author,
.recent-time {
  font-size: 11px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.recent-author i {
  font-size: 10px;
}

.recent-recipe-category {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-size: 12px;
  flex-shrink: 0;
}

/* 空状态 */
.no-popular,
.no-recent {
  text-align: center;
  padding: 20px 10px;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.no-popular i,
.no-recent i {
  font-size: 24px;
  opacity: 0.5;
}

.no-popular p,
.no-recent p {
  margin: 0;
  font-size: 12px;
}

/* 快速操作 */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.quick-action-btn:hover {
  background: #f1f5f9;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.add-recipe-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.import-btn:hover {
  border-color: #22c55e;
  color: #22c55e;
}

.export-btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
}

.quick-action-btn i {
  font-size: 14px;
}

/* 使用提示 */
.tips-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px;
  background: #fef3c7;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  color: #92400e;
}

.tip-item i {
  font-size: 14px;
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 1px;
}

/* 快速添加弹窗 */
.quick-add-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-add-modal .modal-container {
  position: relative;
  margin: 0 auto;
}

.quick-add-modal :deep(.n-modal) {
  width: auto !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.quick-add-modal :deep(.n-modal-body),
.quick-add-modal :deep(.n-modal-body-wrapper),
.quick-add-modal :deep(.n-card),
.quick-add-modal :deep(.n-card__content) {
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  width: 100% !important;
}

.quick-add-modal .modal-inner {
  width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.quick-add-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.quick-add-modal .modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.quick-add-modal .close-btn {
  margin-right: -6px;
  color: #999;
}

.quick-add-modal .modal-content {
  padding: 18px 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quick-add-modal .form-group {
  text-align: left;
  width: 100%;
}

.quick-add-modal .form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.quick-add-modal .modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 14px 20px 16px;
  border-top: 1px solid #f0f0f0;
  gap: 10px;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .sidebar-section {
    padding: 16px;
  }
}
</style>
