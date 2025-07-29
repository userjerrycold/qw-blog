<template>
  <PageLayout :rightSidebar="ToolsRightSidebar">
    <div class="tools-container">
      <div class="mb-6">
        <n-tabs type="line" animated>
          <n-tab-pane name="all" tab="全部">
            <div class="tool-category mb-8">
              <h2 class="text-xl font-medium mb-5">开发工具</h2>
              <div class="tools-grid">
                <!-- Git 工具 -->
                <div class="tool-card git-tool">
                  <div class="card-header">
                    <i class="fab fa-git-alt"></i>
                    <div class="title-section">
                      <h2>Git 工具集</h2>
                      <p>版本控制与协作开发</p>
                    </div>
                  </div>
                  <div class="card-content">
                    <ul class="features">
                      <li class="check-item">常用命令速查手册</li>
                      <li class="check-item">可视化分支图生成器</li>
                      <li class="check-item">智能 Commit 模板</li>
                      <li class="check-item">工作流最佳实践指南</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/git')">立即使用</a>
                  </div>
                </div>
                
                <!-- Maven 工具 -->
                <div class="tool-card maven-tool">
                  <div class="card-header">
                    <i class="fas fa-cogs"></i>
                    <div class="title-section">
                      <h2>Maven 工具</h2>
                      <p>Java 项目管理专家</p>
                    </div>
                  </div>
                  <div class="card-content">
                    <ul class="features">
                      <li class="check-item">常用命令快速参考</li>
                      <li class="check-item">智能依赖查询与分析</li>
                      <li class="check-item">常见问题解决方案库</li>
                      <li class="check-item">依赖冲突检测工具</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/maven')">立即使用</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="tool-category mb-8">
              <h2 class="text-xl font-medium mb-5">实用工具</h2>
              <div class="tools-grid">
                <!-- MD5 加密工具 -->
                <div class="tool-card md5-tool">
                  <div class="card-header">
                    <i class="fas fa-lock"></i>
                    <div class="title-section">
                      <h2>MD5 加密工具</h2>
                      <p>安全加密解决方案</p>
                    </div>
                  </div>
                  <div class="card-content">
                    <ul class="features">
                      <li class="check-item">文本即时加密/解密</li>
                      <li class="check-item">文件 MD5 值计算</li>
                      <li class="check-item">批量文件校验功能</li>
                      <li class="check-item">加密结果历史记录</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/md5')">立即使用</a>
                  </div>
                </div>

                <!-- 正则表达式 -->
                <div class="tool-card regex-tool">
                  <div class="card-header">
                    <i class="fas fa-code"></i>
                    <div class="title-section">
                      <h2>正则表达式</h2>
                      <p>模式匹配专家</p>
                    </div>
                  </div>
                  <div class="card-content">
                    <ul class="features">
                      <li class="check-item">实时正则表达式测试</li>
                      <li class="check-item">常用正则表达式库</li>
                      <li class="check-item">批量文本查找替换</li>
                      <li class="check-item">正则匹配可视化解析</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/regex')">立即使用</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="tool-category mb-8">
              <h2 class="text-xl font-medium mb-5">数据处理</h2>
              <div class="tools-grid">
                <!-- JSON 工具 -->
                <div class="tool-card json-tool">
                  <div class="card-header">
                    <i class="fas fa-code"></i>
                    <div class="title-section">
                      <h2>JSON 工具</h2>
                      <p>数据格式处理专家</p>
                    </div>
                  </div>
                  <div class="card-content">
                    <ul class="features">
                      <li class="check-item">智能格式化与压缩</li>
                      <li class="check-item">JSON/XML 双向转换</li>
                      <li class="check-item">JSON 数据验证</li>
                      <li class="check-item">根据 JSON 生成实体类</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/json')">立即使用</a>
                  </div>
                </div>

                <!-- SQL 格式化 -->
                <div class="tool-card sql-tool">
                  <div class="card-header">
                    <i class="fas fa-database"></i>
                    <div class="title-section">
                      <h2>SQL 格式化</h2>
                      <p>数据库语句优化工具</p>
                    </div>
                  </div>
                  <div class="card-content">
                    <ul class="features">
                      <li class="check-item">智能SQL语句格式化</li>
                      <li class="check-item">多种数据库语法支持</li>
                      <li class="check-item">SQL语句性能分析</li>
                      <li class="check-item">常用SQL模板库</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/sql')">立即使用</a>
                  </div>
                </div>
              </div>
            </div>

            <div class="tool-category mb-8">
              <h2 class="text-xl font-medium mb-5">代码生成</h2>
              <div class="tools-grid">
                <!-- Java 类生成器 -->
                <div class="tool-card java-tool">
                  <div class="card-header">
                    <i class="fab fa-java"></i>
                    <div class="title-section">
                      <h2>Java 类生成器</h2>
                      <p>代码自动化工具</p>
                    </div>
                  </div>
                  <div class="card-content">
                    <ul class="features">
                      <li class="check-item">Entity/DTO/VO类生成</li>
                      <li class="check-item">Lombok注解支持</li>
                      <li class="check-item">Controller/Service模板</li>
                      <li class="check-item">MyBatis Mapper生成</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/java-gen')">立即使用</a>
                  </div>
                </div>
              </div>
            </div>
          </n-tab-pane>
          
          <n-tab-pane name="dev" tab="开发工具">
            <!-- 开发工具分类内容 -->
          </n-tab-pane>
          
          <n-tab-pane name="java" tab="Java 工具">
            <!-- Java工具分类内容 -->
          </n-tab-pane>
          
          <n-tab-pane name="data" tab="数据处理">
            <!-- 数据处理分类内容 -->
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NCard, NButton, NTag, NTabs, NTabPane } from 'naive-ui'
// @ts-ignore
import PageLayout from '@/components/layout/PageLayout.vue'
// @ts-ignore
import ToolsRightSidebar from '@/components/layout/ToolsRightSidebar.vue'

