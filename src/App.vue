<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-layout has-sider class="h-screen">
      <AppSidebar />
      <n-layout>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { darkTheme } from 'naive-ui'
import AppSidebar from './components/layout/AppSidebar.vue'

const theme = ref(null) // 可通过 Pinia 切换 darkTheme
const themeOverrides = {
  common: {
    primaryColor: '#f56a47',
  },
}
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