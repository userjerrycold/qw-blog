import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

export interface Post {
  id: number
  title: string
  excerpt: string
  author: string
  coverImage: string
  date: string
  tag: string
}

export interface Pagination<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export function fetchPosts(params: { page?: number; pageSize?: number; tag?: string }) {
  return http.get<Pagination<Post>>('/posts', { params })
}

export function fetchPostById(id: number) {
  return http.get<Post>(`/posts/${id}`)
}

export function fetchTags() {
  return http.get<string[]>('/tags')
}

export default http 