const router = useRouter()
</script>

<style scoped>
.tools-container {
  padding: 20px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 10px;
}

.tool-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e2e8f0;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.card-header i {
  font-size: 1.8rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 15px;
  color: white;
}

.title-section {
  flex: 1;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1e293b;
}

.card-header p {
  font-size: 0.85rem;
  color: #64748b;
}

.card-content {
  padding: 20px;
  flex-grow: 1;
}

.features {
  list-style-type: none;
  margin-top: 0;
  padding-left: 0;
}

.features li {
  padding: 8px 0;
  position: relative;
  padding-left: 24px;
  font-size: 0.9rem;
}

/* 保留现有的对勾图标样式 */
.features li.check-item:before {
  content: "✓";
  font-family: sans-serif;
  font-weight: normal;
  position: absolute;
  left: 0;
  top: 8px;
  color: #27ae60;
  display: inline-block;
  font-size: 14px;
  width: 14px;
  text-align: center;
}

.card-footer {
  padding: 15px 20px;
  background-color: #f8fafc;
  border-top: 1px solid #f1f5f9;
  text-align: center;
}

.btn {
  display: inline-block;
  padding: 8px 20px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

/* 工具卡片图标背景 */
.git-tool i {
  background: linear-gradient(120deg, #f97316, #ea580c);
}

.maven-tool i {
  background: linear-gradient(120deg, #8b5cf6, #7c3aed);
}

.md5-tool i {
  background: linear-gradient(120deg, #10b981, #059669);
}

.json-tool i {
  background: linear-gradient(120deg, #ef4444, #dc2626);
}

.sql-tool i {
  background: linear-gradient(120deg, #3b82f6, #2563eb);
}

.java-tool i {
  background: linear-gradient(120deg, #f97316, #ea580c);
}

.regex-tool i {
  background: linear-gradient(120deg, #f59e0b, #d97706);
}

/* 媒体查询 */
@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1201px) {
  .tools-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}
</style> 