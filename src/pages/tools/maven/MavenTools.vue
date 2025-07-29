<template>
  <PageLayout :rightSidebar="ToolsRightSidebar">
    <div class="maven-tools-container">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Maven 工具</h1>
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
        <!-- Maven 常用命令 -->
        <n-tab-pane name="commands" tab="常用命令">
          <div class="command-section">
            <n-card title="基础命令" class="mb-4">
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

            <n-card title="构建生命周期" class="mb-4">
              <div class="command-grid">
                <div v-for="(cmd, index) in lifecycleCommands" :key="index" class="command-item">
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

            <n-card title="高级命令" class="mb-4">
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

        <!-- 依赖查询 -->
        <n-tab-pane name="dependency" tab="依赖查询">
          <n-card title="Maven 依赖查询" class="mb-4">
            <div class="mb-4">
              <n-alert type="info">
                搜索 Maven 中央仓库，查找并生成依赖配置
              </n-alert>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="text-base font-medium mb-2">查询条件</h3>
                <n-form>
                  <n-form-item label="关键词">
                    <n-input v-model:value="dependencySearch.keyword" placeholder="如：spring-boot-starter" />
                  </n-form-item>
                  
                  <n-form-item label="分组 ID">
                    <n-input v-model:value="dependencySearch.groupId" placeholder="如：org.springframework.boot" />
                  </n-form-item>
                  
                  <n-form-item label="制品 ID">
                    <n-input v-model:value="dependencySearch.artifactId" placeholder="如：spring-boot-starter-web" />
                  </n-form-item>
                  
                  <n-form-item>
                    <n-button type="primary" @click="searchDependency">搜索依赖</n-button>
                  </n-form-item>
                </n-form>
              </div>

              <div>
                <h3 class="text-base font-medium mb-2">依赖配置</h3>
                <div class="dependency-output">
                  <div class="flex mb-2">
                    <n-tabs type="segment" size="small" v-model:value="dependencyFormat">
                      <n-tab-pane name="maven" tab="Maven"></n-tab-pane>
                      <n-tab-pane name="gradle" tab="Gradle"></n-tab-pane>
                      <n-tab-pane name="sbt" tab="SBT"></n-tab-pane>
                    </n-tabs>
                  </div>
                  <pre>{{ dependencyOutput }}</pre>
                  <n-button class="mt-2" size="small" @click="copyToClipboard(dependencyOutput)">
                    复制依赖配置
                  </n-button>
                </div>
              </div>
            </div>
          </n-card>
        </n-tab-pane>

        <!-- 问题解决 -->
        <n-tab-pane name="troubleshooting" tab="常见问题">
          <n-card>
            <n-collapse>
              <n-collapse-item title="依赖无法下载" name="1">
                <div class="problem-solution">
                  <h4 class="font-medium text-base mb-2">现象</h4>
                  <p>Maven 构建时报告无法下载依赖项，出现 "Could not resolve dependencies" 错误。</p>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">可能原因</h4>
                  <ul class="list-disc list-inside">
                    <li>网络连接问题</li>
                    <li>仓库配置不正确</li>
                    <li>依赖坐标错误</li>
                    <li>本地仓库缓存损坏</li>
                  </ul>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">解决方案</h4>
                  <ol class="list-decimal list-inside space-y-2">
                    <li>检查网络连接，确保可以访问 Maven 中央仓库</li>
                    <li>
                      验证 settings.xml 中的仓库配置：
                      <div class="code-block mt-1">
                        <pre><code>&lt;repositories&gt;
    &lt;repository&gt;
        &lt;id&gt;central&lt;/id&gt;
        &lt;url&gt;https://repo.maven.apache.org/maven2&lt;/url&gt;
    &lt;/repository&gt;
