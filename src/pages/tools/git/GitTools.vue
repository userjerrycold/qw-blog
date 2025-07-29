<template>
  <div class="tools-container">
    <div class="content-container">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Git 工具集</h1>
        <n-button @click="router.push('/tools')" size="small">
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
          返回工具列表
        </n-button>
      </div>

      <n-tabs type="line" animated>
        <!-- Git 常用命令 -->
        <n-tab-pane name="commands" tab="常用命令">
          <div class="command-section">
            <n-card title="基础操作" class="mb-4">
              <div class="command-grid">
                <div v-for="(cmd, index) in basicCommands" :key="index" class="command-item">
                  <div class="flex justify-between">
                    <div class="command-name">{{ cmd.name }}</div>
                    <n-button text size="small" @click="copyToClipboard(cmd.command)">
                      <template #icon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 4V16C8 17.1 8.9 18 10 18H18C19.1 18 20 17.1 20 16V7.4L16.6 4H10C8.9 4 8 4.9 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 4V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V9C4 7.9 4.9 7 6 7H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </template>
                      复制
                    </n-button>
                  </div>
                  <div class="command-code">{{ cmd.command }}</div>
                  <div class="command-desc">{{ cmd.description }}</div>
                </div>
              </div>
            </n-card>

            <n-card title="分支操作" class="mb-4">
              <div class="command-grid">
                <div v-for="(cmd, index) in branchCommands" :key="index" class="command-item">
                  <div class="flex justify-between">
                    <div class="command-name">{{ cmd.name }}</div>
                    <n-button text size="small" @click="copyToClipboard(cmd.command)">
                      <template #icon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 4V16C8 17.1 8.9 18 10 18H18C19.1 18 20 17.1 20 16V7.4L16.6 4H10C8.9 4 8 4.9 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 4V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V9C4 7.9 4.9 7 6 7H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </template>
                      复制
                    </n-button>
                  </div>
                  <div class="command-code">{{ cmd.command }}</div>
                  <div class="command-desc">{{ cmd.description }}</div>
                </div>
              </div>
            </n-card>

            <n-card title="高级操作" class="mb-4">
              <div class="command-grid">
                <div v-for="(cmd, index) in advancedCommands" :key="index" class="command-item">
                  <div class="flex justify-between">
                    <div class="command-name">{{ cmd.name }}</div>
                    <n-button text size="small" @click="copyToClipboard(cmd.command)">
                      <template #icon>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 4V16C8 17.1 8.9 18 10 18H18C19.1 18 20 17.1 20 16V7.4L16.6 4H10C8.9 4 8 4.9 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 4V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V9C4 7.9 4.9 7 6 7H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </template>
                      复制
                    </n-button>
                  </div>
                  <div class="command-code">{{ cmd.command }}</div>
                  <div class="command-desc">{{ cmd.description }}</div>
                </div>
              </div>
            </n-card>
          </div>
        </n-tab-pane>

        <!-- 分支图生成 -->
        <n-tab-pane name="branch-graph" tab="分支图生成">
          <n-card title="分支图生成器" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                输入您的分支结构，系统将自动生成 ASCII 图形展示分支合并历史
              </n-alert>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="text-base font-medium mb-2">分支配置</h3>
                <n-form>
                  <n-form-item label="主分支名称">
                    <n-input v-model:value="branchGraphConfig.mainBranch" placeholder="main" />
                  </n-form-item>
                  
                  <n-form-item label="分支与合并定义">
                    <n-input
                      v-model:value="branchGraphConfig.branchDefinition"
                      type="textarea"
                      :autosize="{ minRows: 6, maxRows: 10 }"
                      placeholder="每行一个操作，例如:
