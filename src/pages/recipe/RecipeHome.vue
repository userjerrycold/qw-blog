<template>
  <div class="recipe-page">
    <PageLayout>
      <div class="recipe-container">
        <div class="page-header">
          <h1 class="page-title">菜谱分享</h1>
          
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
                    placeholder="搜索菜谱..." 
                    class="search-input"
                    @keyup.enter="handleSearch"
                  />
                </div>
              </div>
              
              <!-- 添加按钮 -->
              <button class="add-button" @click="addNewRecipe" title="添加菜谱">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            
            <!-- 分类筛选 -->
            <div class="tags-container">
              <div class="tag-filters">
                <div 
                  v-for="category in recipeCategories" 
                  :key="category.code"
                  class="tag"
                  :class="[
                    { 'active': activeCategoryCode === category.code },
                    `tag-${category.code}`
                  ]"
                  @click="setActiveCategory(category.code)"
                >
                  <i :class="getCategoryIcon(category.code)"></i> {{ category.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-divider"></div>
        
        <!-- 菜谱列表 -->
        <n-spin :show="isLoading">
          <div v-if="filteredRecipes.length === 0" class="empty-recipes">
            <div class="empty-illustration">
              <svg width="84" height="84" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H5V21H19V9ZM7 13H17V15H7V13ZM7 17H14V19H7V17Z" />
              </svg>
            </div>
            <p>暂无菜谱，点击 + 按钮添加你的第一道菜</p>
          </div>
          <div v-else>
            <!-- 菜谱卡片展示 -->
            <div class="recipe-grid">
              <div 
                v-for="recipe in filteredRecipes" 
                :key="recipe.id" 
                class="recipe-card"
                :class="`recipe-card-${recipe.categoryCode}`"
                @click="viewRecipe(recipe)"
              >
                <!-- 菜谱图片 -->
                <div class="recipe-image-container">
                  <img 
                    :src="recipe.image || '/placeholder-recipe.jpg'" 
                    :alt="recipe.title"
                    class="recipe-image"
                    @error="handleImageError"
                  />
                  <div class="recipe-image-overlay">
                    <div class="recipe-stats">
                      <span class="stat-item">
                        <i class="fas fa-eye"></i>
                        {{ recipe.views }}
                      </span>
                      <span class="stat-item">
                        <i class="fas fa-heart"></i>
                        {{ recipe.likes }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- 菜谱信息 -->
                <div class="recipe-info">
                  <div class="recipe-header">
                    <h3 class="recipe-title">{{ recipe.title }}</h3>
                    <div class="recipe-category">
                      <i :class="getCategoryIcon(recipe.categoryCode)"></i>
                      {{ getCategoryName(recipe.categoryCode) }}
                    </div>
                  </div>
                  
                  <div class="recipe-description">
                    {{ getDescriptionSnippet(recipe.description) }}
                  </div>
                  
                  <div class="recipe-footer">
                    <div class="recipe-author">
                      <i class="fas fa-user-circle"></i>
                      {{ recipe.author }}
                    </div>
                    <div class="recipe-actions">
                      <button class="action-btn like-btn" :class="{ active: recipe.isLiked }" @click.stop="toggleLike(recipe)">
                        <i class="fas fa-heart"></i>
                      </button>
                      <button class="action-btn bookmark-btn" :class="{ active: recipe.isBookmarked }" @click.stop="toggleBookmark(recipe)">
                        <i class="fas fa-bookmark"></i>
                      </button>
                      <button class="action-btn edit-btn" @click.stop="editRecipe(recipe)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="action-btn delete-btn" @click.stop="confirmDelete(recipe)">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-spin>
      </div>
      
      <template #rightSidebar>
        <RecipeRightSidebar 
          :recipes="recipes"
          :categories="recipeCategories"
          @add-recipe="addRecipe"
        />
      </template>
    </PageLayout>
    
    <!-- 添加/编辑菜谱模态框 -->
    <n-modal v-model:show="showEditModal" :mask-closable="false" class="recipe-modal" style="width: 70vw; max-width: 900px;">
      <div class="modal-container">
        <div class="modal-inner">
          <div class="modal-header">
            <div class="modal-title">{{ isEditing ? '编辑菜谱' : '添加菜谱' }}</div>
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
              <label class="form-label">菜谱名称 <span class="required">*</span></label>
              <n-input 
                v-model:value="recipeForm.title" 
                placeholder="输入菜谱名称"
                class="form-control"
                clearable
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">菜谱图片</label>
              <div class="image-upload-container">
                <div 
                  class="image-upload-area"
                  @click="triggerImageUpload"
                  @drop="handleImageDrop"
                  @dragover="handleDragOver"
                >
                  <img 
                    v-if="recipeForm.image" 
                    :src="recipeForm.image" 
                    alt="预览图片" 
                    class="preview-image"
                  />
                  <div v-else class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>点击上传图片或拖拽图片到此处</p>
                  </div>
                  <input 
                    ref="imageInput" 
                    type="file" 
                    accept="image/*" 
                    style="display: none"
                    @change="handleImageSelect"
                  />
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">菜谱简介 <span class="required">*</span></label>
              <n-input 
                v-model:value="recipeForm.description" 
                type="textarea" 
                placeholder="介绍一下这道菜..."
                class="form-control"
                :rows="3"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">制作流程 <span class="required">*</span></label>
              <div class="steps-container">
                <div 
                  v-for="(step, index) in recipeForm.steps" 
                  :key="step.id" 
                  class="step-item enhanced-step"
                >
                  <div class="step-header">
                    <div class="step-number">{{ index + 1 }}</div>
                    <div class="step-type-selector">
                      <button 
                        v-for="(type, typeIndex) in [
                          { value: 'text', icon: 'fas fa-font', label: '文字' },
                          { value: 'image', icon: 'fas fa-image', label: '图片' },
                          { value: 'both', icon: 'fas fa-align-left', label: '图文' }
                        ]" 
                        :key="typeIndex"
                        :class="['type-btn', { active: step.type === type.value }]"
                        @click="changeStepType(index, type.value)"
                        :title="type.label"
                      >
                        <i :class="type.icon"></i>
                      </button>
                    </div>
                    <button 
                      class="remove-step-btn" 
                      @click="removeStep(index)"
                      v-if="recipeForm.steps.length > 1"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <div class="step-content">
                    <!-- 文字输入 -->
                    <div v-if="step.type === 'text' || step.type === 'both'" class="step-text-input">
                      <n-input 
                        v-model:value="step.text" 
                        type="textarea"
                        :placeholder="`第 ${index + 1} 步描述...`"
                        class="step-input"
                        :rows="2"
                      />
                    </div>
                    
                    <!-- 图片上传 -->
                    <div v-if="step.type === 'image' || step.type === 'both'" class="step-image-input">
                      <div 
                        class="step-image-upload"
                        @click="triggerStepImageUpload(index)"
                      >
                        <img 
                          v-if="step.image" 
                          :src="step.image" 
                          alt="步骤图片" 
                          class="step-preview-image"
                        />
                        <div v-else class="step-upload-placeholder">
                          <i class="fas fa-camera"></i>
                          <span>添加步骤图片</span>
                        </div>
                        <input 
                          :id="`step-image-${index}`"
                          type="file" 
                          accept="image/*" 
                          style="display: none"
                          @change="handleStepImageSelect(index, $event)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button class="add-step-btn" @click="addStep">
                  <i class="fas fa-plus"></i>
                  添加步骤
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">个人心得</label>
              <n-input 
                v-model:value="recipeForm.tips" 
                type="textarea" 
                placeholder="分享制作这道菜的心得体会..."
                class="form-control"
                :rows="3"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">菜谱分类</label>
              <div class="category-selector">
                <button 
                  v-for="category in categoryOptions" 
                  :key="category.value" 
                  :class="['category-option', { active: recipeForm.categoryCode === category.value }]" 
                  @click.prevent="recipeForm.categoryCode = category.value"
                >
                  <i :class="getCategoryIcon(category.value)"></i> {{ category.label }}
                </button>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <n-button class="cancel-button" @click="cancelEdit">取消</n-button>
            <n-button type="primary" class="save-button" @click="saveRecipe">保存</n-button>
          </div>
        </div>
      </div>
    </n-modal>
    
    <!-- 查看菜谱详情模态框 -->
    <n-modal v-model:show="showViewModal" class="recipe-modal" style="width: 75vw; max-width: 1000px; max-height: 90vh;">
      <div class="modal-container">
        <div class="modal-inner" style="max-height: 90vh; overflow-y: auto;">
          <div class="modal-header">
            <div class="modal-title">
              <span>{{ currentRecipe ? currentRecipe.title : '' }}</span>
            </div>
            <n-button quaternary circle class="close-btn" @click="showViewModal = false">
              <n-icon>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </n-icon>
            </n-button>
          </div>
          
          <div class="modal-content" v-if="currentRecipe">
            <!-- 菜谱头部信息 -->
            <div class="recipe-detail-header">
              <div class="recipe-detail-image">
                <img 
                  :src="currentRecipe.image || '/placeholder-recipe.jpg'" 
                  :alt="currentRecipe.title"
                  @error="handleImageError"
                />
              </div>
              <div class="recipe-detail-info">
                <div class="recipe-detail-meta">
                  <div class="category-tag">
                    <i :class="getCategoryIcon(currentRecipe.categoryCode)"></i> 
                    {{ getCategoryName(currentRecipe.categoryCode) }}
                  </div>
                  <div class="author-info">
                    <i class="fas fa-user-circle"></i>
                    {{ currentRecipe.author }}
                  </div>
                </div>
                <div class="recipe-stats-detail">
                  <div class="stat-item">
                    <i class="fas fa-eye"></i>
                    <span>{{ currentRecipe.views }} 次查看</span>
                  </div>
                  <div class="stat-item">
                    <i class="fas fa-heart" :class="{ active: currentRecipe.isLiked }"></i>
                    <span>{{ currentRecipe.likes }} 个赞</span>
                  </div>
                  <div class="stat-item">
                    <i class="fas fa-bookmark" :class="{ active: currentRecipe.isBookmarked }"></i>
                    <span>{{ currentRecipe.bookmarks || 0 }} 收藏</span>
                  </div>
                </div>
                <div class="interaction-buttons">
                  <button class="interaction-btn like-btn" :class="{ active: currentRecipe.isLiked }" @click="toggleLike(currentRecipe)">
                    <i class="fas fa-heart"></i>
                    {{ currentRecipe.isLiked ? '已点赞' : '点赞' }}
                  </button>
                  <button class="interaction-btn bookmark-btn" :class="{ active: currentRecipe.isBookmarked }" @click="toggleBookmark(currentRecipe)">
                    <i class="fas fa-bookmark"></i>
                    {{ currentRecipe.isBookmarked ? '已收藏' : '收藏' }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 菜谱描述 -->
            <div class="recipe-section">
              <h3 class="section-title">菜谱简介</h3>
              <div class="section-content">
                {{ currentRecipe.description }}
              </div>
            </div>
            
            <!-- 制作步骤 -->
            <div class="recipe-section">
              <h3 class="section-title">制作步骤</h3>
              <div class="steps-list">
                <div 
                  v-for="(step, index) in currentRecipe.steps" 
                  :key="step.id" 
                  class="step-detail enhanced-step-detail"
                  :class="`step-type-${step.type}`"
                >
                  <div class="step-number-detail">{{ index + 1 }}</div>
                  <div class="step-detail-content">
                    <!-- 步骤图片 -->
                    <div v-if="step.image" class="step-detail-image">
                      <img 
                        :src="step.image" 
                        :alt="`第${index + 1}步图片`" 
                        class="step-image"
                        @click="viewStepImage(step.image)"
                      />
                    </div>
                    <!-- 步骤文字 -->
                    <div v-if="step.text" class="step-detail-text">
                      {{ step.text }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 个人心得 -->
            <div v-if="currentRecipe.tips" class="recipe-section">
              <h3 class="section-title">制作心得</h3>
              <div class="section-content tips-content">
                {{ currentRecipe.tips }}
              </div>
            </div>
            
            <!-- 评论区域 -->
            <div class="recipe-section">
              <h3 class="section-title">评论 ({{ currentRecipe.comments ? currentRecipe.comments.length : 0 }})</h3>
              
              <!-- 添加评论 -->
              <div class="comment-input-section">
                <n-input 
                  v-model:value="newComment" 
                  type="textarea" 
                  placeholder="写下你的评论..."
                  :rows="3"
                  class="comment-input"
                />
                <div class="comment-actions">
                  <n-button type="primary" @click="addComment" :disabled="!newComment.trim()">
                    发表评论
                  </n-button>
                </div>
              </div>
              
              <!-- 评论列表 -->
              <div class="comments-list" v-if="currentRecipe.comments && currentRecipe.comments.length > 0">
                <div 
                  v-for="comment in currentRecipe.comments" 
                  :key="comment.id" 
                  class="comment-item"
                >
                  <div class="comment-header">
                    <div class="comment-author">
                      <i class="fas fa-user-circle"></i>
                      {{ comment.author }}
                    </div>
                    <div class="comment-time">
                      {{ formatTime(comment.createdAt) }}
                    </div>
                  </div>
                  <div class="comment-content">
                    {{ comment.content }}
                  </div>
                </div>
              </div>
              <div v-else class="no-comments">
                <p>暂无评论，快来发表第一条评论吧！</p>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <n-button class="cancel-button" @click="editCurrentRecipe">编辑</n-button>
            <n-button type="primary" class="save-button" @click="closeViewModal">关闭</n-button>
          </div>
        </div>
      </div>
    </n-modal>
    
    <!-- 删除确认对话框 -->
    <n-modal v-model:show="showDeleteModal" class="recipe-modal delete-modal" style="width: 70vw; max-width: 600px;">
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
              确定要删除这个菜谱吗？<br>此操作无法撤销。
            </div>
          </div>
          
          <div class="modal-footer">
            <n-button class="cancel-button" @click="showDeleteModal = false">取消</n-button>
            <n-button type="primary" class="save-button danger-button" @click="deleteRecipeHandler">删除</n-button>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { NButton, NModal, NInput, NIcon, NSpin, useMessage } from 'naive-ui'
import PageLayout from '@/components/layout/PageLayout.vue'


// 添加FontAwesome CDN
const head = document.head || document.getElementsByTagName('head')[0]
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
head.appendChild(link)

// 制作步骤接口定义
interface RecipeStep {
  id: number
  text?: string      // 文字描述
  image?: string     // 图片URL
  type: 'text' | 'image' | 'both'  // 步骤类型：纯文字、纯图片、图文混合
}

// 菜谱接口定义
interface Recipe {
  id: number
  title: string
  description: string
  image?: string
  steps: RecipeStep[]  // 修改为步骤对象数组
  tips?: string
  categoryCode: number
  author: string
  createdAt: number
  views: number
  likes: number
  bookmarks?: number
  isLiked: boolean
  isBookmarked: boolean
  comments?: Comment[]
}

// 评论接口定义
interface Comment {
  id: number
  author: string
  content: string
  createdAt: number
}

// 分类类型接口
interface CategoryType {
  code: number
  name: string
}

// 菜谱分类枚举
const RecipeCategoryEnum: Record<string, CategoryType> = {
  ALL: { code: 0, name: '全部' },
  CHINESE: { code: 1, name: '中式菜' },
  WESTERN: { code: 2, name: '西式菜' },
  DESSERT: { code: 3, name: '甜品' },
  SOUP: { code: 4, name: '汤品' },
  SNACK: { code: 5, name: '小食' },
}

// 所有分类
const recipeCategories: CategoryType[] = [
  RecipeCategoryEnum.ALL,
  RecipeCategoryEnum.CHINESE,
  RecipeCategoryEnum.WESTERN,
  RecipeCategoryEnum.DESSERT,
  RecipeCategoryEnum.SOUP,
  RecipeCategoryEnum.SNACK
]

// UI状态
const searchQuery = ref('')
const activeCategoryCode = ref(0)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showViewModal = ref(false)
const isEditing = ref(false)
const currentRecipe = ref<Recipe | null>(null)
const isLoading = ref(false)
const newComment = ref('')
const imageInput = ref<HTMLInputElement>()

// 创建全局message实例
const message = useMessage()

// 菜谱表单数据
const recipeForm = reactive({
  id: 0,
  title: '',
  description: '',
  image: '',
  steps: [{ id: 1, text: '', type: 'text' as const }] as RecipeStep[],
  tips: '',
  categoryCode: 1,
  author: '当前用户'
})

// 分类选项
const categoryOptions = computed(() => {
  return Object.values(RecipeCategoryEnum)
    .filter(category => category.code !== 0)
    .map(category => ({
      label: category.name,
      value: category.code
    }))
})

// 模拟菜谱数据
const recipes = ref<Recipe[]>([
  {
    id: 1,
    title: '红烧肉',
    description: '经典的中式红烧肉，肥瘦相间，入口即化，是家常菜的代表之一。',
    image: '',
    steps: [
      { id: 1, text: '五花肉切成2cm见方的块，冷水下锅焯水去腥', type: 'text' as const },
      { id: 2, text: '热锅下少许油，放入肉块煎至表面微黄', type: 'text' as const },
      { id: 3, text: '加入生抽、老抽、料酒、冰糖，炒至上色', type: 'text' as const },
      { id: 4, text: '加水没过肉块，大火烧开后转小火炖1小时', type: 'text' as const },
      { id: 5, text: '大火收汁至浓稠，撒上葱花即可', type: 'text' as const }
    ],
    tips: '选择肥瘦相间的五花肉最好，炖煮时间要足够，这样肉质才会软糯。',
    categoryCode: 1,
    author: '美食达人',
    createdAt: Date.now() - 86400000,
    views: 234,
    likes: 45,
    bookmarks: 12,
    isLiked: false,
    isBookmarked: false,
    comments: [
      {
        id: 1,
        author: '小王',
        content: '按照这个方法做出来的红烧肉真的很香，家人都很喜欢！',
        createdAt: Date.now() - 3600000
      },
      {
        id: 2,
        author: '美食爱好者',
        content: '炖煮的时间确实很重要，我第一次做就是时间不够，肉质偏硬。',
        createdAt: Date.now() - 1800000
      }
    ]
  },
  {
    id: 2,
    title: '提拉米苏',
    description: '意式经典甜品，层次丰富，口感顺滑，咖啡与奶香的完美结合。',
    image: '',
    steps: [
      { id: 1, text: '马斯卡彭奶酪室温软化，加入蛋黄搅拌均匀', type: 'text' as const },
      { id: 2, text: '淡奶油打发至6分，与奶酪糊混合', type: 'text' as const },
      { id: 3, text: '手指饼干在咖啡液中快速蘸取', type: 'text' as const },
      { id: 4, text: '在杯底铺一层饼干，再铺一层奶酪糊', type: 'text' as const },
      { id: 5, text: '重复铺层，最后撒上可可粉，冷藏4小时', type: 'text' as const }
    ],
    tips: '马斯卡彭奶酪一定要软化到位，咖啡液不要太浓，否则会过于苦涩。',
    categoryCode: 3,
    author: '甜品师',
    createdAt: Date.now() - 172800000,
    views: 156,
    likes: 38,
    bookmarks: 25,
    isLiked: false,
    isBookmarked: true,
    comments: []
  },
  {
    id: 3,
    title: '蛋炒饭',
    description: '简单易学的家常蛋炒饭，色香味俱全，是夜宵和快手餐的不二选择。',
    image: '',
    steps: [
      { id: 1, text: '准备食材：米饭、鸡蛋、胡萝卜丁、豌豆、香肠丁', type: 'text' as const },
      { id: 2, text: '热锅下油，倒入打散的蛋液', image: '', type: 'both' as const },
      { id: 3, text: '蛋液半熟时倒入米饭，快速炒散', type: 'text' as const },
      { id: 4, text: '加入配菜丁，炒至断生', type: 'text' as const },
      { id: 5, text: '调味：生抽、盐、胡椒粉，炒匀即可', type: 'text' as const }
    ],
    tips: '米饭最好用隔夜饭，这样炒出来粒粒分明。鸡蛋要趁热倒入米饭，这样更香。',
    categoryCode: 1,
    author: '家常菜师傅',
    createdAt: Date.now() - 259200000,
    views: 189,
    likes: 32,
    bookmarks: 8,
    isLiked: true,
    isBookmarked: false,
    comments: [
      {
        id: 1,
        author: '美食爱好者',
        content: '按照这个方法做的，真的很香！',
        createdAt: Date.now() - 3600000
      }
    ]
  }
])

// 过滤后的菜谱列表
const filteredRecipes = computed(() => {
  let filtered = recipes.value

  // 分类过滤
  if (activeCategoryCode.value !== 0) {
    filtered = filtered.filter(recipe => recipe.categoryCode === activeCategoryCode.value)
  }

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const keyword = searchQuery.value.toLowerCase()
    filtered = filtered.filter(recipe => 
      recipe.title.toLowerCase().includes(keyword) ||
      recipe.description.toLowerCase().includes(keyword) ||
      recipe.author.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 设置活动分类
function setActiveCategory(code: number): void {
  activeCategoryCode.value = code
}

// 获取分类名称
function getCategoryName(code: number): string {
  const category = Object.values(RecipeCategoryEnum).find(c => c.code === code)
  return category ? category.name : 'Unknown'
}

// 获取分类图标
function getCategoryIcon(code: number): string {
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

// 获取描述摘要
function getDescriptionSnippet(description: string): string {
  if (!description) return ''
  return description.length > 80 ? description.substring(0, 80) + '...' : description
}

// 添加新菜谱
function addNewRecipe(): void {
  isEditing.value = false
  resetForm()
  showEditModal.value = true
}

// 编辑菜谱
function editRecipe(recipe: Recipe): void {
  isEditing.value = true
  currentRecipe.value = recipe
  
  recipeForm.id = recipe.id
  recipeForm.title = recipe.title
  recipeForm.description = recipe.description
  recipeForm.image = recipe.image || ''
  recipeForm.steps = recipe.steps.map(step => ({ ...step }))
  recipeForm.tips = recipe.tips || ''
  recipeForm.categoryCode = recipe.categoryCode
  recipeForm.author = recipe.author
  
  showEditModal.value = true
}

// 查看菜谱详情
function viewRecipe(recipe: Recipe): void {
  currentRecipe.value = recipe
  recipe.views++
  showViewModal.value = true
}

// 取消编辑
function cancelEdit(): void {
  showEditModal.value = false
  resetForm()
}

// 重置表单
function resetForm(): void {
  isEditing.value = false
  currentRecipe.value = null
  recipeForm.id = 0
  recipeForm.title = ''
  recipeForm.description = ''
  recipeForm.image = ''
  recipeForm.steps = [{ id: 1, text: '', type: 'text' }]
  recipeForm.tips = ''
  recipeForm.categoryCode = 1
  recipeForm.author = '当前用户'
}

// 保存菜谱
function saveRecipe(): void {
  if (!recipeForm.title.trim()) {
    message.error('请填写菜谱名称')
    return
  }
  
  if (!recipeForm.description.trim()) {
    message.error('请填写菜谱简介')
    return
  }
  
  // 验证制作步骤
  const hasValidSteps = recipeForm.steps.some(step => {
    return (step.text && step.text.trim()) || step.image
  })
  
  if (!hasValidSteps) {
    message.error('请至少添加一个制作步骤（文字或图片）')
    return
  }

  if (isEditing.value && currentRecipe.value) {
    // 更新现有菜谱
    const index = recipes.value.findIndex(r => r.id === currentRecipe.value!.id)
    if (index !== -1) {
      recipes.value[index] = {
        ...recipes.value[index],
        title: recipeForm.title,
        description: recipeForm.description,
        image: recipeForm.image,
        steps: recipeForm.steps.filter(step => (step.text && step.text.trim()) || step.image),
        tips: recipeForm.tips,
        categoryCode: recipeForm.categoryCode
      }
      message.success('菜谱更新成功')
    }
  } else {
    // 添加新菜谱
    const newRecipe: Recipe = {
      id: Date.now(),
      title: recipeForm.title,
      description: recipeForm.description,
      image: recipeForm.image,
      steps: recipeForm.steps.filter(step => (step.text && step.text.trim()) || step.image),
      tips: recipeForm.tips,
      categoryCode: recipeForm.categoryCode,
      author: recipeForm.author,
      createdAt: Date.now(),
      views: 0,
      likes: 0,
      bookmarks: 0,
      isLiked: false,
      isBookmarked: false,
      comments: []
    }
    recipes.value.unshift(newRecipe)
    message.success('菜谱添加成功')
  }
  
  showEditModal.value = false
  resetForm()
}

// 添加步骤
function addStep(): void {
  const newId = Math.max(...recipeForm.steps.map(s => s.id), 0) + 1
  recipeForm.steps.push({ id: newId, text: '', type: 'text' })
}

// 移除步骤
function removeStep(index: number): void {
  if (recipeForm.steps.length > 1) {
    recipeForm.steps.splice(index, 1)
  }
}

// 修改步骤类型
function changeStepType(index: number, type: any): void {
  recipeForm.steps[index].type = type
  // 如果切换为纯图片，清空文字
  if (type === 'image') {
    recipeForm.steps[index].text = ''
  }
  // 如果切换为纯文字，清空图片
  if (type === 'text') {
    recipeForm.steps[index].image = ''
  }
}

// 步骤图片上传
function handleStepImageSelect(index: number, event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      recipeForm.steps[index].image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 触发步骤图片上传
function triggerStepImageUpload(index: number): void {
  const input = document.getElementById(`step-image-${index}`) as HTMLInputElement
  input?.click()
}

// 查看步骤图片
function viewStepImage(imageUrl: string): void {
  // 创建图片预览弹窗
  const modal = document.createElement('div')
  modal.className = 'image-preview-modal'
  modal.innerHTML = `
    <div class="image-preview-backdrop" onclick="this.parentElement.remove()">
      <div class="image-preview-container" onclick="event.stopPropagation()">
        <img src="${imageUrl}" alt="步骤图片" class="preview-image-full" />
        <button class="close-preview" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `
  document.body.appendChild(modal)
}

// 确认删除
function confirmDelete(recipe: Recipe): void {
  currentRecipe.value = recipe
  showDeleteModal.value = true
}

// 删除菜谱
function deleteRecipeHandler(): void {
  if (currentRecipe.value) {
    const index = recipes.value.findIndex(r => r.id === currentRecipe.value!.id)
    if (index !== -1) {
      recipes.value.splice(index, 1)
      message.success('菜谱删除成功')
      showDeleteModal.value = false
      showViewModal.value = false
    }
  }
}

// 点赞切换
function toggleLike(recipe: Recipe): void {
  recipe.isLiked = !recipe.isLiked
  if (recipe.isLiked) {
    recipe.likes++
    message.success('点赞成功')
  } else {
    recipe.likes--
    message.success('取消点赞')
  }
}

// 收藏切换
function toggleBookmark(recipe: Recipe): void {
  recipe.isBookmarked = !recipe.isBookmarked
  if (recipe.isBookmarked) {
    if (!recipe.bookmarks) recipe.bookmarks = 0
    recipe.bookmarks++
    message.success('收藏成功')
  } else {
    if (recipe.bookmarks && recipe.bookmarks > 0) recipe.bookmarks--
    message.success('取消收藏')
  }
}

// 搜索处理
function handleSearch(): void {
  // 搜索逻辑已在computed中实现
}

// 图片上传相关
function triggerImageUpload(): void {
  imageInput.value?.click()
}

function handleImageSelect(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleImageFile(file)
  }
}

function handleImageDrop(event: DragEvent): void {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleImageFile(files[0])
  }
}

function handleDragOver(event: DragEvent): void {
  event.preventDefault()
}

function handleImageFile(file: File): void {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      recipeForm.image = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    message.error('请选择图片文件')
  }
}

function handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-recipe.jpg'
}

// 添加评论
function addComment(): void {
  if (!newComment.value.trim()) return
  
  if (currentRecipe.value) {
    if (!currentRecipe.value.comments) {
      currentRecipe.value.comments = []
    }
    
    const comment: Comment = {
      id: Date.now(),
      author: '当前用户',
      content: newComment.value.trim(),
      createdAt: Date.now()
    }
    
    currentRecipe.value.comments.unshift(comment)
    newComment.value = ''
    message.success('评论发表成功')
  }
}

// 格式化时间
function formatTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`
  
  return new Date(timestamp).toLocaleDateString()
}

// 关闭查看模态框
function closeViewModal(): void {
  showViewModal.value = false
}

// 编辑当前查看的菜谱
function editCurrentRecipe(): void {
  if (currentRecipe.value) {
    editRecipe(currentRecipe.value)
    showViewModal.value = false
  }
}

// 从侧边栏接收新菜谱
function addRecipe(newRecipe: Omit<Recipe, 'id' | 'author' | 'createdAt' | 'views' | 'likes' | 'bookmarks' | 'isLiked' | 'isBookmarked' | 'comments'>): void {
  const recipe: Recipe = {
    ...newRecipe,
    id: Date.now(),
    author: '当前用户',
    createdAt: Date.now(),
    views: 0,
    likes: 0,
    bookmarks: 0,
    isLiked: false,
    isBookmarked: false,
    comments: []
  }
  recipes.value.unshift(recipe)
  message.success('菜谱添加成功')
}

// 初始化
onMounted(() => {
  // 可以在这里加载数据
})
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

.recipe-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  position: relative;
}

.recipe-container {
  padding: 0 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 60px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 4px;
  padding: 16px 0 12px 0;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
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
  gap: 10px;
}

.search-and-add {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-container {
  display: flex;
  flex-grow: 1;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 360px;
  height: 34px;
  border-radius: 6px;
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
  padding: 0 14px 0 34px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 13px;
  color: #333;
}

.search-input:focus {
  outline: none;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-button {
  width: 34px;
  height: 34px;
  border-radius: 6px;
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

/* 标签栏 */
.tags-container {
  margin-top: 8px;
  width: 100%;
  overflow-x: auto;
}

.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  cursor: pointer;
  padding: 5px 12px;
  background: rgba(244, 244, 245, 0.8);
  color: #666;
  font-size: 13px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-weight: 500;
}

.tag i {
  font-size: 11px;
  opacity: 0.8;
}

.tag:hover {
  background: rgba(234, 234, 235, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.tag.active {
  color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

/* 分类激活样式 */
.tag-0.active {
  background: linear-gradient(135deg, #5e72e4, #825ee4);
}

.tag-1.active {
  background: linear-gradient(135deg, #dc2626, #ef4444);
}

.tag-2.active {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}

.tag-3.active {
  background: linear-gradient(135deg, #ec4899, #f472b6);
}

.tag-4.active {
  background: linear-gradient(135deg, #059669, #10b981);
}

.tag-5.active {
  background: linear-gradient(135deg, #d97706, #f59e0b);
}

/* 空状态 */
.empty-recipes {
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

/* 菜谱网格 */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 2px 0;
}

.recipe-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 400px;
}

.recipe-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* 菜谱图片 */
.recipe-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.recipe-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: flex-end;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recipe-card:hover .recipe-image-overlay {
  opacity: 1;
}

.recipe-stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  font-size: 12px;
  font-weight: 500;
}

/* 菜谱信息 */
.recipe-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.recipe-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  margin-right: 10px;
}

.recipe-category {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 12px;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.recipe-description {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 12px;
  flex-grow: 1;
}

.recipe-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.recipe-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.recipe-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #f9fafb;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 12px;
}

.action-btn:hover {
  transform: scale(1.1);
}

.like-btn:hover, .like-btn.active {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.bookmark-btn:hover, .bookmark-btn.active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.edit-btn:hover {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* 弹窗样式 */
.recipe-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.recipe-modal .modal-container {
  position: relative;
  margin: 0 auto;
}

.recipe-modal :deep(.n-modal) {
  width: auto !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.recipe-modal :deep(.n-modal-body),
.recipe-modal :deep(.n-modal-body-wrapper),
.recipe-modal :deep(.n-card),
.recipe-modal :deep(.n-card__content) {
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  width: 100% !important;
}

.recipe-modal .modal-inner {
  width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.recipe-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.recipe-modal .modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.recipe-modal .close-btn {
  margin-right: -6px;
  color: #999;
}

.recipe-modal .modal-content {
  padding: 18px 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.recipe-modal .form-group {
  margin-bottom: 18px;
  text-align: left;
  width: 100%;
}

.recipe-modal .form-label {
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

.recipe-modal .form-control {
  width: 100%;
}

.recipe-modal .modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 14px 20px 16px;
  border-top: 1px solid #f0f0f0;
  gap: 10px;
}

.recipe-modal .cancel-button {
  min-width: 80px;
  color: #333 !important;
}

.recipe-modal .save-button {
  min-width: 80px;
  background-color: #333 !important;
  border-color: #333 !important;
}

.recipe-modal .danger-button {
  background-color: #ef4444 !important;
  border-color: #ef4444 !important;
}

/* 图片上传 */
.image-upload-container {
  width: 100%;
}

.image-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-upload-area:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
}

.preview-image {
  max-width: 100%;
  max-height: 120px;
  border-radius: 6px;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #6b7280;
}

.upload-placeholder i {
  font-size: 24px;
}

/* 步骤容器 */
.steps-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-number {
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
  margin-top: 8px;
}

.step-input {
  flex: 1;
}

.remove-step-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #ef4444;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-top: 8px;
  flex-shrink: 0;
}

.add-step-btn {
  border: 1px dashed #d1d5db;
  background: #f9fafb;
  color: #6b7280;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.add-step-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #f0f9ff;
}

/* 分类选择器 */
.category-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.category-option {
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

.category-option:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.category-option.active {
  background: #ebf5ff;
  border-color: #93c5fd;
  color: #2563eb;
}

/* 删除弹窗 */
.recipe-modal .delete-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.recipe-modal .delete-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.recipe-modal .delete-message {
  text-align: center;
  font-size: 16px;
  line-height: 1.6;
  color: #4b5563;
}

/* 菜谱详情 */
.recipe-detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.recipe-detail-image {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.recipe-detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recipe-detail-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.category-tag {
  padding: 4px 12px;
  border-radius: 12px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.recipe-stats-detail {
  display: flex;
  gap: 20px;
}

.recipe-stats-detail .stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
}

.recipe-stats-detail .stat-item i.active {
  color: #ef4444;
}

.interaction-buttons {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.interaction-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.interaction-btn:hover {
  border-color: #d1d5db;
  background: #f3f4f6;
}

.interaction-btn.active {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.bookmark-btn.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

/* 菜谱章节 */
.recipe-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
}

.section-content {
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
}

.tips-content {
  background: #fef3c7;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

/* 步骤详情 */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-detail {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-number-detail {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
  padding-top: 4px;
}

/* 评论相关 */
.comment-input-section {
  margin-bottom: 20px;
}

.comment-input {
  margin-bottom: 12px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid #e5e7eb;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.comment-time {
  font-size: 12px;
  color: #9ca3af;
}

.comment-content {
  font-size: 13px;
  line-height: 1.5;
  color: #4b5563;
}

.no-comments {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

/* 增强步骤样式 - 表单部分 */
.enhanced-step {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
  margin-bottom: 12px;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.step-type-selector {
  display: flex;
  gap: 4px;
}

.type-btn {
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.type-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-text-input {
  flex: 1;
}

.step-image-input {
  width: 100%;
}

.step-image-upload {
  width: 100%;
  height: 120px;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.step-image-upload:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.step-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.step-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.step-upload-placeholder i {
  font-size: 24px;
  color: #9ca3af;
}

/* 增强步骤样式 - 详情展示部分 */
.enhanced-step-detail {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
}

.step-detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-detail-image {
  width: 100%;
  max-width: 300px;
}

.step-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-image:hover {
  transform: scale(1.02);
}

.step-detail-text {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}

/* 步骤类型特定样式 */
.step-type-text .step-detail-content {
  align-items: flex-start;
}

.step-type-image .step-detail-content {
  align-items: center;
}

.step-type-both .step-detail-content {
  align-items: flex-start;
}

/* 图片预览弹窗 */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
}

.image-preview-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.image-preview-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;
}

.preview-image-full {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.close-preview {
  position: absolute;
  top: -40px;
  right: 0;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s ease;
}

.close-preview:hover {
  background: #f3f4f6;
}

/* 响应式 */
@media (max-width: 768px) {
  .recipe-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .recipe-detail-header {
    flex-direction: column;
  }

  .recipe-detail-image {
    width: 100%;
    height: 200px;
  }

  .interaction-buttons {
    flex-wrap: wrap;
  }

  .enhanced-step-detail {
    flex-direction: column;
    gap: 12px;
  }

  .step-detail-image {
    max-width: 100%;
  }

  .step-type-selector {
    flex-wrap: wrap;
  }

  .type-btn {
    padding: 4px 6px;
    font-size: 11px;
  }
}
</style>