&lt;/repositories&gt;</code></pre>
                      </div>
                    </li>
                    <li>使用 <code>mvn dependency:purge-local-repository</code> 清理本地缓存</li>
                    <li>使用 <code>-U</code> 参数强制更新依赖：<code>mvn clean install -U</code></li>
                  </ol>
                </div>
              </n-collapse-item>
              
              <n-collapse-item title="版本冲突" name="2">
                <div class="problem-solution">
                  <h4 class="font-medium text-base mb-2">现象</h4>
                  <p>运行时出现 ClassNotFoundException 或 NoSuchMethodError，但编译时没有问题。</p>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">可能原因</h4>
                  <p>传递依赖引入了不同版本的同一个库，Maven 的依赖调解机制选择了错误的版本。</p>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">解决方案</h4>
                  <ol class="list-decimal list-inside space-y-2">
                    <li>
                      使用 <code>mvn dependency:tree</code> 分析依赖树，找出冲突
                    </li>
                    <li>
                      在 pom.xml 中使用 exclusions 排除传递依赖：
                      <div class="code-block mt-1">
                        <pre><code>&lt;dependency&gt;
    &lt;groupId&gt;group-a&lt;/groupId&gt;
    &lt;artifactId&gt;artifact-a&lt;/artifactId&gt;
    &lt;version&gt;1.0&lt;/version&gt;
    &lt;exclusions&gt;
        &lt;exclusion&gt;
            &lt;groupId&gt;group-b&lt;/groupId&gt;
            &lt;artifactId&gt;artifact-b&lt;/artifactId&gt;
        &lt;/exclusion&gt;
    &lt;/exclusions&gt;
&lt;/dependency&gt;</code></pre>
                      </div>
                    </li>
                    <li>
                      使用依赖管理强制指定版本：
                      <div class="code-block mt-1">
                        <pre><code>&lt;dependencyManagement&gt;
    &lt;dependencies&gt;
        &lt;dependency&gt;
            &lt;groupId&gt;group-b&lt;/groupId&gt;
            &lt;artifactId&gt;artifact-b&lt;/artifactId&gt;
            &lt;version&gt;2.0&lt;/version&gt;
        &lt;/dependency&gt;
    &lt;/dependencies&gt;
&lt;/dependencyManagement&gt;</code></pre>
                      </div>
                    </li>
                  </ol>
                </div>
              </n-collapse-item>
              
              <n-collapse-item title="构建速度慢" name="3">
                <div class="problem-solution">
                  <h4 class="font-medium text-base mb-2">现象</h4>
                  <p>Maven 构建速度较慢，尤其是多模块项目。</p>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">解决方案</h4>
                  <ol class="list-decimal list-inside space-y-2">
                    <li>使用并行构建：<code>mvn -T 1C clean install</code> (每核心一个线程)</li>
                    <li>跳过测试：<code>mvn clean install -DskipTests</code> (仅编译测试) 或 <code>-Dmaven.test.skip=true</code> (完全跳过测试)</li>
                    <li>配置本地镜像仓库，减少网络开销</li>
                    <li>使用增量构建，只构建更改的模块</li>
                    <li>优化 JVM 参数：<code>MAVEN_OPTS="-Xmx2g -XX:+TieredCompilation -XX:TieredStopAtLevel=1"</code></li>
                  </ol>
                </div>
              </n-collapse-item>
              
              <n-collapse-item title="插件问题" name="4">
                <div class="problem-solution">
                  <h4 class="font-medium text-base mb-2">现象</h4>
                  <p>Maven 插件执行失败或行为异常。</p>
                  
                  <h4 class="font-medium text-base mb-2 mt-4">解决方案</h4>
                  <ol class="list-decimal list-inside space-y-2">
                    <li>指定插件版本，避免使用默认版本</li>
                    <li>使用 <code>mvn help:describe -Dplugin=plugin-name</code> 检查插件配置</li>
                    <li>在 Maven 命令中添加 <code>-X</code> 参数开启调试输出</li>
                    <li>查看插件官方文档，确保配置正确</li>
                    <li>尝试清理本地仓库中的插件缓存：<code>rm -rf ~/.m2/repository/org/apache/maven/plugins/plugin-name</code></li>
                  </ol>
                </div>
              </n-collapse-item>
            </n-collapse>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { 
  NCard, NButton, NTabs, NTabPane, NForm, NFormItem, 
  NInput, NAlert, NCollapse, NCollapseItem 
} from 'naive-ui'
// @ts-ignore
import PageLayout from '@/components/layout/PageLayout.vue'
// @ts-ignore
import ToolsRightSidebar from '@/components/layout/ToolsRightSidebar.vue'

const router = useRouter()
const message = useMessage()

