<template>
  <div class="tools-container">
    <div class="tabs-container">
      <n-tabs type="line" animated v-model:value="activeTab">
        <n-tab-pane name="all" tab="全部">
          <div class="tools-layout">
            <div class="tool-category">
              <h2 class="category-title">开发工具</h2>
              <div class="tools-grid">
                <!-- Git 工具 -->
                <div class="tool-card git-tool" @click="openTool('/tools/git', 'Git 工具集')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fab fa-git-alt"></i>
                      <h2>Git 工具集</h2>
                    </div>
                    <p class="tool-desc">版本控制与协作开发</p>
                  </div>
                </div>
                
                <!-- Maven 工具 -->
                <div class="tool-card maven-tool" @click="openTool('/tools/maven', 'Maven 工具')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fas fa-cogs"></i>
                      <h2>Maven 工具</h2>
                    </div>
                    <p class="tool-desc">Java项目构建管理</p>
                  </div>
                </div>
                
                <!-- SQL 工具 -->
                <div class="tool-card sql-tool" @click="openTool('/tools/sql', 'SQL 工具')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fas fa-database"></i>
                      <h2>SQL 工具</h2>
                    </div>
                    <p class="tool-desc">数据库语句格式化与优化</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="tool-category">
              <h2 class="category-title">实用工具</h2>
              <div class="tools-grid">
                <!-- MD5 加密工具 -->
                <div class="tool-card md5-tool" @click="openTool('/tools/md5', 'MD5 加密工具')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fas fa-lock"></i>
                      <h2>MD5 加密工具</h2>
                    </div>
                    <p class="tool-desc">文本和文件加密</p>
                  </div>
                </div>

                <!-- 移除正则表达式工具卡片 -->
              </div>
            </div>

            <div class="tool-category">
              <h2 class="category-title">数据处理</h2>
              <div class="tools-grid">
                <!-- JSON 工具 -->
                <div class="tool-card json-tool" @click="openTool('/tools/json', 'JSON 工具')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fas fa-code"></i>
                      <h2>JSON 工具</h2>
                    </div>
                    <p class="tool-desc">格式化、压缩与转换</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="tool-category">
              <h2 class="category-title">代码生成</h2>
              <div class="tools-grid">
                <!-- Java 类生成器 -->
                <div class="tool-card java-tool" @click="openTool('/tools/java-gen', 'Java 类生成器')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fab fa-java"></i>
                      <h2>Java 类生成器</h2>
                    </div>
                    <p class="tool-desc">自动生成Java代码</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-tab-pane>
        
        <n-tab-pane name="dev" tab="开发工具">
          <div class="tools-layout">
            <div class="tool-category">
              <div class="tools-grid">
                <!-- Git 工具 -->
                <div class="tool-card git-tool" @click="openTool('/tools/git', 'Git 工具集')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fab fa-git-alt"></i>
                      <h2>Git 工具集</h2>
                    </div>
                    <p class="tool-desc">版本控制与协作开发</p>
                  </div>
                </div>
                
                <!-- Maven 工具 -->
                <div class="tool-card maven-tool" @click="openTool('/tools/maven', 'Maven 工具')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fas fa-cogs"></i>
                      <h2>Maven 工具</h2>
                    </div>
                    <p class="tool-desc">Java项目构建管理</p>
                  </div>
                </div>
                
                <!-- SQL 工具 -->
                <div class="tool-card sql-tool" @click="openTool('/tools/sql', 'SQL 工具')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fas fa-database"></i>
                      <h2>SQL 工具</h2>
                    </div>
                    <p class="tool-desc">数据库语句格式化与优化</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-tab-pane>
        
        <n-tab-pane name="java" tab="Java 工具">
          <div class="tools-layout">
            <div class="tool-category">
              <div class="tools-grid">
                <!-- Java 类生成器 -->
                <div class="tool-card java-tool" @click="openTool('/tools/java-gen', 'Java 类生成器')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fab fa-java"></i>
                      <h2>Java 类生成器</h2>
                    </div>
                    <p class="tool-desc">自动生成Java代码</p>
                  </div>
                </div>

                <!-- Maven 工具 (也属于Java工具) -->
                <div class="tool-card maven-tool" @click="openTool('/tools/maven', 'Maven 工具')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fas fa-cogs"></i>
                      <h2>Maven 工具</h2>
                    </div>
                    <p class="tool-desc">Java项目构建管理</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-tab-pane>
        
        <n-tab-pane name="data" tab="数据处理">
          <div class="tools-layout">
            <div class="tool-category">
              <div class="tools-grid">
                <!-- JSON 工具 -->
                <div class="tool-card json-tool" @click="openTool('/tools/json', 'JSON 工具')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fas fa-code"></i>
                      <h2>JSON 工具</h2>
                    </div>
                    <p class="tool-desc">格式化、压缩与转换</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="utils" tab="实用工具">
          <div class="tools-layout">
            <div class="tool-category">
              <div class="tools-grid">
                <!-- MD5 加密工具 -->
                <div class="tool-card md5-tool" @click="openTool('/tools/md5', 'MD5 加密工具')">
                  <div class="card-content">
                    <div class="tool-header">
                      <i class="fas fa-lock"></i>
                      <h2>MD5 加密工具</h2>
                    </div>
                    <p class="tool-desc">文本和文件加密</p>
                  </div>
                </div>

                <!-- 移除实用工具标签页中的正则表达式 -->
              </div>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NButton, NTag, NTabs, NTabPane } from 'naive-ui'

