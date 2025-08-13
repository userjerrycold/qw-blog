<template>
  <aside :class="['sidebar', { 'sidebar-collapsed': collapsed }]">
    <div class="profile">
      <img :src="avatar" alt="avatar" />
      <div class="profile-info">
        <h1>薯条</h1>
        <p>开发者</p>
      </div>
    </div>

    <n-menu
      :collapsed="collapsed"
      :options="menuOptions"
      :value="activeKey"
      @update:value="handleUpdate"
      :theme-overrides="menuThemeOverrides"
      class="menu"
    />

    <!-- collapse button -->
    <button class="collapse-btn" @click="toggle">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6L8 10L12 14" stroke="#0D0D0D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { h, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import avatar from '@/assets/avatar1.png'
import blogSvg from '@/assets/blog.svg'
import toolsSvg from '@/assets/tools.svg'
import docsSvg from '@/assets/docs.svg'
import serverSvg from '@/assets/server.svg'
import beiwangluSvg from '@/assets/beiwanglu.svg'
import questionSvg from '@/assets/question.svg'
import wendaoSvg from '@/assets/wendao.svg'
import recipeSvg from '@/assets/recipe.svg'
import gitSvg from '@/assets/git.svg'
import gbitsSvg from '@/assets/gbits.svg'

const collapsed = ref(false)

watch(collapsed, (val) => {
  document.body.classList.toggle('sidebar-collapsed', val)
})

const router = useRouter()
const route = useRoute()

const menuOptions: MenuOption[] = [
  {
    label: '服务模拟',
    key: '/mock',
    icon: () => h('img', { src: serverSvg, class: 'w-4 h-4' }),
  },
  {
    label: '文档管理',
    key: '/docs',
    icon: () => h('img', { src: docsSvg, class: 'w-4 h-4' }),
  },
  {
    label: 'GIT 管理',
    key: '/git',
    icon: () => h('img', { src: gitSvg, class: 'w-4 h-4' }),
  },
  {
    label: 'GBITS 解析',
    key: '/gbits',
    icon: () => h('img', { src: gbitsSvg, class: 'w-4 h-4' }),
  },
  {
    label: '备忘录',
    key: '/memo',
    icon: () => h('img', { src: beiwangluSvg, class: 'w-4 h-4' }),
  },
  {
    label: '菜谱',
    key: '/recipe',
    icon: () => h('img', { src: recipeSvg, class: 'w-4 h-4' }),
  },
  {
    label: '动态题集',
    key: '/quiz',
    icon: () => h('img', { src: questionSvg, class: 'w-4 h-4' }),
  },
  {
    label: '工具',
    key: '/tools',
    icon: () => h('img', { src: toolsSvg, class: 'w-4 h-4' }),
  },
  {
    label: '问道',
    key: '/wendao',
    icon: () => h('img', { src: wendaoSvg, class: 'w-4 h-4' }),
  },
  // 隐藏博客菜单，保留代码但不显示
  /*
  {
    label: '博客',
    key: '/blog',
    icon: () => h('img', { src: blogSvg, class: 'w-4 h-4' }),
  },
  */
]

const menuThemeOverrides = {
  itemColorActive: '#f5f5f5',
  itemColorActiveHover: '#f5f5f5',
  itemTextColorActive: '#333',
  itemIconColorActive: '#333',
  itemTextColorActiveHover: '#333',
  itemIconColorActiveHover: '#333',
}

const activeKey = computed(() => {
  if (route.path.startsWith('/wendao')) return '/wendao'
  if (route.path.startsWith('/tools')) return '/tools'
  if (route.path.startsWith('/docs')) return '/docs'
  if (route.path.startsWith('/git')) return '/git'
  if (route.path.startsWith('/gbits')) return '/gbits'
  if (route.path.startsWith('/mock')) return '/mock'
  if (route.path.startsWith('/memo')) return '/memo'
  if (route.path.startsWith('/recipe')) return '/recipe'
  if (route.path.startsWith('/quiz')) return '/quiz'
  return '/blog'
})

function handleUpdate(key: string) {
  router.push(key)
}

function toggle() {
  collapsed.value = !collapsed.value
}

defineExpose({})
</script>

<script lang="ts">
export default {
  name: 'AppSidebar'
}
</script>

<style scoped>
.sidebar {
  width: 190px;
  background-color: var(--color-bg);
  position: fixed;
  top: 20px;
  bottom: 20px;
  left: 20px;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
}
.sidebar-collapsed {
  width: 50px;
}
.profile {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}
.profile img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 8px;
}
.profile-info h1 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}
.profile-info p {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
}
.menu {
  flex: 1;
}

.collapse-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  background: var(--color-bg);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.sidebar.sidebar-collapsed .collapse-btn svg {
  transform: rotate(180deg);
}
.sidebar.sidebar-collapsed .profile-info {
  display: none;
}
.menu :deep(.n-menu-item.n-menu-item--selected) {
  background-color: #f5f5f5 !important;
  color: #333;
}
</style> 