// Electron API 类型声明

export interface ElectronAPI {
  // 文件夹选择
  selectDirectory: () => Promise<{
    success: boolean
    path?: string
    error?: string
  }>
  
  // 执行Git命令
  executeGitCommand: (command: string, cwd: string) => Promise<{
    success: boolean
    stdout?: string
    stderr?: string
    error?: string
  }>
  
  // 检查Git仓库
  checkGitRepo: (repoPath: string) => Promise<{
    success: boolean
    isRepo?: boolean
    error?: string
  }>
  
  // 文件操作
  readFile: (filePath: string) => Promise<{
    success: boolean
    content?: string
    error?: string
  }>
  
  writeFile: (filePath: string, content: string) => Promise<{
    success: boolean
    error?: string
  }>
  
  // 打开新窗口
  openWin: (arg: string) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
    ipcRenderer: {
      on: (channel: string, listener: (...args: any[]) => void) => void
      off: (channel: string, ...args: any[]) => void
      send: (channel: string, ...args: any[]) => void
      invoke: (channel: string, ...args: any[]) => Promise<any>
    }
  }
}
