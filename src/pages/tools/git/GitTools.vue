<template>
  <PageLayout :rightSidebar="ToolsRightSidebar">
    <div class="git-tools-container">
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
                    <n-input v-model:value="branchGraph.mainBranch" placeholder="main" />
                  </n-form-item>
                  
                  <n-form-item label="特性分支">
                    <n-dynamic-input
                      v-model:value="branchGraph.featureBranches"
                      :on-create="() => ({ name: '', commits: 2, mergedTo: 'main' })"
                    >
                      <template #default="{ value }">
                        <div class="grid grid-cols-3 gap-2">
                          <n-input v-model:value="value.name" placeholder="分支名称" />
                          <n-input-number v-model:value="value.commits" placeholder="提交数" :min="1" :max="10" />
                          <n-select v-model:value="value.mergedTo" :options="branchOptions" />
                        </div>
                      </template>
                    </n-dynamic-input>
                  </n-form-item>

                  <n-form-item>
                    <n-button type="primary" @click="generateBranchGraph">生成分支图</n-button>
                  </n-form-item>
                </n-form>
              </div>

              <div>
                <h3 class="text-base font-medium mb-2">分支图</h3>
                <div class="branch-graph-output">
                  <pre>{{ branchGraphOutput }}</pre>
                </div>
                <n-button class="mt-2" size="small" @click="copyToClipboard(branchGraphOutput)">
                  复制图形
                </n-button>
              </div>
            </div>
          </n-card>
        </n-tab-pane>

        <!-- Commit 模板 -->
        <n-tab-pane name="commit-template" tab="Commit 模板">
          <n-card title="Commit Message 模板生成器" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                选择 Commit 类型和填写相关信息，生成规范的 Commit Message
              </n-alert>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="text-base font-medium mb-2">Commit 信息</h3>
                <n-form>
                  <n-form-item label="类型">
                    <n-select v-model:value="commitTemplate.type" :options="commitTypeOptions" />
                  </n-form-item>
                  
                  <n-form-item label="范围 (可选)">
                    <n-input v-model:value="commitTemplate.scope" placeholder="影响范围，如：auth, api" />
                  </n-form-item>
                  
                  <n-form-item label="简短描述">
                    <n-input v-model:value="commitTemplate.subject" placeholder="简明扼要的变更描述" />
                  </n-form-item>
                  
                  <n-form-item label="详细描述 (可选)">
                    <n-input
                      v-model:value="commitTemplate.body"
                      type="textarea"
                      placeholder="详细的变更原因和影响"
                      :autosize="{ minRows: 3, maxRows: 5 }"
                    />
                  </n-form-item>
                  
                  <n-form-item label="关联 Issue (可选)">
                    <n-input v-model:value="commitTemplate.footer" placeholder="如：Closes #123, Fixes #456" />
                  </n-form-item>

                  <n-form-item>
                    <n-button type="primary" @click="generateCommitMessage">生成 Commit Message</n-button>
                  </n-form-item>
                </n-form>
              </div>

              <div>
                <h3 class="text-base font-medium mb-2">生成结果</h3>
                <div class="commit-message-output">
                  <pre>{{ commitMessageOutput }}</pre>
                </div>
                <n-button class="mt-2" size="small" @click="copyToClipboard(commitMessageOutput)">
                  复制 Commit Message
                </n-button>
              </div>
            </div>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  NCard, NButton, NTabs, NTabPane, NForm, NFormItem, 
  NInput, NInputNumber, NSelect, NDynamicInput, NAlert 
} from 'naive-ui'
// @ts-ignore
import PageLayout from '@/components/layout/PageLayout.vue'
// @ts-ignore
import ToolsRightSidebar from '@/components/layout/ToolsRightSidebar.vue'

const router = useRouter()
const message = useMessage()

// Git 常用命令
const basicCommands = [
  { 
    name: '初始化仓库', 
    command: 'git init', 
    description: '在当前目录创建一个新的 Git 仓库' 
  },
  { 
    name: '克隆仓库', 
    command: 'git clone <repository-url>', 
    description: '克隆远程仓库到本地' 
  },
  { 
    name: '添加文件', 
    command: 'git add <file-name> 或 git add .', 
    description: '将文件添加到暂存区' 
  },
  { 
    name: '提交更改', 
    command: 'git commit -m "commit message"', 
    description: '将暂存区的更改提交到本地仓库' 
  },
  { 
    name: '查看状态', 
    command: 'git status', 
    description: '查看工作区和暂存区的状态' 
  },
  { 
    name: '查看日志', 
    command: 'git log', 
    description: '查看提交历史' 
  }
]

