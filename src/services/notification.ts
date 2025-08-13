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
    duration: 2000,
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
      content: 'Git仓库已加载',
      duration: 2000
    }),
    
    repoLoadSuccessDemo: () => notification.warning({
      title: '演示模式',
      content: '浏览器环境显示模拟数据',
      duration: 3000
    }),
    
    commitSuccess: () => notification.success({
      title: '提交成功',
      content: '代码已提交到本地仓库',
      duration: 2000
    }),
    
    pushSuccess: () => notification.success({
      title: '推送成功',
      content: '代码已推送到远程仓库',
      duration: 2000
    }),
    
    stageFileSuccess: (fileName: string) => notification.success({
      title: '暂存成功',
      content: `${fileName} 已添加到暂存区`,
      duration: 2000
    }),
    
    unstageFileSuccess: (fileName: string) => notification.success({
      title: '取消暂存',
      content: `${fileName} 已移出暂存区`,
      duration: 2000
    }),
    
    discardSuccess: (fileName: string) => notification.success({
      title: '撤销成功',
      content: `${fileName} 已恢复到上次提交`,
      duration: 2000
    }),
    
    // 错误通知
    repoLoadError: (error: string) => notification.error({
      title: '加载失败',
      content: error,
      duration: 3000
    }),
    
    commitError: (error: string) => notification.error({
      title: '提交失败',
      content: error,
      duration: 3000
    }),
    
    pushError: (error: string) => notification.error({
      title: '推送失败',
      content: error,
      duration: 3000
    })
  }
}
