<template>
  <div class="wendao-material">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">问道素材</h1>
      <p class="page-subtitle">丰富的游戏素材资源库</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 分类筛选区域 -->
      <div class="category-filter">
        <div class="primary-categories">
          <div 
            class="category-btn"
            v-for="category in primaryCategories"
            :key="category.id"
            :class="{ active: selectedPrimaryCategory === category.id }"
            @click="selectPrimaryCategory(category.id)"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">({{ category.count }})</span>
          </div>
        </div>
        
        <!-- 二级分类 -->
        <div class="secondary-categories" v-if="secondaryCategories.length > 0">
          <div 
            class="sub-category-btn"
            v-for="subCategory in secondaryCategories"
            :key="subCategory.id"
            :class="{ active: selectedSecondaryCategory === subCategory.id }"
            @click="selectSecondaryCategory(subCategory.id)"
          >
            {{ subCategory.name }}
            <span class="sub-category-count">({{ subCategory.count }})</span>
          </div>
        </div>
      </div>

      <!-- 搜索和排序 -->
      <div class="search-sort-bar">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="搜索素材编号或关键词..."
            v-model="searchKeyword"
            @input="handleSearch"
            class="search-input"
          >
          <span class="search-icon">🔍</span>
        </div>
        <div class="sort-options">
          <select v-model="sortBy" @change="handleSort" class="sort-select">
            <option value="id">按编号排序</option>
            <option value="name">按名称排序</option>
            <option value="date">按时间排序</option>
            <option value="popular">按热度排序</option>
          </select>
        </div>
      </div>

      <!-- 素材展示区域 -->
      <div class="materials-grid" v-if="displayMaterials.length > 0">
        <div 
          class="material-card"
          v-for="material in displayMaterials"
          :key="material.id"
          @click="copyMaterialId(material)"
        >
          <div class="material-image">
            <div class="image-placeholder">
              {{ material.icon || '🖼️' }}
            </div>
            <div class="material-overlay">
              <span class="copy-hint">点击复制编号</span>
            </div>
          </div>
          <div class="material-info">
            <div class="material-id">{{ material.id }}</div>
            <div class="material-name">{{ material.name }}</div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <div class="empty-icon">📦</div>
        <h3>暂无素材</h3>
        <p>当前分类下暂无素材，请选择其他分类查看</p>
      </div>

      <!-- 分页加载 -->
      <div class="pagination-section" v-if="displayMaterials.length > 0">
        <div class="pagination-info">
          已显示 {{ displayMaterials.length }} / {{ totalMaterials }} 个素材
        </div>
        <button 
          class="load-more-btn"
          v-if="hasMore"
          @click="loadMoreMaterials"
          :disabled="loading"
        >
          <span class="btn-icon" v-if="!loading">📄</span>
          <span class="btn-icon loading" v-else>⏳</span>
          {{ loading ? '加载中...' : '查看更多' }}
        </button>
        <div class="pagination-end" v-else-if="displayMaterials.length > 0">
          已显示全部素材
        </div>
      </div>

      <!-- 复制提示 -->
      <div class="copy-toast" :class="{ show: showCopyToast }">
        <span class="toast-icon">✅</span>
        <span class="toast-text">素材编号已复制到剪贴板</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

// 接口定义
interface Material {
  id: string
  name: string
  icon?: string
  category: string
  subCategory: string
  popular: number
  date: string
}

interface Category {
  id: string
  name: string
  icon: string
  count: number
  subCategories: SubCategory[]
}

interface SubCategory {
  id: string
  name: string
  count: number
}

// 响应式数据
const selectedPrimaryCategory = ref('all')
const selectedSecondaryCategory = ref('all')
const searchKeyword = ref('')
const sortBy = ref('id')
const currentPage = ref(1)
const pageSize = 20
const loading = ref(false)
const showCopyToast = ref(false)