const router = useRouter()
const activeTab = ref('all')

// 在新窗口打开工具并设置标题
function openTool(url: string, title: string = 'QH DevTools') {
  const newWindow = window.open(url, '_blank')
  if (newWindow) {
    newWindow.document.title = title
  }
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

.tabs-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
}

.tools-layout {
  margin: 20px 0;
  overflow: visible;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eaeaea;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  overflow: visible;
}

.tool-category {
  margin-bottom: 30px;
  overflow: visible;
}

.tool-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(230, 230, 230, 0.8);
  cursor: pointer;
  position: relative;
  min-height: 100px;
}

.tool-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  border-radius: 12px;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* 统一所有工具卡片悬停时的渐变效果为浅蓝色 */
.tool-card:hover::before {
  background: linear-gradient(135deg, rgba(100, 181, 246, 0.1), rgba(33, 150, 243, 0.1));
  opacity: 1;
}

/* 移除特定工具卡片的单独渐变设置 */
.tool-card.git-tool:hover::before,
.tool-card.maven-tool:hover::before,
.tool-card.md5-tool:hover::before,
.tool-card.json-tool:hover::before,
.tool-card.sql-tool:hover::before,
.tool-card.java-tool:hover::before {
  background: linear-gradient(135deg, rgba(100, 181, 246, 0.1), rgba(33, 150, 243, 0.1));
  opacity: 1;
}

.card-content {
  padding: 20px;
  flex-grow: 1;
  z-index: 2;
  position: relative;
}

.tool-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.tool-header i {
  font-size: 1.6rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 15px;
  color: white;
}

.tool-header h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.tool-desc {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  padding-left: 55px;
}

/* 保留工具卡片图标背景颜色 */
.git-tool .tool-header i {
  background: linear-gradient(120deg, #f97316, #ea580c);
}

.maven-tool .tool-header i {
  background: linear-gradient(120deg, #8b5cf6, #7c3aed);
}

.md5-tool .tool-header i {
  background: linear-gradient(120deg, #10b981, #059669);
}

.json-tool .tool-header i {
  background: linear-gradient(120deg, #ef4444, #dc2626);
}

.sql-tool .tool-header i {
  background: linear-gradient(120deg, #3b82f6, #2563eb);
}

.java-tool .tool-header i {
  background: linear-gradient(120deg, #f97316, #ea580c);
}

/* 媒体查询 */
@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs-container {
    padding: 15px;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1201px) {
  .tools-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style> 