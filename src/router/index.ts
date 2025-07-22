import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/blog',
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
  // 以下路由暂未实现
  /* 
  {
    path: '/tools/prompts',
    component: () => import('@/pages/tools/prompts/AIPrompts.vue'),
  },
  {
    path: '/tools/format',
    component: () => import('@/pages/tools/format/JsonXmlTools.vue'),
  },
  {
    path: '/tools/maven',
    component: () => import('@/pages/tools/java/MavenTools.vue'),
  },
  {
    path: '/tools/spring',
    component: () => import('@/pages/tools/java/SpringTools.vue'),
  },
  {
    path: '/tools/regex',
    component: () => import('@/pages/tools/utils/RegexTester.vue'),
  },
  {
    path: '/tools/sql',
    component: () => import('@/pages/tools/data/SqlFormatter.vue'),
  },
  */
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 