feature: main 50
bugfix: feature 30
merge bugfix feature
merge feature main"
                    />
                  </n-form-item>
                  
                  <n-form-item>
                    <n-button type="primary" @click="generateBranchGraph">生成分支图</n-button>
                  </n-form-item>
                </n-form>
              </div>
              
              <div>
                <h3 class="text-base font-medium mb-2">生成的分支图</h3>
                <div class="branch-graph-output">
                  <pre>{{ branchGraphOutput }}</pre>
                </div>
                <n-button class="mt-2" size="small" @click="copyToClipboard(branchGraphOutput)">
                  复制分支图
                </n-button>
              </div>
            </div>
          </n-card>
        </n-tab-pane>

        <!-- Commit 模板 -->
        <n-tab-pane name="commit-template" tab="Commit 模板">
          <n-card title="Commit 消息生成器" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                生成规范的 Git Commit 消息，遵循 Conventional Commits 规范
              </n-alert>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="text-base font-medium mb-2">Commit 配置</h3>
                <n-form>
                  <n-form-item label="类型">
                    <n-select v-model:value="commitTemplate.type" :options="commitTypeOptions" />
                  </n-form-item>
                  
                  <n-form-item label="范围 (可选)">
                    <n-input v-model:value="commitTemplate.scope" placeholder="auth" />
                  </n-form-item>
                  
                  <n-form-item label="简短描述">
                    <n-input v-model:value="commitTemplate.subject" placeholder="添加用户登录功能" />
                  </n-form-item>
                  
                  <n-form-item label="详细描述 (可选)">
                    <n-input
                      v-model:value="commitTemplate.body"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                      placeholder="实现了基于JWT的认证系统，包括登录表单和Token存储。
添加了记住密码功能和自动登录选项。"
                    />
                  </n-form-item>
                  
                  <n-form-item label="页脚注释 (可选)">
                    <n-input v-model:value="commitTemplate.footer" placeholder="Closes #123" />
                  </n-form-item>
                  
                  <n-form-item>
                    <n-button type="primary" @click="generateCommitMessage">生成 Commit 消息</n-button>
                  </n-form-item>
                </n-form>
              </div>
              
              <div>
                <h3 class="text-base font-medium mb-2">生成的 Commit 消息</h3>
                <div class="commit-message-output">
                  <pre>{{ commitMessageOutput }}</pre>
                </div>
                <n-button class="mt-2" size="small" @click="copyToClipboard(commitMessageOutput)">
                  复制 Commit 消息
                </n-button>
              </div>
            </div>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  NCard, NButton, NTabs, NTabPane, NForm, NFormItem, 
  NInput, NAlert, NSelect
} from 'naive-ui'

const router = useRouter()
const message = useMessage()

// Git 常用命令
const basicCommands = [
  { 
    name: '初始化仓库', 
    command: 'git init', 
    description: '创建一个新的Git仓库' 
  },
  { 
    name: '克隆仓库', 
    command: 'git clone https://github.com/username/repository.git', 
    description: '克隆远程仓库到本地' 
  },
  { 
    name: '添加文件', 
    command: 'git add <filename>', 
    description: '将文件添加到暂存区' 
  },
  { 
    name: '添加所有', 
    command: 'git add .', 
    description: '将所有更改添加到暂存区' 
  },
  { 
    name: '提交更改', 
    command: 'git commit -m "提交信息"', 
    description: '提交暂存区的更改' 
  },
  { 
    name: '查看状态', 
    command: 'git status', 
    description: '显示工作区和暂存区的状态' 
  }
]

const branchCommands = [
  { 
    name: '列出分支', 
    command: 'git branch', 
    description: '列出本地所有分支' 
  },
  { 
    name: '列出远程分支', 
    command: 'git branch -r', 
    description: '列出所有远程分支' 
  },
  { 
    name: '创建分支', 
    command: 'git branch <branch-name>', 
    description: '创建新的分支' 
  },
  { 
    name: '切换分支', 
    command: 'git checkout <branch-name>', 
    description: '切换到指定分支' 
  },
  { 
    name: '创建并切换', 
    command: 'git checkout -b <branch-name>', 
    description: '创建并切换到新分支' 
  },
  { 
    name: '合并分支', 
    command: 'git merge <branch-name>', 
    description: '合并指定分支到当前分支' 
  }
]

const advancedCommands = [
  { 
    name: '添加远程仓库', 
    command: 'git remote add origin https://github.com/username/repository.git', 
    description: '添加远程仓库' 
  },
  { 
    name: '推送到远程', 
    command: 'git push -u origin main', 
    description: '推送本地分支到远程仓库' 
  },
  { 
    name: '拉取更新', 
    command: 'git pull origin main', 
    description: '从远程仓库拉取并合并更新' 
  },
  { 
    name: '查看日志', 
    command: 'git log --oneline --graph', 
    description: '以图形方式查看提交历史' 
  },
  { 
    name: '撤销提交', 
    command: 'git revert <commit-hash>', 
    description: '撤销指定的提交' 
  },
  { 
    name: '变基操作', 
    command: 'git rebase main', 
    description: '将当前分支变基到main分支' 
  }
]

