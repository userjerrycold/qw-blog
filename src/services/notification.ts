import type { NotificationType } from 'naive-ui'
import { useNotification } from 'naive-ui'

// 通知配置
interface NotificationConfig {
  title?: string
  content: string
  meta?: string
  duration?: number
  keepAliveOnHover?: boolean
}

// 统一的通知方法
function notify(notification: any, type: NotificationType, config: string | NotificationConfig): void {
  const options = typeof config === 'string' 
    ? { content: config }
    : config

  // 设置默认值
  const finalOptions = {
    duration: 3000,
    keepAliveOnHover: true,
    ...options
  }

  notification[type](finalOptions)
}

// 组合式API：使用全局通知
export function useGlobalNotification() {
  const notification = useNotification()
  
  return {
    info: (config: string | NotificationConfig) => notify(notification, 'info', config),
    success: (config: string | NotificationConfig) => notify(notification, 'success', config),
    warning: (config: string | NotificationConfig) => notify(notification, 'warning', config),
    error: (config: string | NotificationConfig) => notify(notification, 'error', config)
  }
}

// 预设的Git操作通知 - 需要传入notification实例
export function useGitNotifications() {
  const notification = useGlobalNotification()
  
  return {
    repoLoadSuccess: () => notification.success({
      title: '仓库加载成功',
      content: 'Git仓库已成功加载',
      meta: '可以开始进行版本控制操作'
    }),
    
    repoLoadSuccessDemo: () => notification.warning({
      title: '仓库加载成功（演示模式）',
      content: '浏览器环境下显示模拟数据',
      meta: '要使用真实Git功能请在Electron环境下运行',
      duration: 5000
    }),
    
    commitSuccess: () => notification.success({
      title: '提交成功',
      content: '代码变更已成功提交到本地仓库',
      meta: '可以选择推送到远程仓库'
    }),
    
    pushSuccess: () => notification.success({
      title: '推送成功',
      content: '代码已成功推送到远程仓库',
      meta: '团队成员现在可以获取到最新代码'
    }),
    
    stageFileSuccess: (fileName: string) => notification.success({
      title: '文件已暂存',
      content: `已添加到暂存区: ${fileName}`,
      meta: '可以进行提交操作'
    }),
    
    unstageFileSuccess: (fileName: string) => notification.success({
      title: '取消暂存',
      content: `已从暂存区移除: ${fileName}`,
      meta: '文件回到工作区状态'
    }),
    
    discardSuccess: (fileName: string) => notification.success({
      title: '撤销更改成功',
      content: `已撤销文件更改: ${fileName}`,
      meta: '文件恢复到上次提交状态'
    }),
    
    // 错误通知
    repoLoadError: (error: string) => notification.error({
      title: '仓库加载失败',
      content: error,
      meta: '请检查路径是否正确或仓库是否存在',
      duration: 5000
    }),
    
    commitError: (error: string) => notification.error({
      title: '提交失败',
      content: error,
      meta: '请检查提交信息或文件状态',
      duration: 5000
    }),
    
    pushError: (error: string) => notification.error({
      title: '推送失败',
      content: error,
      meta: '请检查网络连接或远程仓库权限',
      duration: 5000
    })
  }
}
