import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { exec, execSync } from 'child_process'
import fs from 'fs'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
// 修复路径计算 - __dirname 在构建后指向 dist-electron 目录
process.env.DIST_ELECTRON = __dirname
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(__dirname, '../public')
  : process.env.DIST

// 路径配置已验证正确，移除调试输出

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = path.join(__dirname, 'preload.js')
const url = process.env.VITE_DEV_SERVER_URL || ''
const indexHtml = path.join(process.env.DIST || '', 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'QW Blog - Git管理工具',
    icon: path.join(process.env.VITE_PUBLIC || '', 'favicon.ico'),
    width: 1400,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload,
      // 使用安全的contextIsolation配置
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // 开发环境下禁用web安全，允许访问本地文件
    },
  })

  if (process.env.VITE_DEV_SERVER_URL && url) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Apply electron-updater
  // update(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

// Git related IPC handlers
// 选择文件夹
ipcMain.handle('select-directory', async () => {
  try {
    const result = await dialog.showOpenDialog(win!, {
      properties: ['openDirectory'],
      title: '选择Git仓库文件夹'
    })
    
    if (!result.canceled && result.filePaths.length > 0) {
      return { success: true, path: result.filePaths[0] }
    }
    return { success: false, error: '未选择文件夹' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// 执行Git命令
ipcMain.handle('execute-git-command', async (_, command: string, cwd: string) => {
  return new Promise((resolve) => {
    exec(command, { 
      cwd, 
      encoding: 'utf8',
      env: { ...process.env, LC_ALL: 'C.UTF-8' }
    }, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, error: error.message, stderr })
      } else {
        resolve({ success: true, stdout, stderr })
      }
    })
  })
})

// 检查路径是否是Git仓库
ipcMain.handle('check-git-repo', async (_, repoPath: string) => {
  try {
    const gitPath = path.join(repoPath, '.git')
    const exists = fs.existsSync(gitPath)
    return { success: true, isRepo: exists }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// 读取文件内容
ipcMain.handle('read-file', async (_, filePath: string) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return { success: true, content }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// 写入文件内容
ipcMain.handle('write-file', async (_, filePath: string, content: string) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})
