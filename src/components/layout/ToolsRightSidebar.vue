<template>
  <aside class="tools-sidebar overflow-y-auto pl-4 pr-3 py-3 scrollbar-hide" style="height:100%; border-left:1px solid var(--color-border);">
    <!-- Tools Navigation -->
    <div class="mb-6">
      <h3 class="text-base font-semibold mb-3">工具导航</h3>
      
      <!-- 开发工具分类 -->
      <div class="tool-category mb-3">
        <div class="category-header" @click="toggleCategory('dev')">
          <div class="flex items-center justify-between cursor-pointer py-2 px-3 hover:bg-gray-100 rounded">
            <span class="text-sm font-medium">开发工具</span>
            <svg :class="['w-4 h-4 transition-transform', categoryOpen.dev ? 'transform rotate-180' : '']" 
                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="category-items" v-show="categoryOpen.dev">
          <router-link to="/tools/git" class="tool-link" active-class="active-tool">
            <svg class="tool-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M2.6,10.59L8.38,4.8L10.07,6.5C9.83,7.35 10.22,8.28 11,8.73V14.27C10.4,14.61 10,15.26 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16C14,15.26 13.6,14.61 13,14.27V9.41L15.07,11.5C15,11.65 15,11.82 15,12A2,2 0 0,0 17,14A2,2 0 0,0 19,12A2,2 0 0,0 17,10C16.82,10 16.65,10 16.5,10.07L13.93,7.5C14.19,6.57 13.71,5.55 12.78,5.16C12.35,5 11.9,4.96 11.5,5.07L9.8,3.38L10.59,2.6C11.37,1.81 12.63,1.81 13.41,2.6L21.4,10.59C22.19,11.37 22.19,12.63 21.4,13.41L13.41,21.4C12.63,22.19 11.37,22.19 10.59,21.4L2.6,13.41C1.81,12.63 1.81,11.37 2.6,10.59Z" />
            </svg>
            <span>Git 工具集</span>
          </router-link>
          <router-link to="/tools/maven" class="tool-link" active-class="active-tool">
            <svg class="tool-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M3.16 2c-.17 0-.34.05-.5.14C2.5 2.23 2.35 2.35 2.23 2.5s-.19.33-.19.5v18c0 .18.06.34.19.5.12.15.27.27.43.36.16.09.33.14.5.14h17.68c.17 0 .34-.05.5-.14.16-.09.31-.21.43-.36.13-.16.19-.32.19-.5V3c0-.17-.06-.35-.19-.5-.12-.15-.27-.27-.43-.36-.16-.09-.33-.14-.5-.14H3.16z"/>
            </svg>
            <span>Maven 工具</span>
          </router-link>
        </div>
      </div>
      
      <!-- 实用工具分类 -->
      <div class="tool-category mb-3">
        <div class="category-header" @click="toggleCategory('utils')">
          <div class="flex items-center justify-between cursor-pointer py-2 px-3 hover:bg-gray-100 rounded">
            <span class="text-sm font-medium">实用工具</span>
            <svg :class="['w-4 h-4 transition-transform', categoryOpen.utils ? 'transform rotate-180' : '']" 
                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="category-items" v-show="categoryOpen.utils">
          <router-link to="/tools/md5" class="tool-link" active-class="active-tool">
            <svg class="tool-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M17.8 17.8l-6.4 3.2l-6.4-3.2V6.9l6.4-3.2l6.4 3.2V17.8zM16 8.2l-4.5-2.3L7 8.2v7.1l4.5 2.3l4.5-2.3V8.2z"/>
            </svg>
            <span>MD5 加密工具</span>
          </router-link>
        </div>
      </div>
      
      <!-- 数据处理分类 -->
      <div class="tool-category mb-3">
        <div class="category-header" @click="toggleCategory('data')">
          <div class="flex items-center justify-between cursor-pointer py-2 px-3 hover:bg-gray-100 rounded">
            <span class="text-sm font-medium">数据处理</span>
            <svg :class="['w-4 h-4 transition-transform', categoryOpen.data ? 'transform rotate-180' : '']" 
                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="category-items" v-show="categoryOpen.data">
          <router-link to="/tools/json" class="tool-link" active-class="active-tool">
            <svg class="tool-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M5 3h2v2H5v5a2 2 0 0 1-2 2a2 2 0 0 1 2 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2m14 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2a2 2 0 0 1-2-2V5h-2V3h2m-7 12a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m-4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1Z" />
            </svg>
            <span>JSON 工具</span>
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Documentation section -->
    <div class="mb-5">
      <h3 class="text-base font-semibold mb-3">相关文档</h3>
      <div class="space-y-2">
        <a href="https://git-scm.com/doc" target="_blank" class="doc-link">
          <svg class="doc-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M2.6,10.59L8.38,4.8L10.07,6.5C9.83,7.35 10.22,8.28 11,8.73V14.27C10.4,14.61 10,15.26 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16C14,15.26 13.6,14.61 13,14.27V9.41L15.07,11.5C15,11.65 15,11.82 15,12A2,2 0 0,0 17,14A2,2 0 0,0 19,12A2,2 0 0,0 17,10C16.82,10 16.65,10 16.5,10.07L13.93,7.5C14.19,6.57 13.71,5.55 12.78,5.16C12.35,5 11.9,4.96 11.5,5.07L9.8,3.38L10.59,2.6C11.37,1.81 12.63,1.81 13.41,2.6L21.4,10.59C22.19,11.37 22.19,12.63 21.4,13.41L13.41,21.4C12.63,22.19 11.37,22.19 10.59,21.4L2.6,13.41C1.81,12.63 1.81,11.37 2.6,10.59Z" />
          </svg>
          <span>Git 文档</span>
        </a>

        <a href="https://maven.apache.org/guides/" target="_blank" class="doc-link">
          <svg class="doc-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M3.16 2c-.17 0-.34.05-.5.14C2.5 2.23 2.35 2.35 2.23 2.5s-.19.33-.19.5v18c0 .18.06.34.19.5.12.15.27.27.43.36.16.09.33.14.5.14h17.68c.17 0 .34-.05.5-.14.16-.09.31-.21.43-.36.13-.16.19-.32.19-.5V3c0-.17-.06-.35-.19-.5-.12-.15-.27-.27-.43-.36-.16-.09-.33-.14-.5-.14H3.16z"/>
          </svg>
          <span>Maven 文档</span>
        </a>

        <a href="https://www.json.org/" target="_blank" class="doc-link">
          <svg class="doc-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M5 3h2v2H5v5a2 2 0 0 1-2 2a2 2 0 0 1 2 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2m14 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2a2 2 0 0 1-2-2V5h-2V3h2m-7 12a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m-4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1Z" />
          </svg>
          <span>JSON 文档</span>
        </a>
      </div>
    </div>

    <!-- Search Tools -->
    <div class="mb-4">
      

      <div v-if="searchQuery && filteredTools.length > 0" class="mt-2 bg-white border border-gray-200 rounded shadow-sm py-1">
        <router-link
          v-for="tool in filteredTools"
          :key="tool.path"
          :to="tool.path"
          class="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 text-xs"
        >
          <span v-html="tool.icon" class="w-3 h-3"></span>
          <span>{{ tool.name }}</span>
        </router-link>
      </div>

      <div v-if="searchQuery && filteredTools.length === 0" class="mt-2 text-xs text-gray-500 px-2">
        没有找到相关工具
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 定义分类类型
type CategoryName = 'dev' | 'utils' | 'data'

