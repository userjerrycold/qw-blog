<template>
  <div class="p-[30px] flex gap-[30px] h-full overflow-hidden" style="max-width: 100vw;">
    <!-- 主内容区域：占77.8%宽度 -->
    <div class="flex-[7] overflow-y-auto pr-2 scrollbar-hide min-w-0">
      <slot />
    </div>
    <template v-if="!hideSidebar">
      <component :is="rightSidebar" v-if="rightSidebar" class="hidden lg:block flex-[2] overflow-hidden w-full" style="max-width: 300px;" />
      <RightSidebar v-else class="hidden lg:block flex-[2] overflow-hidden w-full" style="max-width: 300px;" />
    </template>
    <template v-else>
      <!-- 分隔线 + 占位 -->
      <div class="hidden lg:flex flex-[2] items-stretch">
        <div class="w-[1px] bg-gray-200" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
// @ts-ignore
import RightSidebar from '@/components/layout/RightSidebar.vue'

const { hideSidebar = false, rightSidebar = null } = defineProps<{ 
  hideSidebar?: boolean,
  rightSidebar?: any
}>()
</script>

<script lang="ts">
export default {
  name: 'PageLayout'
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style> 