<template>
  <PageLayout>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">探索文章</h1>
      <n-button-group size="small">
        <n-button :type="viewMode === 'board' ? 'primary' : 'default'" @click="viewMode = 'board'">看板</n-button>
        <n-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">列表</n-button>
      </n-button-group>
    </div>

    <n-spin :show="loading">
      <!-- Board View -->
      <n-grid v-if="viewMode === 'board'" :cols="2" x-gap="24" y-gap="24">
        <n-grid-item v-for="post in posts" :key="post.id">
          <n-card :hoverable="true" class="overflow-hidden p-0">
            <div class="relative">
              <img :src="post.coverImage" class="w-full h-52 object-cover" />
              <span class="absolute left-3 top-3 bg-white/90 px-2 py-1 text-xs rounded">{{ formatDate(post.date) }}</span>
            </div>
            <div class="p-4">
              <div class="text-xs text-brand uppercase font-medium mb-2">{{ post.author }}</div>
              <h3 class="text-lg font-semibold mb-2">{{ post.title }}</h3>
              <p class="text-gray-500 text-sm mb-3 line-clamp-3">{{ post.excerpt }}</p>
              <n-tag round>{{ post.tag }}</n-tag>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>

      <!-- List View -->
      <div v-else class="space-y-5">
        <n-card v-for="post in posts" :key="post.id" :hoverable="true" class="flex h-56 p-0 overflow-hidden">
          <img :src="post.coverImage" class="w-64 h-full object-cover" />
          <div class="flex-1 p-5 flex flex-col">
            <div class="flex justify-between items-start">
              <div>
                <div class="text-xs text-brand uppercase font-medium mb-1">{{ post.author }}</div>
                <h3 class="text-lg font-semibold">{{ post.title }}</h3>
              </div>
              <span class="text-xs text-gray-400">{{ formatDate(post.date) }}</span>
            </div>
            <p class="text-gray-500 text-sm mt-2 line-clamp-2">{{ post.excerpt }}</p>
            <n-tag round class="mt-auto self-start">{{ post.tag }}</n-tag>
          </div>
        </n-card>
      </div>

      <!-- 分页 -->
      <div class="mt-8 flex justify-center">
        <n-pagination v-model:page="page" :page-size="pageSize" :item-count="total" @update:page="handlePageChange" />
      </div>
    </n-spin>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePostStore } from '@/store/post'
import { storeToRefs } from 'pinia'
import { useDateFormat } from '@vueuse/core'
import { mockPosts } from '@/mock/posts'
// @ts-ignore
import PageLayout from '@/components/layout/PageLayout.vue'

const viewMode = ref<'board' | 'list'>('board')
const postStore = usePostStore()
const { posts, loading, total, page, pageSize } = storeToRefs(postStore)
const { loadPosts } = postStore

onMounted(async () => {
  try {
    await loadPosts()
    if (posts.value.length === 0) {
      // 使用本地 mock 数据
      posts.value = mockPosts
      total.value = mockPosts.length
    }
  } catch (err) {
    // 网络错误直接使用 mock
    posts.value = mockPosts
    total.value = mockPosts.length
  }
})

function handlePageChange(p: number) {
  loadPosts({ page: p })
}

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
.line-clamp-3 {
  overflow: hidden;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style> 