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

// 备忘录接口类型
export interface Memo {
  id: number;
  title: string;
  content: string;
  tagCode: number;
  tagName?: string;
  isTodo: boolean;
  dueDate: string | null;
  completed: boolean;
  author: string;
  createDt: string;
  updateDt: string;
}

// 备忘录搜索参数
export interface MemoSearchParams {
  username: string;
  tagCode?: number;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

// 备忘录创建参数
export interface MemoCreateParams {
  title: string;
  content?: string;
  tagCode: number;
  isTodo: boolean;
  dueDate?: string;
  author: string;
}

// 备忘录更新参数
export interface MemoUpdateParams {
  id: number;
  title: string;
  content?: string;
  tagCode: number;
  isTodo: boolean;
  dueDate?: string;
  completed?: boolean;
}

// 标签统计接口
export interface TagStat {
  tagCode: number;
  tagName: string;
  count: number;
}

// 日期统计接口
export interface DateStat {
  date: string;
  count: number;
}

// 备忘录统计响应接口
export interface MemoStatistics {
  total: number;
  todoCount: number;
  completedCount: number;
  todayTodoCount: number;
  tagDistribution: TagStat[];
  dueDateDistribution: DateStat[];
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

// 备忘录API
// 搜索备忘录
export function searchMemos(params: MemoSearchParams) {
  return http.post<ApiResponse<{
    code: number;
    data: Memo[];
    msg: string;
    page: number;
    size: number;
    total: number;
  }>>('/memo/search', params);
}

// 创建备忘录
export function createMemo(params: MemoCreateParams) {
  return http.post<ApiResponse<{ id: number }>>('/memo/create', params);
}

// 更新备忘录
export function updateMemo(params: MemoUpdateParams) {
  return http.post<ApiResponse<boolean>>('/memo/update', params);
}

// 删除备忘录
export function deleteMemo(id: number) {
  return http.post<ApiResponse<boolean>>('/memo/delete', { id });
}

// 获取备忘录统计
export function getMemoStatistics(username: string) {
  return http.post<ApiResponse<{
    code: number;
    data: MemoStatistics;
    msg: string;
  }>>('/memo/statistics', { username });
}

// 切换待办状态
export function toggleMemoStatus(id: number, completed: boolean) {
  return http.post<ApiResponse<boolean>>('/memo/toggleStatus', { id, completed });
}

export default http 