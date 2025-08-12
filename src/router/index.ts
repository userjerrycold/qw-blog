import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('@/pages/auth/LoginPage.vue'),
  },
  {
    path: '/blog',
    component: () => import('@/pages/blog/BlogList.vue'),
  },
  {
    path: '/tools',
    component: () => import('@/pages/tools/ToolsHome.vue'),
  },
  {
    path: '/tools/git',
    component: () => import('@/pages/tools/git/GitTools.vue'),
  },
  {
    path: '/tools/maven',
    component: () => import('@/pages/tools/maven/MavenTools.vue'),
  },
  {
    path: '/tools/md5',
    component: () => import('@/pages/tools/crypto/Md5Tools.vue'),
  },
  {
    path: '/tools/json',
    component: () => import('@/pages/tools/format/JsonTools.vue'),
  },
  {
    path: '/tools/sql',
    component: () => import('@/pages/tools/format/SqlTools.vue'),
  },
  {
    path: '/tools/java-gen',
    component: () => import('@/pages/tools/java/JavaGenerator.vue'),
  },
  {
    path: '/docs',
    component: () => import('@/pages/docs/DocsHome.vue'),
  },
  {
    path: '/mock',
    component: () => import('@/pages/mock/MockService.vue'),
  },
  {
    path: '/memo',
    component: () => import('@/pages/memo/MemoHome.vue'),
  },
  {
    path: '/quiz',
    component: () => import('@/pages/quiz/QuizHome.vue'),
  },
  {
    path: '/wendao',
    component: () => import('@/pages/wendao/WendaoHome.vue'),
  },
  {
    path: '/wendao/build',
    component: () => import('@/pages/wendao/WendaoBuild.vue'),
  },
  {
    path: '/wendao/assist',
    component: () => import('@/pages/wendao/WendaoAssist.vue'),
  },
  {
    path: '/wendao/material',
    component: () => import('@/pages/wendao/WendaoMaterial.vue'),
  },
  {
    path: '/recipe',
    component: () => import('@/pages/recipe/RecipeHome.vue'),
  },
  {
    path: '/git',
    component: () => import('@/pages/git/GitHome.vue'),
  },
]

// 检测是否在 Electron 环境中
const isElectron = typeof window !== 'undefined' && (
  window.location.protocol === 'file:' || 
  navigator.userAgent.includes('Electron') ||
  (window as any).electronAPI ||
  (window as any).require
)

const router = createRouter({
  // 在 Electron 中使用 hash 模式，在浏览器中使用 history 模式
  history: isElectron ? createWebHashHistory() : createWebHistory(),
  routes,
})

export default router 