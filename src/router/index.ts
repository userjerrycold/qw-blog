import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 