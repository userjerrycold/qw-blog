<template>
  <n-layout-sider
    :collapsed="collapsed"
    collapsible
    bordered
    @collapse="collapsed = !collapsed"
  >
    <div class="flex items-center justify-center py-4">
      <img src="/avatar1.png" class="w-10 h-10 rounded-full" />
      <h1 v-if="!collapsed" class="ml-2 text-sm font-medium">Leo Johns</h1>
    </div>
    <n-menu
      :collapsed="collapsed"
      :options="menuOptions"
      :value="activeKey"
      @update:value="handleUpdate"
    />
  </n-layout-sider>
</template>

<script setup lang="ts">
import { h, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MenuOption } from 'naive-ui'

const collapsed = ref(false)
const router = useRouter()
const route = useRoute()

const menuOptions: MenuOption[] = [
  {
    label: '博客',
    key: '/blog',
    icon: () => h('i', { class: 'i-tabler-article' }),
  },
  {
    label: '工具',
    key: '/tools',
    icon: () => h('i', { class: 'i-tabler-tool' }),
  },
]

const activeKey = computed(() => {
  return route.path.startsWith('/tools') ? '/tools' : '/blog'
})

function handleUpdate(key: string) {
  router.push(key)
}
</script> 