<template>
  <aside class="w-1/4 max-w-[300px] overflow-y-auto pl-6 pr-2 scrollbar-hide" style="height:100%; border-left:1px solid var(--color-border);">
    <!-- Tags section -->
    <div class="mb-8">
      <h3 class="text-base font-semibold mb-4">标签</h3>
      <div class="flex flex-wrap gap-2">
        <n-tag v-for="tag in tags" :key="tag" class="cursor-pointer">{{ tag }}</n-tag>
      </div>
    </div>

    <!-- Featured section -->
    <div class="mb-8">
      <h3 class="text-base font-semibold mb-4">精选文章</h3>
      <div v-for="post in featured" :key="post.id" class="flex items-start mb-4 pb-4 border-b border-gray-100 last:mb-0 last:pb-0 last:border-none">
        <img :src="post.coverImage" class="w-16 h-16 object-cover rounded mr-3" />
        <div class="flex-1">
          <h4 class="text-sm leading-snug mb-1 line-clamp-2">{{ post.title }}</h4>
          <div class="text-xs text-gray-400">{{ formatDate(post.date) }}</div>
        </div>
      </div>
    </div>

    <!-- Ad section -->
    <div>
      <h3 class="text-sm text-gray-400 mb-3 text-center">赞助广告</h3>
      <div class="w-full h-40 bg-gray-100 flex items-center justify-center rounded text-gray-400">广告位</div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { mockTags } from '@/mock/tags'
import { mockPosts } from '@/mock/posts'

const tags = mockTags
const featured = mockPosts.slice(0, 4)

function formatDate(dateStr: string) {
  return useDateFormat(dateStr, 'YYYY年MM月DD日').value
}
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style> 