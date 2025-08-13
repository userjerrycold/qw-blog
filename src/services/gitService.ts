// Git服务API模块
// 处理所有Git相关操作，支持中文汉字不乱码

export interface GitFile {
  path: string
  name: string
  relativePath: string
  status: 'MODIFIED' | 'ADDED' | 'DELETED' | 'UNTRACKED' | 'STAGED'
  staged: boolean
}

export interface GitRepo {
  path: string
  currentBranch: string
  lastCommit?: {
    hash: string
    message: string
    author: string
    date: number
  }
  remotes: string[]
}

export interface GitCommit {
  hash: string
  message: string
  author: string
  date: number
  files: string[]
}

export interface GitStatus {
  files: GitFile[]
  branch: string
  ahead: number
  behind: number
}

class GitService {
  private isElectronEnv(): boolean {
    // 统一使用与GitHome.vue相同的检测逻辑
    const hasElectronAPI = typeof window !== 'undefined' && (window as any).electronAPI
    
    // 调试信息
    console.log('🔧 [GitService Debug] Electron环境检测:')
    console.log('  - window对象存在:', typeof window !== 'undefined')
    console.log('  - electronAPI存在:', !!(window as any).electronAPI)
    console.log('  - electronAPI内容:', (window as any).electronAPI)
    console.log('  - 最终判断结果:', hasElectronAPI)
    
    return hasElectronAPI
  }

  // 检查路径是否为有效的Git仓库
  private async isValidGitRepo(path: string): Promise<boolean> {
    try {
      if (this.isElectronEnv()) {
        const result = await (window as any).electronAPI.checkGitRepo(path)
        return result.success && result.isRepo
      } else {
        // 浏览器环境中的简单检查
        return path.trim().length > 0 && !path.includes('invalid')
      }
    } catch (error) {
      return false
    }
  }

  // 执行Git命令的通用方法
  async executeGitCommand(command: string, cwd: string): Promise<string> {
    if (this.isElectronEnv()) {
      // 在Electron环境中，使用IPC调用主进程执行Git命令
      try {
        const result = await (window as any).electronAPI.executeGitCommand(command, cwd)
        if (result.success) {
          return result.stdout || ''
        } else {
          throw new Error(result.error || 'Git命令执行失败')
        }
      } catch (error: any) {
        throw new Error(`Git命令执行失败: ${error.message}`)
      }
    } else {
      // 在浏览器环境中，返回模拟数据
      return this.getMockCommandResult(command, cwd)
    }
  }

  // 模拟Git命令结果（浏览器环境演示用）
  private getMockCommandResult(command: string, cwd: string): string {
    // 注意：这是浏览器环境下的演示数据
    console.warn(`[Git Service] 浏览器环境下使用模拟数据: ${command}`)
    
    if (command.includes('status --porcelain')) {
      return `M  src/components/TestComponent.vue
A  src/pages/新建页面.vue
D  删除的文件.txt
?? 未跟踪文件.js`
    }
    
    if (command.includes('branch --show-current')) {
      return 'main'
    }
    
    if (command.includes('log --oneline')) {
      return `abc1234 feat: 添加新功能支持中文
def5678 fix: 修复bug和中文编码问题
ghi9012 docs: 更新文档说明`
    }
    
    if (command.includes('remote -v')) {
      return `origin  https://github.com/user/repo.git (fetch)
origin  https://github.com/user/repo.git (push)`
    }
    
    if (command.includes('diff')) {
      return `--- a/src/components/TestComponent.vue
+++ b/src/components/TestComponent.vue
@@ -1,5 +1,7 @@
 <template>
   <div class="test-component">
-    <h1>测试组件</h1>
+    <h1>测试组件 - 已修改</h1>
+    <p>新增内容支持中文</p>
   </div>
 </template>`
    }
    
    return ''
  }

