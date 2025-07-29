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
                    <h2>Git 工具集</h2>
                    <p>版本控制与协作开发</p>
                  </div>
                  <div class="card-content">
                    <p>高效管理代码版本，简化团队协作流程</p>
                    <ul class="features">
                      <li class="check-item">常用命令速查手册</li>
                      <li class="check-item">可视化分支图生成器</li>
                      <li class="check-item">智能 Commit 模板</li>
                      <li class="check-item">工作流最佳实践指南</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/git')">使用工具</a>
                  </div>
                </div>
                
                <!-- Maven 工具 -->
                <div class="tool-card maven-tool">
                  <div class="card-header">
                    <i class="fas fa-cogs"></i>
                    <h2>Maven 工具</h2>
                    <p>Java 项目管理专家</p>
                  </div>
                  <div class="card-content">
                    <p>简化 Java 项目构建与依赖管理</p>
                    <ul class="features">
                      <li class="check-item">常用命令快速参考</li>
                      <li class="check-item">智能依赖查询与分析</li>
                      <li class="check-item">常见问题解决方案库</li>
                      <li class="check-item">依赖冲突检测工具</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/maven')">使用工具</a>
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
                    <h2>MD5 加密工具</h2>
                    <p>安全加密解决方案</p>
                  </div>
                  <div class="card-content">
                    <p>快速安全的文本与文件加密工具</p>
                    <ul class="features">
                      <li class="check-item">文本即时加密/解密</li>
                      <li class="check-item">文件 MD5 值计算</li>
                      <li class="check-item">批量文件校验功能</li>
                      <li class="check-item">加密结果历史记录</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/md5')">使用工具</a>
                  </div>
                </div>

                <!-- 正则表达式 -->
                <div class="tool-card regex-tool">
                  <div class="card-header">
                    <i class="fas fa-code"></i>
                    <h2>正则表达式</h2>
                    <p>模式匹配专家</p>
                  </div>
                  <div class="card-content">
                    <p>强大的文本模式匹配与处理工具</p>
                    <ul class="features">
                      <li class="check-item">实时正则表达式测试</li>
                      <li class="check-item">常用正则表达式库</li>
                      <li class="check-item">批量文本查找替换</li>
                      <li class="check-item">正则匹配可视化解析</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/regex')">使用工具</a>
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
                    <h2>JSON 工具</h2>
                    <p>数据格式处理专家</p>
                  </div>
                  <div class="card-content">
                    <p>强大的 JSON 数据处理与转换工具</p>
                    <ul class="features">
                      <li class="check-item">智能格式化与压缩</li>
                      <li class="check-item">JSON/XML 双向转换</li>
                      <li class="check-item">JSON 数据验证</li>
                      <li class="check-item">根据 JSON 生成实体类</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/json')">使用工具</a>
                  </div>
                </div>

                <!-- SQL 格式化 -->
                <div class="tool-card sql-tool">
                  <div class="card-header">
                    <i class="fas fa-database"></i>
                    <h2>SQL 格式化</h2>
                    <p>数据库语句优化工具</p>
                  </div>
                  <div class="card-content">
                    <p>专业的SQL语句格式化与优化工具</p>
                    <ul class="features">
                      <li class="check-item">智能SQL语句格式化</li>
                      <li class="check-item">多种数据库语法支持</li>
                      <li class="check-item">SQL语句性能分析</li>
                      <li class="check-item">常用SQL模板库</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/sql')">使用工具</a>
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
                    <h2>Java 类生成器</h2>
                    <p>代码自动化工具</p>
                  </div>
                  <div class="card-content">
                    <p>一键生成Java代码，提高开发效率</p>
                    <ul class="features">
                      <li class="check-item">Entity/DTO/VO类生成</li>
                      <li class="check-item">Lombok注解支持</li>
                      <li class="check-item">Controller/Service模板</li>
                      <li class="check-item">MyBatis Mapper生成</li>
                    </ul>
                  </div>
                  <div class="card-footer">
                    <a class="btn" @click="router.push('/tools/java-gen')">使用工具</a>
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 10px;
}

.tool-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 520px; /* 限制卡片高度，更紧凑 */
}

.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px 20px 15px; /* 减小内边距 */
  color: white;
  text-align: left; /* 确保文字左对齐 */
}

