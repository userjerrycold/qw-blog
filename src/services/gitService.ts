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
    return typeof window !== 'undefined' && window.process?.type === 'renderer'
  }

  // 检查路径是否为有效的Git仓库
  private async isValidGitRepo(path: string): Promise<boolean> {
    try {
      // 在实际环境中，这里应该检查.git文件夹是否存在
      // 模拟实现
      return path.trim().length > 0 && !path.includes('invalid')
    } catch (error) {
      return false
    }
  }

  // 执行Git命令的通用方法
  private async executeGitCommand(command: string, cwd: string): Promise<string> {
    if (this.isElectronEnv()) {
      // 在Electron环境中，使用Node.js的child_process
      try {
        const { execSync } = window.require('child_process')
        const result = execSync(command, { 
          cwd, 
          encoding: 'utf8',
          env: { ...process.env, LC_ALL: 'C.UTF-8' } // 确保UTF-8编码支持
        })
        return result.toString()
      } catch (error: any) {
        throw new Error(`Git命令执行失败: ${error.message}`)
      }
    } else {
      // 在浏览器环境中，返回模拟数据
      return this.getMockCommandResult(command, cwd)
    }
  }

  // 模拟Git命令结果
  private getMockCommandResult(command: string, cwd: string): string {
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

      return {
        path: path.trim(),
        currentBranch: currentBranch.trim(),
        lastCommit,
        remotes
      }
    } catch (error: any) {
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

  // 获取标签列表
  async getTags(repoPath: string): Promise<string[]> {
    try {
      const tagOutput = await this.executeGitCommand('git tag', repoPath)
      return tagOutput.split('\n').filter(tag => tag.trim().length > 0)
    } catch (error: any) {
      throw new Error(`获取标签列表失败: ${error.message}`)
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