// 主分类数据
const primaryCategories = ref<Category[]>([
  {
    id: 'all',
    name: '全部',
    icon: '📁',
    count: 2580,
    subCategories: []
  },
  {
    id: 'npc',
    name: 'NPC',
    icon: '👤',
    count: 850,
    subCategories: [
      { id: 'mortal', name: '凡人', count: 320 },
      { id: 'demon', name: '妖怪', count: 280 },
      { id: 'immortal', name: '神仙', count: 250 }
    ]
  },
  {
    id: 'costume',
    name: '时装',
    icon: '👕',
    count: 680,
    subCategories: [
      { id: 'pool', name: '泳池系列', count: 120 },
      { id: 'dragon', name: '龙鸣系列', count: 150 },
      { id: 'tiger', name: '虎虎生威系列', count: 180 },
      { id: 'spring', name: '春日系列', count: 110 },
      { id: 'winter', name: '冬雪系列', count: 120 }
    ]
  },
  {
    id: 'weapon',
    name: '武器',
    icon: '⚔️',
    count: 420,
    subCategories: [
      { id: 'sword', name: '剑类', count: 85 },
      { id: 'staff', name: '法杖', count: 90 },
      { id: 'bow', name: '弓箭', count: 75 },
      { id: 'axe', name: '斧头', count: 80 },
      { id: 'hammer', name: '锤子', count: 90 }
    ]
  },
  {
    id: 'pet',
    name: '宠物',
    icon: '🐾',
    count: 380,
    subCategories: [
      { id: 'common', name: '普通宠物', count: 150 },
      { id: 'rare', name: '稀有宠物', count: 120 },
      { id: 'legendary', name: '传说宠物', count: 110 }
    ]
  },
  {
    id: 'effect',
    name: '特效',
    icon: '✨',
    count: 250,
    subCategories: [
      { id: 'skill', name: '技能特效', count: 100 },
      { id: 'environment', name: '环境特效', count: 80 },
      { id: 'ui', name: 'UI特效', count: 70 }
    ]
  }
])

// 模拟素材数据生成
const generateMaterials = (category: string, subCategory: string, count: number): Material[] => {
  const materials: Material[] = []
  const icons = ['🖼️', '🎨', '🎭', '👑', '💎', '⭐', '🌟', '💫', '🔥', '❄️']
  
  for (let i = 1; i <= count; i++) {
    const id = `${category.toUpperCase()}_${String(i).padStart(4, '0')}`
    materials.push({
      id,
      name: `${subCategory}_素材_${i}`,
      icon: icons[Math.floor(Math.random() * icons.length)],
      category,
      subCategory,
      popular: Math.floor(Math.random() * 1000),
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return materials
}

// 生成所有素材数据
const allMaterials = ref<Material[]>([])

// 初始化素材数据
const initializeMaterials = () => {
  const materials: Material[] = []
  
  primaryCategories.value.forEach(category => {
    if (category.id === 'all') return
    
    if (category.subCategories.length > 0) {
      category.subCategories.forEach(subCategory => {
        materials.push(...generateMaterials(category.id, subCategory.id, subCategory.count))
      })
    } else {
      materials.push(...generateMaterials(category.id, 'default', category.count))
    }
  })
  
  allMaterials.value = materials
}

// 计算二级分类
const secondaryCategories = computed(() => {
  const category = primaryCategories.value.find(cat => cat.id === selectedPrimaryCategory.value)
  return category?.subCategories || []
})

// 过滤素材
const filteredMaterials = computed(() => {
  let materials = allMaterials.value
  
  // 按主分类过滤
  if (selectedPrimaryCategory.value !== 'all') {
    materials = materials.filter(m => m.category === selectedPrimaryCategory.value)
  }
  
  // 按二级分类过滤
  if (selectedSecondaryCategory.value !== 'all') {
    materials = materials.filter(m => m.subCategory === selectedSecondaryCategory.value)
  }
  
  // 按搜索关键词过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    materials = materials.filter(m => 
      m.id.toLowerCase().includes(keyword) || 
      m.name.toLowerCase().includes(keyword)
    )
  }
  
  // 排序
  materials.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'popular':
        return b.popular - a.popular
      default:
        return a.id.localeCompare(b.id)
    }
  })
  
  return materials
})

// 显示的素材（分页）
const displayMaterials = computed(() => {
  return filteredMaterials.value.slice(0, currentPage.value * pageSize)
})

// 总素材数
const totalMaterials = computed(() => filteredMaterials.value.length)

// 是否还有更多
const hasMore = computed(() => {
  return displayMaterials.value.length < totalMaterials.value
})

// 选择主分类
const selectPrimaryCategory = (categoryId: string) => {
  selectedPrimaryCategory.value = categoryId
  selectedSecondaryCategory.value = 'all'
  currentPage.value = 1
}

