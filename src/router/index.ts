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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 