const branchCommands = [
  { 
    name: '查看分支', 
    command: 'git branch', 
    description: '列出本地所有分支' 
  },
  { 
    name: '创建分支', 
    command: 'git branch <branch-name>', 
    description: '创建新分支' 
  },
  { 
    name: '切换分支', 
    command: 'git checkout <branch-name>', 
    description: '切换到指定分支' 
  },
  { 
    name: '创建并切换', 
    command: 'git checkout -b <branch-name>', 
    description: '创建新分支并立即切换到该分支' 
  },
  { 
    name: '合并分支', 
    command: 'git merge <branch-name>', 
    description: '将指定分支合并到当前分支' 
  },
  { 
    name: '删除分支', 
    command: 'git branch -d <branch-name>', 
    description: '删除指定分支' 
  }
]

const advancedCommands = [
  { 
    name: '暂存更改', 
    command: 'git stash', 
    description: '临时保存工作区的修改' 
  },
  { 
    name: '恢复暂存', 
    command: 'git stash pop', 
    description: '恢复最近一次暂存的更改' 
  },
  { 
    name: '拉取更新', 
    command: 'git pull origin <branch-name>', 
    description: '从远程仓库拉取更新' 
  },
  { 
    name: '推送更新', 
    command: 'git push origin <branch-name>', 
    description: '将本地更新推送到远程仓库' 
  },
  { 
    name: '查看远程', 
    command: 'git remote -v', 
    description: '查看远程仓库信息' 
  },
  { 
    name: '添加远程', 
    command: 'git remote add origin <repository-url>', 
    description: '添加远程仓库' 
  }
]

// 分支图生成器
const branchGraph = ref({
  mainBranch: 'main',
  featureBranches: [
    { name: 'feature-1', commits: 3, mergedTo: 'main' },
    { name: 'feature-2', commits: 2, mergedTo: 'main' }
  ]
})

const branchOptions = computed(() => {
  const options = [{ label: branchGraph.value.mainBranch, value: branchGraph.value.mainBranch }]
  branchGraph.value.featureBranches.forEach(branch => {
    if (branch.name) {
      options.push({ label: branch.name, value: branch.name })
    }
  })
  return options
})

const branchGraphOutput = ref(`
* 9e8a6c2 (HEAD -> main) Merge branch 'feature-2'
|\\
| * 7d2f5b1 (feature-2) Add feature 2
| * 3a1b4c5 Start feature 2
|/
* 2e6f8a0 Merge branch 'feature-1'
|\\
| * 5c7d9e1 (feature-1) Complete feature 1
| * 4b6a8c0 Progress on feature 1
| * 1d3f5a7 Start feature 1
|/
* 0e2c4a6 Initial commit
`)

function generateBranchGraph() {
  // 简单的 ASCII 图形生成逻辑
  let output = ''
  const mainBranch = branchGraph.value.mainBranch
  let commitCounter = 0
  
  // 初始提交
  output += `* ${generateCommitHash(commitCounter++)} Initial commit\n`
  
  // 处理每个特性分支
  branchGraph.value.featureBranches.forEach((branch, index) => {
    if (!branch.name) return
    
    // 分支开始
    output += `|\n`
    output += `* ${generateCommitHash(commitCounter++)} Merge branch '${branch.name}'\n`
    output += `|\\\n`
    
    // 分支上的提交
    for (let i = 0; i < branch.commits; i++) {
      const commitMsg = i === 0 ? `Start ${branch.name}` : 
                        i === branch.commits - 1 ? `Complete ${branch.name}` : 
                        `Progress on ${branch.name}`
      output += `| * ${generateCommitHash(commitCounter++)} (${branch.name}) ${commitMsg}\n`
    }
    
    // 分支结束
    output += `|/\n`
  })
  
  // 最后一个提交（HEAD）
  output += `* ${generateCommitHash(commitCounter++)} (HEAD -> ${mainBranch}) Latest commit\n`
  
  branchGraphOutput.value = output
}

function generateCommitHash(seed: number): string {
  // 简单的伪随机哈希生成
  const chars = '0123456789abcdef'
  let hash = ''
  for (let i = 0; i < 7; i++) {
    const randomIndex = (seed + i * 11) % chars.length
    hash += chars[randomIndex]
  }
  return hash
}

// Commit 模板生成器
const commitTemplate = ref({
  type: 'feat',
  scope: '',
  subject: '',
  body: '',
  footer: ''
})

const commitTypeOptions = [
  { label: '✨ feat: 新功能', value: 'feat' },
  { label: '🐛 fix: 修复Bug', value: 'fix' },
  { label: '📚 docs: 文档更新', value: 'docs' },
  { label: '💎 style: 代码格式', value: 'style' },
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
.git-tools-container {
  padding: 10px;
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
</style> 