.card-header i {
  font-size: 2rem; /* 减小图标尺寸 */
  margin-bottom: 12px;
  display: block;
}

.card-header h2 {
  font-size: 1.4rem; /* 减小标题尺寸 */
  font-weight: 600;
  margin-bottom: 6px;
  text-align: left; /* 确保标题左对齐 */
}

.card-header p {
  font-size: 0.9rem; /* 减小副标题尺寸 */
  text-align: left; /* 确保副标题左对齐 */
}

.card-content {
  padding: 20px; /* 减小内边距 */
  flex-grow: 1;
  text-align: left; /* 确保内容左对齐 */
}

.card-content p {
  color: #333; /* 使文本颜色更深，增强对比度 */
  font-size: 0.95rem; /* 调整文本大小 */
  margin-bottom: 12px;
  text-align: left; /* 确保段落左对齐 */
}

.features {
  list-style-type: none;
  margin-top: 12px;
  text-align: left; /* 确保列表左对齐 */
  padding-left: 0; /* 移除可能的左内边距 */
}

.features li {
  padding: 6px 0; /* 减小内边距，更紧凑 */
  position: relative;
  padding-left: 28px;
  color: #333; /* 使文本颜色更深 */
  font-size: 0.9rem; /* 稍微减小字体 */
  text-align: left; /* 确保列表项左对齐 */
}

/* 两种对勾样式 */
.features li:before,
.features li.check-item:before {
  content: "\f00c"; /* Font Awesome 对勾图标 */
  font-family: "Font Awesome 6 Free", "FontAwesome"; /* 添加备用字体名称 */
  font-weight: 900;
  position: absolute;
  left: 0;
  top: 8px; /* 调整为8px，与tool.html一致 */
  color: #27ae60; /* 绿色对勾 */
  display: inline-block; /* 确保图标正常显示 */
  font-size: 14px; /* 明确设置图标大小 */
  width: 14px; /* 固定宽度 */
  text-align: center; /* 居中对齐 */
}

/* 提供备选方案：如果Font Awesome图标无法显示，使用Unicode对勾 */
.features li.fallback:before {
  content: "✓"; /* Unicode对勾字符 */
  font-family: sans-serif; /* 使用系统字体 */
}

/* 添加一个确保对勾显示的备用类 */
.check-item:before {
  content: "✓" !important; /* 强制使用Unicode对勾字符 */
  font-family: sans-serif !important; /* 使用系统字体 */
  color: #27ae60 !important; /* 保持绿色 */
}

.card-footer {
  padding: 15px 20px; /* 减小内边距 */
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
  text-align: center; /* 按钮保持居中对齐 */
}

.btn {
  display: inline-block;
  padding: 10px 24px; /* 减小按钮内边距 */
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 0.95rem; /* 减小按钮文字大小 */
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 工具卡片背景色 */
.git-tool .card-header {
  background: linear-gradient(120deg, #f39c12, #e74c3c);
}

.maven-tool .card-header {
  background: linear-gradient(120deg, #9b59b6, #34495e);
}

.md5-tool .card-header {
  background: linear-gradient(120deg, #27ae60, #16a085);
}

.json-tool .card-header {
  background: linear-gradient(120deg, #e74c3c, #c0392b);
}

.sql-tool .card-header {
  background: linear-gradient(120deg, #3498db, #2980b9);
}

.java-tool .card-header {
  background: linear-gradient(120deg, #ff5722, #e64a19);
}

.regex-tool .card-header {
  background: linear-gradient(120deg, #ffb300, #fb8c00);
}

.git-tool .btn {
  background: linear-gradient(120deg, #f39c12, #e74c3c);
}

.maven-tool .btn {
  background: linear-gradient(120deg, #9b59b6, #34495e);
}

.md5-tool .btn {
  background: linear-gradient(120deg, #27ae60, #16a085);
}

.json-tool .btn {
  background: linear-gradient(120deg, #e74c3c, #c0392b);
}

.sql-tool .btn {
  background: linear-gradient(120deg, #3498db, #2980b9);
}

.java-tool .btn {
  background: linear-gradient(120deg, #ff5722, #e64a19);
}

.regex-tool .btn {
  background: linear-gradient(120deg, #ffb300, #fb8c00);
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
    grid-template-columns: repeat(3, 1fr); /* 默认显示三列，更接近tool.html */
  }
}
</style> 