  // 加载Git仓库
  async loadRepository(path: string): Promise<GitRepo> {
    try {
      const isValid = await this.isValidGitRepo(path)
      if (!isValid) {
        throw new Error('指定路径不是有效的Git仓库')
      }

      // 在浏览器环境下显示警告
      if (!this.isElectronEnv()) {
        console.warn('[Git Service] 当前在浏览器环境下运行，显示的是演示数据而非真实Git仓库信息')
      }

      const currentBranch = await this.executeGitCommand('git branch --show-current', path)
      const remoteOutput = await this.executeGitCommand('git remote -v', path)
      
      // 解析远程仓库
      const remotes = remoteOutput
        .split('\n')
        .filter(line => line.includes('(fetch)'))
        .map(line => line.split('\t')[0])
        .filter(Boolean)

      // 获取最后一次提交
      let lastCommit
      try {
        const logOutput = await this.executeGitCommand('git log -1 --pretty=format:"%H|%s|%an|%ct"', path)
        if (logOutput) {
          const [hash, message, author, timestamp] = logOutput.split('|')
          lastCommit = {
            hash,
            message,
            author,
            date: parseInt(timestamp) * 1000
          }
        }
      } catch (error) {
        // 如果没有提交历史，忽略错误
      }

      // 在浏览器环境下使用演示数据
      if (!this.isElectronEnv()) {
        return {
          path: `${path.trim()} (演示模式)`,
          currentBranch: currentBranch.trim(),
          lastCommit: {
            hash: 'abc1234',
            message: '这是演示数据 - 浏览器环境无法读取真实Git信息',
            author: 'Demo User',
            date: Date.now() - 3600000 // 1小时前
          },
          remotes
        }
      }

      return {
        path: path.trim(),
        currentBranch: currentBranch.trim(),
        lastCommit,
        remotes
      }
    } catch (error: any) {
      if (!this.isElectronEnv()) {
        throw new Error(`浏览器环境限制: ${error.message}。要使用真实Git功能，请在Electron环境下运行此应用。`)
      }
      throw new Error(`加载仓库失败: ${error.message}`)
    }
  }

  // 获取Git状态
  async getStatus(repoPath: string): Promise<GitStatus> {
    try {
      const statusOutput = await this.executeGitCommand('git status --porcelain -u', repoPath)
      const branchOutput = await this.executeGitCommand('git branch --show-current', repoPath)
      
      const files: GitFile[] = []
      
      if (statusOutput.trim()) {
        const lines = statusOutput.split('\n').filter(line => line.trim())
        
        for (const line of lines) {
          const statusCode = line.substring(0, 2)
          const filePath = line.substring(3)
          
          // 解析文件状态
          let status: GitFile['status']
          let staged = false
          
          if (statusCode.startsWith('M')) {
            status = 'MODIFIED'
            staged = statusCode[0] === 'M'
          } else if (statusCode.startsWith('A')) {
            status = 'ADDED'
            staged = true
          } else if (statusCode.startsWith('D')) {
            status = 'DELETED'
            staged = statusCode[0] === 'D'
          } else if (statusCode.startsWith('??')) {
            status = 'UNTRACKED'
            staged = false
          } else {
            status = 'MODIFIED'
            staged = false
          }
          
          const fileName = filePath.split('/').pop() || filePath
          
          files.push({
            path: filePath,
            name: fileName,
            relativePath: filePath,
            status,
            staged
          })
        }
      }

      return {
        files,
        branch: branchOutput.trim(),
        ahead: 0,
        behind: 0
      }
    } catch (error: any) {
      throw new Error(`获取Git状态失败: ${error.message}`)
    }
  }

  // 获取最近提交历史
  async getRecentCommits(repoPath: string, count: number = 10): Promise<GitCommit[]> {
    try {
      const logOutput = await this.executeGitCommand(
        `git log -${count} --pretty=format:"%H|%s|%an|%ct" --name-only`,
        repoPath
      )
      
      const commits: GitCommit[] = []
      const blocks = logOutput.split('\n\n').filter(block => block.trim())
      
      for (const block of blocks) {
        const lines = block.split('\n')
        if (lines.length === 0) continue
        
        const [hash, message, author, timestamp] = lines[0].split('|')
        const files = lines.slice(1).filter(line => line.trim())
        
        commits.push({
          hash,
          message,
          author,
          date: parseInt(timestamp) * 1000,
          files
        })
      }
      
      return commits
    } catch (error: any) {
      throw new Error(`获取提交历史失败: ${error.message}`)
    }
  }