// Maven 常用命令
const basicCommands = [
  { 
    name: '创建项目', 
    command: 'mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-app', 
    description: '创建一个新的 Maven 项目' 
  },
  { 
    name: '简化创建', 
    command: 'mvn archetype:generate -DarchetypeArtifactId=maven-archetype-quickstart', 
    description: '使用快速启动原型创建项目' 
  },
  { 
    name: '查看依赖树', 
    command: 'mvn dependency:tree', 
    description: '显示项目的依赖树结构' 
  },
  { 
    name: '分析依赖', 
    command: 'mvn dependency:analyze', 
    description: '分析依赖情况，检测未使用和未声明的依赖' 
  },
  { 
    name: '查看有效POM', 
    command: 'mvn help:effective-pom', 
    description: '查看合并了所有继承和默认配置后的有效 POM' 
  },
  { 
    name: '显示版本更新', 
    command: 'mvn versions:display-dependency-updates', 
    description: '检查依赖是否有更新的版本' 
  }
]

const lifecycleCommands = [
  { 
    name: '清理构建目录', 
    command: 'mvn clean', 
    description: '删除 target 目录及构建生成的文件' 
  },
  { 
    name: '编译源码', 
    command: 'mvn compile', 
    description: '编译项目的源代码' 
  },
  { 
    name: '运行测试', 
    command: 'mvn test', 
    description: '运行单元测试' 
  },
  { 
    name: '打包项目', 
    command: 'mvn package', 
    description: '将编译后的代码打包为可分发格式（jar、war 等）' 
  },
  { 
    name: '安装到本地仓库', 
    command: 'mvn install', 
    description: '安装到本地 Maven 仓库，供其他项目使用' 
  },
  { 
    name: '部署到远程仓库', 
    command: 'mvn deploy', 
    description: '部署到远程 Maven 仓库，供他人使用' 
  }
]

const advancedCommands = [
  { 
    name: '离线构建', 
    command: 'mvn -o clean install', 
    description: '在离线模式下构建项目，不检查远程仓库' 
  },
  { 
    name: '强制更新', 
    command: 'mvn -U clean install', 
    description: '强制检查并更新依赖的快照版本' 
  },
  { 
    name: '并行构建', 
    command: 'mvn -T 4 clean install', 
    description: '使用 4 个线程并行构建多模块项目' 
  },
  { 
    name: '跳过测试', 
    command: 'mvn clean install -DskipTests', 
    description: '编译但跳过测试执行' 
  },
  { 
    name: '完全跳过测试', 
    command: 'mvn clean install -Dmaven.test.skip=true', 
    description: '完全跳过测试编译和执行' 
  },
  { 
    name: '生成站点', 
    command: 'mvn site', 
    description: '生成项目文档站点' 
  }
]

// 依赖查询
const dependencySearch = ref({
  keyword: '',
  groupId: 'org.springframework.boot',
  artifactId: 'spring-boot-starter-web'
})

const dependencyFormat = ref('maven')

const dependencyOutput = ref(`<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.1.0</version>
</dependency>`)

function searchDependency() {
  // 在真实应用中这里会调用后端 API 搜索依赖
  // 这里仅作示例展示
  const { groupId, artifactId } = dependencySearch.value
  
  if (!groupId || !artifactId) {
    message.warning('请填写分组 ID 和制品 ID')
    return
  }
  
  // 根据不同格式生成依赖配置
  if (dependencyFormat.value === 'maven') {
    dependencyOutput.value = `<dependency>
    <groupId>${groupId}</groupId>
    <artifactId>${artifactId}</artifactId>
    <version>3.1.0</version>
</dependency>`
  } else if (dependencyFormat.value === 'gradle') {
    dependencyOutput.value = `implementation '${groupId}:${artifactId}:3.1.0'`
  } else if (dependencyFormat.value === 'sbt') {
    dependencyOutput.value = `libraryDependencies += "${groupId}" % "${artifactId}" % "3.1.0"`
  }
  
  message.success('依赖查询成功')
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
.maven-tools-container {
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

.dependency-output pre {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  white-space: pre;
  overflow: auto;
  min-height: 150px;
  max-height: 300px;
  border: 1px solid #eee;
}

.code-block {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
  margin-left: 20px;
}

.code-block pre {
  font-family: monospace;
  font-size: 12px;
  white-space: pre;
  overflow-x: auto;
}

.problem-solution code {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 13px;
}
</style> 