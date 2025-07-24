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

export interface Document {
  id: number
  name: string
  type: number
  url: string
  author: string
  status: boolean
  createDt: string
  updateDt: string
  typeStr: string
}

export interface DocumentSearchParams {
  username: string
  type: number
  fileUrl: string
  fileName: string
  id: number
}

export interface ApiResponse<T> {
  code: number
  data: T
  msg: string
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

// 文档管理API
export function searchDocuments(params: DocumentSearchParams) {
  return http.post<ApiResponse<Document[]>>('/myfile/search', params)
}

export function createDocument(document: Omit<Document, 'id' | 'createDt' | 'updateDt' | 'status' | 'typeStr'>) {
  return http.post<ApiResponse<boolean>>('/myfile/save', {
    username: document.author,
    type: document.type,
    fileUrl: document.url,
    fileName: document.name,
    id: 0
  })
}

export function updateDocument(document: Partial<Document>) {
  return http.post<ApiResponse<boolean>>('/myfile/save', {
    username: document.author,
    type: document.type,
    fileUrl: document.url,
    fileName: document.name,
    id: document.id
  })
}

export function deleteDocument(id: number) {
  return http.post<ApiResponse<boolean>>('/myfile/deleteById', { 
    username: 'qianhu',
    id: id
  })
}

export default http 