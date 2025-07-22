import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchPosts, Post } from '@/services/api'

export const usePostStore = defineStore('post', () => {
  const posts = ref<Post[]>([])
  const page = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const loading = ref(false)

  async function loadPosts(payload?: { page?: number; pageSize?: number; tag?: string }) {
    loading.value = true
    try {
      const { data } = await fetchPosts({
        page: payload?.page ?? page.value,
        pageSize: payload?.pageSize ?? pageSize.value,
        tag: payload?.tag,
      })
      posts.value = data.list
      total.value = data.total
      page.value = data.page
      pageSize.value = data.pageSize
    } finally {
      loading.value = false
    }
  }

  return { posts, page, pageSize, total, loading, loadPosts }
}) 