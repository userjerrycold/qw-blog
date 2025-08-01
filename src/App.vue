<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <!-- 登录页面全屏显示，不显示侧边栏 -->
      <template v-if="isLoginPage">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </template>
      <!-- 其他页面显示正常布局 -->
      <template v-else>
        <AppSidebar />
        <main class="main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </template>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { darkTheme } from 'naive-ui'
import AppSidebar from './components/layout/AppSidebar.vue'

const route = useRoute()
const theme = ref(null)
const appInitialized = ref(false)

const themeOverrides = {
  common: {
    primaryColor: '#f56a47',
  },
}

// 判断是否为登录页面 - 初始化时默认为true避免闪烁
const isLoginPage = computed(() => {
  // 应用未初始化时，默认显示登录页面布局避免闪烁
  if (!appInitialized.value) return true
  return route.path === '/login'
})

// 应用初始化完成
onMounted(() => {
  // 使用微任务确保路由已经解析完成
  Promise.resolve().then(() => {
    appInitialized.value = true
  })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 