// 工具分类展开状态
const categoryOpen = ref<Record<CategoryName, boolean>>({
  dev: true,
  utils: true,
  data: true
})

// 切换分类展开/折叠
const toggleCategory = (category: CategoryName) => {
  categoryOpen.value[category] = !categoryOpen.value[category]
}

// 工具搜索
const searchQuery = ref('')

// 工具列表
const tools = [
  {
    name: 'Git 工具集',
    path: '/tools/git',
    category: 'dev',
    keywords: ['git', '版本控制', '代码', '分支', 'commit'],
    icon: '<svg class="w-full h-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M2.6,10.59L8.38,4.8L10.07,6.5C9.83,7.35 10.22,8.28 11,8.73V14.27C10.4,14.61 10,15.26 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16C14,15.26 13.6,14.61 13,14.27V9.41L15.07,11.5C15,11.65 15,11.82 15,12A2,2 0 0,0 17,14A2,2 0 0,0 19,12A2,2 0 0,0 17,10C16.82,10 16.65,10 16.5,10.07L13.93,7.5C14.19,6.57 13.71,5.55 12.78,5.16C12.35,5 11.9,4.96 11.5,5.07L9.8,3.38L10.59,2.6C11.37,1.81 12.63,1.81 13.41,2.6L21.4,10.59C22.19,11.37 22.19,12.63 21.4,13.41L13.41,21.4C12.63,22.19 11.37,22.19 10.59,21.4L2.6,13.41C1.81,12.63 1.81,11.37 2.6,10.59Z" /></svg>'
  },
  {
    name: 'Maven 工具',
    path: '/tools/maven',
    category: 'dev',
    keywords: ['maven', 'java', '依赖', '构建', 'pom', '仓库'],
    icon: '<svg class="w-full h-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M3.16 2c-.17 0-.34.05-.5.14C2.5 2.23 2.35 2.35 2.23 2.5s-.19.33-.19.5v18c0 .18.06.34.19.5.12.15.27.27.43.36.16.09.33.14.5.14h17.68c.17 0 .34-.05.5-.14.16-.09.31-.21.43-.36.13-.16.19-.32.19-.5V3c0-.17-.06-.35-.19-.5-.12-.15-.27-.27-.43-.36-.16-.09-.33-.14-.5-.14H3.16z"/></svg>'
  },
  {
    name: 'MD5 加密工具',
    path: '/tools/md5',
    category: 'utils',
    keywords: ['md5', '加密', '哈希', 'hash', '密码'],
    icon: '<svg class="w-full h-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M17.8 17.8l-6.4 3.2l-6.4-3.2V6.9l6.4-3.2l6.4 3.2V17.8zM16 8.2l-4.5-2.3L7 8.2v7.1l4.5 2.3l4.5-2.3V8.2z"/></svg>'
  },
  {
    name: 'JSON 工具',
    path: '/tools/json',
    category: 'data',
    keywords: ['json', '格式化', '压缩', 'xml', '转换', '实体'],
    icon: '<svg class="w-full h-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M5 3h2v2H5v5a2 2 0 0 1-2 2a2 2 0 0 1 2 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2m14 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2a2 2 0 0 1-2-2V5h-2V3h2m-7 12a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m-4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1Z" /></svg>'
  }
]

