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
              <keep-alive :include="['GitHome', 'ToolsHome', 'DocsHome', 'MockService', 'MemoHome', 'QuizHome', 'WendaoHome', 'RecipeHome', 'BlogList']">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </main>
      </template>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { darkTheme } from 'naive-ui'
import AppSidebar from './components/layout/AppSidebar.vue'

const route = useRoute()
const router = useRouter()
const theme = ref(null)

const themeOverrides = {
  common: {
    primaryColor: '#f56a47',
  },
}

// 直接根据路由判断是否为登录页面
const isLoginPage = computed(() => {
  return route.path === '/login'
})

// 控制body的CSS类
const updateBodyClass = (isLogin: boolean) => {
  if (isLogin) {
    document.body.className = 'login-mode'
  } else {
    document.body.className = 'app-mode'
  }
}

// 监听路由变化，同步更新body类
watch(isLoginPage, (isLogin) => {
  updateBodyClass(isLogin)
}, { immediate: true })

// 路由守卫 - 在更早的时机设置body类
router.beforeResolve((to) => {
  updateBodyClass(to.path === '/login')
})

onMounted(() => {
  // 确保初始状态正确
  updateBodyClass(isLoginPage.value)
  
  // 等待组件完全渲染后隐藏loading
  setTimeout(() => {
    const loadingElement = document.getElementById('app-loading')
    if (loadingElement) {
      loadingElement.classList.add('hidden')
      // 完全移除loading元素
      setTimeout(() => {
        loadingElement.remove()
      }, 500)
    }
  }, 800) // 适当延迟确保组件完全加载
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