  // 获取文件差异
  async getDiff(repoPath: string, filePath: string): Promise<string> {
    try {
      const diffOutput = await this.executeGitCommand(
        `git diff HEAD -- "${filePath}"`,
        repoPath
      )
      
      return diffOutput || '没有差异内容'
    } catch (error: any) {
      throw new Error(`获取文件差异失败: ${error.message}`)
    }
  }

  // 获取两个提交之间的差异
  async getCommitDiff(repoPath: string, commitHash: string, previousCommitHash?: string): Promise<{
    files: Array<{
      path: string
      name: string
      status: 'MODIFIED' | 'ADDED' | 'DELETED'
      diff: string
      additions: number
      deletions: number
    }>
  }> {
    try {
      // 如果没有上一次提交，则与空树比较
      const compareWith = previousCommitHash || '4b825dc642cb6eb9a060e54bf8d69288fbee4904' // Git空树hash
      
      // 获取文件变更列表
      const nameStatusOutput = await this.executeGitCommand(
        `git diff --name-status ${compareWith} ${commitHash}`,
        repoPath
      )
      
      const files = []
      
      if (nameStatusOutput.trim()) {
        const lines = nameStatusOutput.split('\n').filter(line => line.trim())
        
        for (const line of lines) {
          const parts = line.split('\t')
          if (parts.length < 2) continue
          
          const statusCode = parts[0]
          const filePath = parts[1]
          const fileName = filePath.split('/').pop() || filePath
          
          // 解析状态
          let status: 'MODIFIED' | 'ADDED' | 'DELETED'
          if (statusCode === 'A') status = 'ADDED'
          else if (statusCode === 'D') status = 'DELETED'
          else status = 'MODIFIED'
          
          // 获取该文件的具体差异
          const fileDiff = await this.executeGitCommand(
            `git diff ${compareWith} ${commitHash} -- "${filePath}"`,
            repoPath
          )
          
          // 统计增删行数
          let additions = 0
          let deletions = 0
          
          if (fileDiff) {
            const diffLines = fileDiff.split('\n')
            for (const diffLine of diffLines) {
              if (diffLine.startsWith('+') && !diffLine.startsWith('+++')) {
                additions++
              } else if (diffLine.startsWith('-') && !diffLine.startsWith('---')) {
                deletions++
              }
            }
          }
          
          files.push({
            path: filePath,
            name: fileName,
            status,
            diff: fileDiff || '无法获取差异内容',
            additions,
            deletions
          })
        }
      }
      
      return { files }
    } catch (error: any) {
      throw new Error(`获取提交差异失败: ${error.message}`)
    }
  }

  // 暂存文件
  async stageFile(repoPath: string, filePath: string): Promise<void> {
    try {
      await this.executeGitCommand(`git add "${filePath}"`, repoPath)
    } catch (error: any) {
      throw new Error(`暂存文件失败: ${error.message}`)
    }
  }

  // 取消暂存文件
  async unstageFile(repoPath: string, filePath: string): Promise<void> {
    try {
      await this.executeGitCommand(`git reset HEAD "${filePath}"`, repoPath)
    } catch (error: any) {
      throw new Error(`取消暂存失败: ${error.message}`)
    }
  }

  // 暂存所有文件
  async stageAll(repoPath: string): Promise<void> {
    try {
      await this.executeGitCommand('git add .', repoPath)
    } catch (error: any) {
      throw new Error(`暂存所有文件失败: ${error.message}`)
    }
  }

  // 撤销文件更改
  async discardChanges(repoPath: string, filePath: string): Promise<void> {
    try {
      await this.executeGitCommand(`git checkout -- "${filePath}"`, repoPath)
    } catch (error: any) {
      throw new Error(`撤销更改失败: ${error.message}`)
    }
  }