// 搜索过滤工具
const filteredTools = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return tools.filter(tool => {
    return tool.name.toLowerCase().includes(query) || 
           tool.keywords.some(keyword => keyword.toLowerCase().includes(query))
  })
})
</script>

<style scoped>
.tool-category {
  margin-bottom: 0.5rem;
}

.category-items {
  padding-left: 0.5rem;
}

.tool-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  color: #333;
  text-decoration: none;
  font-size: 13px;
  transition: background-color 0.2s;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.tool-link:hover {
  background-color: #f0f4f8;
}

.tool-link.active-tool {
  background-color: #e6f0fa;
  color: #2563eb;
  font-weight: 500;
}

.tool-icon {
  width: 18px;
  height: 18px;
  color: #555;
  flex-shrink: 0;
}

.tip-card {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  background-color: #f7f7f7;
  border: 1px solid #eaeaea;
}

.tip-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.tip-content h4 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  margin-bottom: 3px;
}

.tip-content p {
  font-size: 12px;
  line-height: 1.3;
}

.doc-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  color: #333;
  text-decoration: none;
  font-size: 13px;
  transition: background-color 0.2s;
}

.doc-link:hover {
  background-color: #f0f4f8;
}

.doc-icon {
  width: 16px;
  height: 16px;
  color: #555;
  flex-shrink: 0;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.tools-sidebar {
  min-width: 180px;
  max-width: 300px;
}
</style> 