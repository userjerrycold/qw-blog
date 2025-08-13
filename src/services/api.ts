import axios from 'axios'

// 检测是否在 Electron 环境中
const isElectron = () => {
  // 详细调试信息
  console.log('🔍 [API Debug] 详细环境检测:')
  console.log('  - window存在:', typeof window !== 'undefined')
  console.log('  - window.electronAPI:', !!(typeof window !== 'undefined' && window.electronAPI))
  console.log('  - window.require:', !!(typeof window !== 'undefined' && (window as any).require))
  console.log('  - navigator.userAgent:', typeof navigator !== 'undefined' ? navigator.userAgent : 'undefined')
  console.log('  - userAgent包含Electron:', typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron'))
  console.log('  - process.env.ELECTRON:', typeof process !== 'undefined' ? process.env.ELECTRON : 'undefined')
  console.log('  - window全部属性:', typeof window !== 'undefined' ? Object.keys(window).filter(key => key.toLowerCase().includes('electron')) : [])
  
  // 检查多个 Electron 环境标识
  const result = !!(
    (typeof window !== 'undefined' && window.electronAPI) ||
    (typeof window !== 'undefined' && (window as any).require) ||
    (typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron')) ||
    (typeof process !== 'undefined' && process.env.ELECTRON === 'true')
  )
  
  console.log('  - 最终检测结果:', result)
  return result
}

// 根据环境设置不同的 baseURL1
const getBaseURL = () => {
  if (isElectron()) {
    // Electron 环境下直接使用后端服务器地址
    console.log('🚀 Electron环境检测到，直接连接后端:', 'http://localhost:9090')
    return 'http://localhost:9090'
  }
  // Web 环境下使用代理
  console.log('🌐 Web环境检测到，使用代理:', '/api')
  return '/api'
}

const http = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
})

// 请求拦截器 - 自动添加JWT Token
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理token过期等情况
http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储并跳转到登录页
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('tokenExpires')
      
      // 如果不在登录页，则跳转到登录页
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

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

// Git命令接口类型
export interface GitSubCommand {
  id?: number;
  subCommandContent: string;
  sequenceNumber: number;
  description?: string;
}

export interface GitCommand {
  id: number;
  commandName: string;
  commandContent: string;
  description?: string;
  categoryCode: number;
  categoryName?: string;
  usageScenario?: string;
  isFavorite: boolean;
  isComposite: boolean;
  subCommands?: GitSubCommand[];
  executionCount: number;
  author: string;
  createDt: string;
  updateDt: string;
}

// Git命令搜索参数
export interface GitCommandSearchParams {
  username: string;
  categoryCode?: number;
  keyword?: string;
  isFavorite?: boolean;
  isComposite?: boolean;
  page?: number;
  pageSize?: number;
}

// Git子命令创建参数
export interface GitSubCommandCreateParams {
  subCommandContent: string;
  sequenceNumber: number;
  description?: string;
}

// Git子命令更新参数
export interface GitSubCommandUpdateParams {
  id?: number;
  subCommandContent: string;
  sequenceNumber: number;
  description?: string;
}

// Git命令创建参数
export interface GitCommandCreateParams {
  commandName: string;
  commandContent: string;
  description?: string;
  categoryCode: number;
  usageScenario?: string;
  isFavorite?: boolean;
  isComposite?: boolean;
  subCommands?: GitSubCommandCreateParams[];
  author: string;
}

// Git命令更新参数
export interface GitCommandUpdateParams {
  id: number;
  commandName: string;
  commandContent: string;
  description?: string;
  categoryCode: number;
  usageScenario?: string;
  isFavorite: boolean;
  isComposite: boolean;
  subCommands?: GitSubCommandUpdateParams[];
}

// 分类统计接口
export interface CategoryStat {
  categoryCode: number;
  categoryName: string;
  count: number;
}

// 常用命令统计
export interface MostUsedCommand {
  id: number;
  commandName: string;
  commandContent: string;
  executionCount: number;
  isComposite: boolean;
}

// 最近添加命令
export interface RecentCommand {
  id: number;
  commandName: string;
  createDt: string;
  isComposite: boolean;
}

// Git命令统计响应接口
export interface GitCommandStatistics {
  total: number;
  favoriteCount: number;
  compositeCount: number;
  mostUsedCommands: MostUsedCommand[];
  categoryDistribution: CategoryStat[];
  recentlyAddedCommands: RecentCommand[];
}

// 登录认证接口类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  gender?: number;
  birthday?: string;
  emailVerified: boolean;
  lastLoginTime?: string;
  loginCount?: number;
  status?: boolean;
  createDt: string;
  updateDt?: string;
}

// 令牌信息接口
export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
  deviceType?: string;
  deviceId?: string;
}

// 登录响应数据
export interface LoginResponse {
  user: User;
  token: TokenInfo;
}

// 注册请求参数
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  deviceType?: string;
  deviceId?: string;
}

// 发送验证码请求参数
export interface SendVerificationCodeParams {
  email: string;
  verificationType: number; // 1-注册验证 2-密码重置 3-登录验证
}

