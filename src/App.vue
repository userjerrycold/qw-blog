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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { darkTheme } from 'naive-ui'
import AppSidebar from './components/layout/AppSidebar.vue'

const route = useRoute()
const theme = ref(null)
const themeOverrides = {
  common: {
    primaryColor: '#f56a47',
  },
}

// 判断是否为登录页面
const isLoginPage = computed(() => {
  return route.path === '/login'
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