// 选择二级分类
const selectSecondaryCategory = (subCategoryId: string) => {
  selectedSecondaryCategory.value = subCategoryId
  currentPage.value = 1
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 处理排序
const handleSort = () => {
  currentPage.value = 1
}

// 加载更多素材
const loadMoreMaterials = async () => {
  loading.value = true
  
  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 800))
  
  currentPage.value++
  loading.value = false
}

// 复制素材编号
const copyMaterialId = async (material: Material) => {
  try {
    await navigator.clipboard.writeText(material.id)
    showCopyToast.value = true
    
    setTimeout(() => {
      showCopyToast.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = material.id
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    showCopyToast.value = true
    setTimeout(() => {
      showCopyToast.value = false
    }, 2000)
  }
}

// 监听分类变化，重置页码
watch([selectedPrimaryCategory, selectedSecondaryCategory], () => {
  currentPage.value = 1
})

// 页面加载
onMounted(() => {
  console.log('问道素材页面已加载')
  initializeMaterials()
  
  // 添加渐入动画
  setTimeout(() => {
    const cards = document.querySelectorAll('.material-card')
    cards.forEach((card: Element, index: number) => {
      const htmlCard = card as HTMLElement
      htmlCard.style.opacity = '0'
      htmlCard.style.transform = 'translateY(20px) scale(0.9)'
      
      setTimeout(() => {
        htmlCard.style.transition = 'all 0.4s ease'
        htmlCard.style.opacity = '1'
        htmlCard.style.transform = 'translateY(0) scale(1)'
      }, index * 50)
    })
  }, 300)
})
</script>

<style scoped>
.wendao-material {
  background: linear-gradient(135deg, 
    #2c3e50 0%,     /* 深蓝灰 */
    #34495e 25%,    /* 石板蓝 */ 
    #5d4e75 50%,    /* 丹青紫 */
    #8b7355 75%,    /* 古铜色 */
    #a0826d 100%    /* 暖褐色 */
  );
  padding: 40px 20px;
  position: relative;
  overflow-y: auto;
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 和 Edge */
}

.wendao-material::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.wendao-material::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%);
  pointer-events: none;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  z-index: 2;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef, #dee2e6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.page-subtitle {
  font-size: 1.2rem;
  color: rgba(255,255,255,0.8);
  font-weight: 300;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.category-filter {
  margin-bottom: 40px;
}

.primary-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.category-btn {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 25px;
  padding: 12px 20px;
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.category-btn:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-2px);
}

.category-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.category-count {
  font-size: 0.85rem;
  opacity: 0.8;
}

.secondary-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.sub-category-btn {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 8px 16px;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.sub-category-btn:hover {
  background: rgba(255,255,255,0.12);
  color: white;
}

.sub-category-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
}

.sub-category-count {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-left: 5px;
}

.search-sort-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 45px 12px 20px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 25px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: rgba(255,255,255,0.6);
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  background: rgba(255,255,255,0.15);
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.6);
  font-size: 1.2rem;
}

.sort-select {
  padding: 12px 20px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 25px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  color: white;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

.sort-select option {
  background: #2c3e50;
  color: white;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.material-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  position: relative;
}

.material-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  background: rgba(255,255,255,0.15);
}

.material-image {
  position: relative;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  overflow: hidden;
}

.image-placeholder {
  font-size: 3rem;
  opacity: 0.8;
}

.material-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.material-card:hover .material-overlay {
  opacity: 1;
}

.copy-hint {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

.material-info {
  padding: 15px;
  text-align: center;
}

.material-id {
  font-size: 1.1rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 5px;
}

.material-name {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: rgba(255,255,255,0.6);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: rgba(255,255,255,0.8);
}

.pagination-section {
  text-align: center;
  padding: 40px 0;
}

.pagination-info {
  color: rgba(255,255,255,0.7);
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.load-more-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.load-more-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.pagination-end {
  color: rgba(255,255,255,0.6);
  font-style: italic;
}

.copy-toast {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  opacity: 0;
  transition: all 0.4s ease;
  z-index: 1000;
}

.copy-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast-icon {
  font-size: 1.2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .primary-categories {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .category-btn {
    flex-shrink: 0;
  }
  
  .search-sort-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .materials-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .material-image {
    height: 120px;
  }
}
</style>
