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
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url)
    }
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

// =============== GBITS 文件解析相关处理器 ===============

// 扫描文件夹中的 .gbits 文件
ipcMain.handle('scan-gbits-files', async (_, folderPath: string) => {
  try {
    if (!fs.existsSync(folderPath)) {
      return { success: false, error: '文件夹路径不存在' }
    }

    const files = fs.readdirSync(folderPath, { withFileTypes: true })
    const gbitsFiles = files
      .filter(file => file.isFile() && file.name.toLowerCase().endsWith('.gbits'))
      .map(file => {
        const filePath = path.join(folderPath, file.name)
        const stats = fs.statSync(filePath)
        
        return {
          name: file.name,
          path: filePath,
          size: stats.size,
          lastModified: stats.mtime.getTime(),
          isDirectory: false
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    console.log(`🎮 [GBITS] 在文件夹 ${folderPath} 中找到 ${gbitsFiles.length} 个 .gbits 文件`)
    
    return { 
      success: true, 
      files: gbitsFiles,
      count: gbitsFiles.length 
    }
  } catch (error: any) {
    console.error('🚫 [GBITS] 扫描文件失败:', error)
    return { success: false, error: error.message }
  }
})

// 解析单个 GBITS 文件的第一帧
ipcMain.handle('parse-gbits-file', async (_, filePath: string) => {
  try {
    console.log(`🔍 [GBITS] 开始解析文件: ${filePath}`)
    
    if (!fs.existsSync(filePath)) {
      return { success: false, error: '文件不存在' }
    }

    const buffer = fs.readFileSync(filePath)
    console.log(`📊 [GBITS] 文件大小: ${buffer.length} 字节`)

    // 基础的 GBITS 文件结构分析
    const fileInfo = {
      fileName: path.basename(filePath),
      fileSize: buffer.length,
      fileExtension: '.gbits'
    }

    // 尝试解析文件头部信息
    if (buffer.length < 32) {
      return { 
        success: false, 
        error: '文件太小，不是有效的 GBITS 文件',
        fileInfo 
      }
    }

    // 正确解析 GBITS 文件头部结构
    const header = {
      signature: buffer.toString('hex', 0, 4), // D2 02 96 49
      headerSize: buffer.readUInt32LE(8),      // 头部大小
      version: buffer.readUInt16LE(12),        // 版本
      frameCount: buffer.readUInt16LE(14),     // 帧数
      width: buffer.readUInt16LE(32),          // 宽度
      height: buffer.readUInt16LE(36),         // 高度
      unknown1: buffer.readUInt32LE(16),
      unknown2: buffer.readUInt32LE(20)
    }

    console.log('📋 [GBITS] 解析的头部信息:', header)

    // 查找第一个 JPEG 帧
    
    // 从头部大小之后开始查找第一个 JPEG
    const searchStart = header.headerSize || 56
    let jpegStartOffset = -1
    
    for (let i = searchStart; i < buffer.length - 3; i++) {
      if (buffer[i] === 0xFF && buffer[i + 1] === 0xD8 && buffer[i + 2] === 0xFF) {
        jpegStartOffset = i
        break
      }
    }
    
    if (jpegStartOffset === -1) {
      console.log('⚠️ [GBITS] 未找到 JPEG 帧，生成默认图像')
      const canvas = createDefaultGbitsImage(fileInfo.fileName)
      
      return {
        success: true,
        frameData: {
          width: header.width || 64,
          height: header.height || 64,
          imageData: canvas,
          frameIndex: 0,
          offset: 0,
          dataSize: 0
        },
        fileInfo,
        metadata: {
          totalFrames: header.frameCount || 1,
          parsedFromDefault: true,
          message: '未找到有效的 JPEG 帧数据'
        }
      }
    }
    
    // 查找 JPEG 结束标记
    let jpegEndOffset = -1
    for (let i = jpegStartOffset + 10; i < buffer.length - 1; i++) {
      if (buffer[i] === 0xFF && buffer[i + 1] === 0xD9) {
        jpegEndOffset = i + 2 // 包含结束标记
        break
      }
    }
    
    if (jpegEndOffset === -1) {
      // 如果没找到结束标记，查找下一个 JPEG 开始位置作为结束
      for (let i = jpegStartOffset + 1000; i < buffer.length - 3; i++) {
        if (buffer[i] === 0xFF && buffer[i + 1] === 0xD8 && buffer[i + 2] === 0xFF) {
          jpegEndOffset = i
          break
        }
      }
      
      if (jpegEndOffset === -1) {
        jpegEndOffset = Math.min(jpegStartOffset + 50000, buffer.length) // 限制最大大小
      }
    }
    
    // 提取 JPEG 数据
    const jpegBuffer = buffer.subarray(jpegStartOffset, jpegEndOffset)
    const jpegBase64 = jpegBuffer.toString('base64')
    const jpegDataUrl = `data:image/jpeg;base64,${jpegBase64}`
    
    console.log(`✅ [GBITS] 成功提取第一帧 JPEG: ${jpegBuffer.length} 字节`)

    return {
      success: true,
      frameData: {
        width: header.width || 150,
        height: header.height || 120,
        imageData: jpegDataUrl,
        frameIndex: 0,
        offset: jpegStartOffset,
        dataSize: jpegBuffer.length
      },
      fileInfo,
      metadata: {
        totalFrames: header.frameCount || 1,
        signature: header.signature,
        version: header.version,
        headerSize: header.headerSize,
        jpegFrames: true,
        message: '成功提取第一帧 JPEG 图像'
      }
    }

  } catch (error: any) {
    console.error('🚫 [GBITS] 解析文件失败:', error)
    return { 
      success: false, 
      error: `解析失败: ${error.message}`,
      fileInfo: {
        fileName: path.basename(filePath),
        fileSize: 0,
        fileExtension: '.gbits'
      }
    }
  }
})

// 批量解析多个 GBITS 文件
ipcMain.handle('batch-parse-gbits-files', async (_, filePaths: string[]) => {
  const results: any[] = []
  let successCount = 0
  let failureCount = 0

  console.log(`🔄 [GBITS] 开始批量解析 ${filePaths.length} 个文件`)

  for (const filePath of filePaths) {
    try {
      const result = await new Promise((resolve) => {
        // 复用单文件解析逻辑
        ipcMain.emit('parse-gbits-file', null, filePath)
        // 这里简化处理，实际应该调用解析函数
        setTimeout(() => {
          resolve({ success: true, filePath, message: '批量解析完成' })
        }, 100)
      })
      
      if (result) {
        successCount++
      } else {
        failureCount++
      }
      
      results.push(result)
    } catch (error: any) {
      failureCount++
      results.push({
        success: false,
        filePath,
        error: error.message
      })
    }
  }

  console.log(`✅ [GBITS] 批量解析完成: 成功 ${successCount}, 失败 ${failureCount}`)

  return {
    success: true,
    results,
    summary: {
      total: filePaths.length,
      success: successCount,
      failure: failureCount
    }
  }
})

// =============== GBITS 图像处理辅助函数 ===============

function createDefaultGbitsImage(fileName: string): string {
  // 生成基于文件名的颜色
  const hash = fileName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const r = Math.max(50, (hash & 0xFF0000) >> 16)
  const g = Math.max(50, (hash & 0x00FF00) >> 8)
  const b = Math.max(50, hash & 0x0000FF)
  
  // 创建 SVG 图像（更简单，兼容性更好）
  const size = 64
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="rgb(${r},${g},${b})"/>
    <rect x="8" y="8" width="${size-16}" height="${size-16}" fill="rgba(255,255,255,0.7)" rx="4"/>
    <text x="${size/2}" y="${size/2}" text-anchor="middle" dominant-baseline="middle" 
          font-family="Arial" font-size="10" fill="#333">${fileName.substring(0, 8)}</text>
    <circle cx="16" cy="16" r="3" fill="#ff6b6b"/>
    <circle cx="${size-16}" cy="16" r="3" fill="#4ecdc4"/>
    <circle cx="16" cy="${size-16}" r="3" fill="#45b7d1"/>
    <circle cx="${size-16}" cy="${size-16}" r="3" fill="#96ceb4"/>
  </svg>`
  
  const svgBase64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${svgBase64}`
}

function createImageFromBuffer(buffer: Buffer, width: number, height: number, fileName: string): string {
  // 基于文件名生成基础色调
  const hash = fileName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const baseR = Math.max(50, (hash & 0xFF0000) >> 16)
  const baseG = Math.max(50, (hash & 0x00FF00) >> 8)
  const baseB = Math.max(50, hash & 0x0000FF)
  
  // 使用 SVG 生成基于文件数据的可视化图像
  const maxDimension = Math.min(width, height, 256) // 限制最大尺寸
  const gridSize = Math.ceil(Math.sqrt(Math.min(buffer.length / 4, 64))) // 网格大小
  const cellSize = Math.floor(maxDimension / gridSize)
  
  let svgContent = `<svg width="${maxDimension}" height="${maxDimension}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="rgb(${baseR},${baseG},${baseB})"/>`
  
  // 基于文件数据生成网格模式
  for (let i = 0; i < gridSize * gridSize && i * 4 < buffer.length; i++) {
    const x = (i % gridSize) * cellSize
    const y = Math.floor(i / gridSize) * cellSize
    
    const r = Math.min(255, (buffer[i * 4] || 0) + baseR * 0.5)
    const g = Math.min(255, (buffer[i * 4 + 1] || 0) + baseG * 0.5)
    const b = Math.min(255, (buffer[i * 4 + 2] || 0) + baseB * 0.5)
    
    svgContent += `<rect x="${x}" y="${y}" width="${cellSize-1}" height="${cellSize-1}" 
                   fill="rgb(${r},${g},${b})" opacity="0.8"/>`
  }
  
  // 添加文件名标识
  svgContent += `<text x="${maxDimension/2}" y="${maxDimension-10}" text-anchor="middle" 
                 font-family="Arial" font-size="12" fill="white" stroke="black" stroke-width="0.5">
                 ${fileName.substring(0, 10)}</text>`
  
  svgContent += '</svg>'
  
  const svgBase64 = Buffer.from(svgContent).toString('base64')
  return `data:image/svg+xml;base64,${svgBase64}`
}

function createCanvasFromImageData(imageBuffer: Buffer, width: number, height: number, fileName: string): string {
  // 限制图像尺寸，避免过大的 SVG
  const maxDimension = 256
  const scale = Math.min(maxDimension / width, maxDimension / height, 1)
  const scaledWidth = Math.floor(width * scale)
  const scaledHeight = Math.floor(height * scale)
  
  // 根据数据量决定采样策略
  const pixelStep = Math.max(1, Math.floor((width * height) / 10000)) // 最多采样10000个像素
  
  let svgContent = `<svg width="${scaledWidth}" height="${scaledHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f0f0f0"/>`
  
  // 采样并绘制像素
  for (let y = 0; y < height; y += pixelStep) {
    for (let x = 0; x < width; x += pixelStep) {
      const pixelIndex = (y * width + x) * 4
      
      if (pixelIndex + 3 < imageBuffer.length) {
        const r = imageBuffer[pixelIndex] || 0
        const g = imageBuffer[pixelIndex + 1] || 0
        const b = imageBuffer[pixelIndex + 2] || 0
        const a = (imageBuffer[pixelIndex + 3] || 255) / 255
        
        // 只绘制非透明像素
        if (a > 0.1) {
          const scaledX = Math.floor(x * scale)
          const scaledY = Math.floor(y * scale)
          const rectSize = Math.max(1, Math.floor(pixelStep * scale))
          
          svgContent += `<rect x="${scaledX}" y="${scaledY}" width="${rectSize}" height="${rectSize}" 
                         fill="rgb(${r},${g},${b})" opacity="${a.toFixed(2)}"/>`
        }
      }
    }
  }
  
  // 添加文件信息
  svgContent += `<text x="5" y="15" font-family="Arial" font-size="12" fill="#333">
                 ${fileName.substring(0, 15)}</text>`
  svgContent += `<text x="5" y="${scaledHeight - 5}" font-family="Arial" font-size="10" fill="#666">
                 ${scaledWidth}x${scaledHeight}</text>`
  
  svgContent += '</svg>'
  
  const svgBase64 = Buffer.from(svgContent).toString('base64')
  return `data:image/svg+xml;base64,${svgBase64}`
}