// 分支图生成器
const branchGraphConfig = ref({
  mainBranch: 'main',
  branchDefinition: `feature: main 50
bugfix: feature 30
merge bugfix feature
merge feature main`
})

const branchGraphOutput = ref(`main ----------------------------+
                            |
feature         +------------+-----+
                |                  |
bugfix          +-------+          |
                        |          |
                        +----------+
                                   |
                                   +`)

function generateBranchGraph() {
  // 简易实现，实际应用需要更复杂的算法
  const { mainBranch, branchDefinition } = branchGraphConfig.value
  
  if (!branchDefinition.trim()) {
    message.warning('请输入分支定义')
    return
  }
  
  try {
    // 这里是简单的示例输出，实际应用需要解析分支定义并生成图形
    const lines = branchDefinition.split('\n')
    const branches = [mainBranch]
    
    // 提取所有分支名
    lines.forEach(line => {
      if (line.includes(':')) {
        const branch = line.split(':')[0].trim()
        if (!branches.includes(branch)) {
          branches.push(branch)
        }
      }
    })
    
    // 生成一个简单的ASCII图
    let graph = ''
    branches.forEach((branch, index) => {
      const indent = ' '.repeat(index * 2)
      graph += `${indent}${branch} ${'---'.repeat(4 - index)}\n`
      if (index < branches.length - 1) {
        graph += `${indent}|\n`
      }
    })
    
    branchGraphOutput.value = graph
    message.success('分支图生成成功')
  } catch (error) {
    message.error('分支图生成失败')
    branchGraphOutput.value = error instanceof Error ? `错误: ${error.message}` : '未知错误'
  }
}

// Commit 模板
const commitTemplate = ref({
  type: 'feat',
  scope: '',
  subject: '',
  body: '',
  footer: ''
})

const commitTypeOptions = [
  { label: '✨ feat: 新功能', value: 'feat' },
  { label: '🐛 fix: 修复', value: 'fix' },
  { label: '📝 docs: 文档', value: 'docs' },
  { label: '💄 style: 样式', value: 'style' },
  { label: '♻️ refactor: 重构', value: 'refactor' },
  { label: '⚡ perf: 性能优化', value: 'perf' },
  { label: '✅ test: 测试', value: 'test' },
  { label: '🔧 chore: 构建/依赖', value: 'chore' }
]

const commitMessageOutput = ref(`feat: 添加用户登录功能

实现了基于JWT的认证系统，包括登录表单和Token存储。
添加了记住密码功能和自动登录选项。

Closes #123`)

function generateCommitMessage() {
  const { type, scope, subject, body, footer } = commitTemplate.value
  
  if (!subject) {
    message.warning('请填写简短描述')
    return
  }
  
  let output = `${type}`
  if (scope) {
    output += `(${scope})`
  }
  output += `: ${subject}`
  
  if (body) {
    output += `\n\n${body}`
  }
  
  if (footer) {
    output += `\n\n${footer}`
  }
  
  commitMessageOutput.value = output
}

// 复制到剪贴板
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已复制到剪贴板')
  }).catch(() => {
    message.error('复制失败')
  })
}
</script>

<style scoped>
.tools-container {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  background-color: white;
  overflow-y: auto;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
}

.command-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.command-item {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
}

.command-name {
  font-weight: 600;
  margin-bottom: 8px;
}

.command-code {
  font-family: monospace;
  background-color: #f0f0f0;
  padding: 6px;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 13px;
  white-space: nowrap;
  overflow: auto;
}

.command-desc {
  font-size: 13px;
  color: #666;
}

.branch-graph-output,
.commit-message-output {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  white-space: pre;
  overflow: auto;
  min-height: 200px;
  max-height: 400px;
  border: 1px solid #eee;
}

@media (max-width: 768px) {
  .content-container {
    padding: 15px;
  }
  
  .command-grid {
    grid-template-columns: 1fr;
  }
}
</style> 