// 发送验证码响应
export interface SendCodeResponse {
  email: string;
  expireTime: string;
  sendCount: number;
  maxSendCount: number;
}

// 验证码验证请求参数
export interface VerifyCodeParams {
  email: string;
  verificationCode: string;
  verificationType: number;
}

// 验证码验证响应
export interface VerifyCodeResponse {
  verified: boolean;
  resetToken?: string;
  expiresIn?: number;
}

// 密码重置请求参数
export interface ResetPasswordParams {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

// 重置密码响应
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// 刷新令牌参数
export interface RefreshTokenParams {
  refreshToken: string;
}

// 登出参数
export interface LogoutParams {
  logoutAll?: boolean;
}

// 社交登录请求参数
export interface SocialLoginParams {
  provider: 'google' | 'github' | 'wechat';
  code: string;
  redirectUri?: string;
}

// 用户资料更新参数
export interface UpdateProfileParams {
  id: number;
  username?: string;
  email?: string;
  nickname?: string;
  avatar?: string;
}

// 密码修改参数
export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 用户统计信息
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  registrationTrend: {
    date: string;
    count: number;
  }[];
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

// Git命令API
// 搜索Git命令
export function searchGitCommands(params: GitCommandSearchParams) {
  return http.post<ApiResponse<{
    list: GitCommand[];
    total: number;
    page: number;
    pageSize: number;
  }>>('/git/search', params);
}

// 创建Git命令
export function createGitCommand(params: GitCommandCreateParams) {
  return http.post<ApiResponse<{ id: number }>>('/git/create', params);
}

// 更新Git命令
export function updateGitCommand(params: GitCommandUpdateParams) {
  return http.post<ApiResponse<boolean>>('/git/update', params);
}

// 删除Git命令
export function deleteGitCommand(id: number) {
  return http.post<ApiResponse<boolean>>('/git/delete', { id });
}

// 获取Git命令统计
export function getGitCommandStatistics(username: string) {
  return http.post<ApiResponse<GitCommandStatistics>>('/git/statistics', { username });
}

// 切换收藏状态
export function toggleGitCommandFavorite(id: number, isFavorite: boolean) {
  return http.post<ApiResponse<boolean>>('/git/toggleFavorite', { id, isFavorite });
}

// 记录命令执行
export function recordGitCommandExecution(id: number) {
  return http.post<ApiResponse<{ executionCount: number }>>('/git/recordExecution', { id });
}

// 登录认证API函数

// 用户登录
export function login(params: LoginParams) {
  return http.post<ApiResponse<LoginResponse>>('/auth/login', params);
}

// 用户注册
export function register(params: RegisterParams) {
  return http.post<ApiResponse<LoginResponse>>('/auth/register', params);
}

// 发送验证码
export function sendVerificationCode(params: SendVerificationCodeParams) {
  return http.post<ApiResponse<SendCodeResponse>>('/auth/sendVerificationCode', params);
}

// 验证验证码
export function verifyCode(params: VerifyCodeParams) {
  return http.post<ApiResponse<VerifyCodeResponse>>('/auth/verifyCode', params);
}

// 重置密码
export function resetPassword(params: ResetPasswordParams) {
  return http.post<ApiResponse<ResetPasswordResponse>>('/auth/resetPassword', params);
}

// 社交登录
export function socialLogin(params: SocialLoginParams) {
  return http.post<ApiResponse<LoginResponse>>('/auth/social-login', params);
}

// 刷新Token
export function refreshToken(params: RefreshTokenParams) {
  return http.post<ApiResponse<{ token: TokenInfo }>>('/auth/refresh-token', params);
}

// 用户退出登录
export function logout(params: LogoutParams) {
  return http.post<ApiResponse<{ message: string }>>('/auth/logout', params);
}

// 获取当前用户信息
export function getCurrentUser() {
  return http.get<ApiResponse<User>>('/auth/profile');
}

// 更新用户资料
export function updateProfile(params: UpdateProfileParams) {
  return http.put<ApiResponse<User>>('/auth/profile', params);
}

// 修改密码
export function changePassword(params: ChangePasswordParams) {
  return http.post<ApiResponse<{ message: string }>>('/auth/change-password', params);
}

// 检查用户名是否可用
export function checkUsernameAvailable(username: string) {
  return http.get<ApiResponse<{ available: boolean }>>('/auth/check-username', {
    params: { username }
  });
}

// 检查邮箱是否可用
export function checkEmailAvailable(email: string) {
  return http.get<ApiResponse<{ available: boolean }>>('/auth/check-email', {
    params: { email }
  });
}

// 获取用户统计信息（管理员功能）
export function getUserStatistics() {
  return http.get<ApiResponse<UserStatistics>>('/auth/statistics');
}

// 上传头像
export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('avatar', file);
  return http.post<ApiResponse<{ url: string }>>('/auth/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 获取用户信息
export function getUserInfo() {
  return http.get<ApiResponse<User>>('/auth/userInfo');
}

export default http