  // 提交更改
  async commit(repoPath: string, message: string): Promise<void> {
    try {
      // 确保提交信息支持中文
      const escapedMessage = message.replace(/"/g, '\\"')
      await this.executeGitCommand(`git commit -m "${escapedMessage}"`, repoPath)
    } catch (error: any) {
      throw new Error(`提交失败: ${error.message}`)
    }
  }

  // 推送到远程仓库
  async push(repoPath: string, remote: string = 'origin', branch?: string): Promise<void> {
    try {
      const currentBranch = branch || await this.executeGitCommand('git branch --show-current', repoPath)
      await this.executeGitCommand(`git push ${remote} ${currentBranch.trim()}`, repoPath)
    } catch (error: any) {
      throw new Error(`推送失败: ${error.message}`)
    }
  }

  // 从远程仓库拉取
  async pull(repoPath: string, remote: string = 'origin', branch?: string): Promise<void> {
    try {
      const currentBranch = branch || await this.executeGitCommand('git branch --show-current', repoPath)
      await this.executeGitCommand(`git pull ${remote} ${currentBranch.trim()}`, repoPath)
    } catch (error: any) {
      throw new Error(`拉取失败: ${error.message}`)
    }
  }

  // 获取远程更新
  async fetch(repoPath: string, remote: string = 'origin'): Promise<void> {
    try {
      await this.executeGitCommand(`git fetch ${remote}`, repoPath)
    } catch (error: any) {
      throw new Error(`获取远程更新失败: ${error.message}`)
    }
  }

  // 创建新分支
  async createBranch(repoPath: string, branchName: string): Promise<void> {
    try {
      await this.executeGitCommand(`git checkout -b "${branchName}"`, repoPath)
    } catch (error: any) {
      throw new Error(`创建分支失败: ${error.message}`)
    }
  }

  // 切换分支
  async switchBranch(repoPath: string, branchName: string): Promise<void> {
    try {
      await this.executeGitCommand(`git checkout "${branchName}"`, repoPath)
    } catch (error: any) {
      throw new Error(`切换分支失败: ${error.message}`)
    }
  }

  // 获取所有分支
  async getBranches(repoPath: string): Promise<string[]> {
    try {
      const branchOutput = await this.executeGitCommand('git branch', repoPath)
      const branches = branchOutput
        .split('\n')
        .map(line => line.replace(/^\*?\s*/, '').trim())
        .filter(branch => branch.length > 0)
      
      return branches
    } catch (error: any) {
      throw new Error(`获取分支列表失败: ${error.message}`)
    }
  }

  // 获取远程分支
  async getRemoteBranches(repoPath: string): Promise<string[]> {
    try {
      const branchOutput = await this.executeGitCommand('git branch -r', repoPath)
      const branches = branchOutput
        .split('\n')
        .map(line => line.trim())
        .filter(branch => branch.length > 0 && !branch.includes('HEAD'))
        .map(branch => branch.replace(/^origin\//, ''))
      
      return branches
    } catch (error: any) {
      throw new Error(`获取远程分支失败: ${error.message}`)
    }
  }

  // 合并分支
  async mergeBranch(repoPath: string, branchName: string): Promise<void> {
    try {
      await this.executeGitCommand(`git merge "${branchName}"`, repoPath)
    } catch (error: any) {
      throw new Error(`合并分支失败: ${error.message}`)
    }
  }

  // 删除分支
  async deleteBranch(repoPath: string, branchName: string, force: boolean = false): Promise<void> {
    try {
      const flag = force ? '-D' : '-d'
      await this.executeGitCommand(`git branch ${flag} "${branchName}"`, repoPath)
    } catch (error: any) {
      throw new Error(`删除分支失败: ${error.message}`)
    }
  }

  // 标签操作
  async createTag(repoPath: string, tagName: string, message?: string): Promise<void> {
    try {
      const command = message 
        ? `git tag -a "${tagName}" -m "${message.replace(/"/g, '\\"')}"` 
        : `git tag "${tagName}"`
      await this.executeGitCommand(command, repoPath)
    } catch (error: any) {
      throw new Error(`创建标签失败: ${error.message}`)
    }
  }

  // 获取标签列表（按时间倒序）
  async getTags(repoPath: string): Promise<string[]> {
    try {
      const tagOutput = await this.executeGitCommand('git tag --sort=-creatordate', repoPath)
      return tagOutput.split('\n').filter(tag => tag.trim().length > 0)
    } catch (error: any) {
      throw new Error(`获取标签列表失败: ${error.message}`)
    }
  }

  // 获取标签简化信息（标签名+创建时间）- 性能优化版本
  async getTagsSimpleInfo(repoPath: string): Promise<Array<{
    name: string
    createTime: number
  }>> {
    try {
      // 使用一次性命令获取标签名称和创建时间，大幅提升性能
      const tagOutput = await this.executeGitCommand(
        'git for-each-ref refs/tags --sort=-creatordate --format="%(refname:short)|%(creatordate:unix)"',
        repoPath
      )
      
      const tagDetails = []
      const lines = tagOutput.split('\n').filter(line => line.trim().length > 0)
      
      for (const line of lines) {
        const [name, timestamp] = line.split('|')
        if (name && timestamp) {
          tagDetails.push({
            name: name.trim(),
            createTime: parseInt(timestamp) * 1000
          })
        }
      }
      
      return tagDetails
    } catch (error: any) {
      throw new Error(`获取标签信息失败: ${error.message}`)
    }
  }

  // 删除标签
  async deleteTag(repoPath: string, tagName: string): Promise<void> {
    try {
      await this.executeGitCommand(`git tag -d "${tagName}"`, repoPath)
    } catch (error: any) {
      throw new Error(`删除标签失败: ${error.message}`)
    }
  }

  // 重置到指定提交
  async reset(repoPath: string, commitHash: string, mode: 'soft' | 'mixed' | 'hard' = 'mixed'): Promise<void> {
    try {
      await this.executeGitCommand(`git reset --${mode} ${commitHash}`, repoPath)
    } catch (error: any) {
      throw new Error(`重置失败: ${error.message}`)
    }
  }

  // 获取配置信息
  async getConfig(repoPath: string, key?: string): Promise<string | Record<string, string>> {
    try {
      if (key) {
        const value = await this.executeGitCommand(`git config --get ${key}`, repoPath)
        return value.trim()
      } else {
        const configOutput = await this.executeGitCommand('git config --list', repoPath)
        const config: Record<string, string> = {}
        
        configOutput.split('\n').forEach(line => {
          const [key, value] = line.split('=')
          if (key && value) {
            config[key] = value
          }
        })
        
        return config
      }
    } catch (error: any) {
      throw new Error(`获取配置失败: ${error.message}`)
    }
  }

  // 设置配置
  async setConfig(repoPath: string, key: string, value: string, global: boolean = false): Promise<void> {
    try {
      const scope = global ? '--global' : '--local'
      await this.executeGitCommand(`git config ${scope} ${key} "${value}"`, repoPath)
    } catch (error: any) {
      throw new Error(`设置配置失败: ${error.message}`)
    }
  }

  // 清理工作目录
  async clean(repoPath: string, force: boolean = false, includeDirectories: boolean = false): Promise<void> {
    try {
      let flags = force ? '-f' : '-n'
      if (includeDirectories) flags += 'd'
      
      await this.executeGitCommand(`git clean ${flags}`, repoPath)
    } catch (error: any) {
      throw new Error(`清理失败: ${error.message}`)
    }
  }

  // 检查仓库完整性
  async checkIntegrity(repoPath: string): Promise<boolean> {
    try {
      await this.executeGitCommand('git fsck', repoPath)
      return true
    } catch (error) {
      return false
    }
  }

  // 获取仓库大小统计
  async getRepoStats(repoPath: string): Promise<{
    commitCount: number
    branchCount: number
    tagCount: number
    fileCount: number
  }> {
    try {
      const [commitOutput, branchOutput, tagOutput] = await Promise.all([
        this.executeGitCommand('git rev-list --count HEAD', repoPath).catch(() => '0'),
        this.executeGitCommand('git branch --list', repoPath).catch(() => ''),
        this.executeGitCommand('git tag', repoPath).catch(() => '')
      ])

      const statusOutput = await this.getStatus(repoPath)

      return {
        commitCount: parseInt(commitOutput.trim()) || 0,
        branchCount: branchOutput.split('\n').filter(b => b.trim()).length,
        tagCount: tagOutput.split('\n').filter(t => t.trim()).length,
        fileCount: statusOutput.files.length
      }
    } catch (error: any) {
      throw new Error(`获取仓库统计失败: ${error.message}`)
    }
  }
}

// 导出单例实例
export const gitService = new GitService()
export default gitService
