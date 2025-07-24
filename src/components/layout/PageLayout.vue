<template>
  <div class="p-[30px] flex gap-[30px] h-full overflow-hidden" style="max-width: 100vw;">
    <!-- 主内容区域：占77.8%宽度 -->
    <div class="flex-[7] overflow-y-auto pr-2 scrollbar-hide min-w-0">
      <slot />
    </div>
    
    <template v-if="!hideSidebar">
      <div class="hidden lg:block flex-[2] overflow-y-auto scrollbar-hide w-full sidebar-content" style="min-width: 280px; max-height: calc(100vh - 60px); border-left:1px solid var(--color-border);">
        <!-- 支持两种方式：1. 命名插槽 2. 通过props传递组件 -->
        <slot name="rightSidebar">
          <component v-if="rightSidebar" :is="rightSidebar" v-bind="rightSidebarProps" v-on="rightSidebarEvents" />
        </slot>
      </div>
    </template>
    <template v-else>
      <!-- 占位 -->
      <div class="hidden lg:flex flex-[2] items-stretch"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ 
  hideSidebar?: boolean,
  rightSidebar?: any,
  rightSidebarProps?: any
}>()

const emit = defineEmits(['submit'])

// 向上传递rightSidebar中的事件
const rightSidebarEvents = {
  submit: (val: any) => emit('submit', val)
}

// 默认值
const { hideSidebar = false, rightSidebarProps = {} } = props
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

.sidebar-content {
  padding-left: 24px;
}
</style> 