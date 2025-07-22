<template>
  <PageLayout :rightSidebar="ToolsRightSidebar">
    <div class="tools-container">
      <div class="mb-6">
        <n-tabs type="line" animated>
          <n-tab-pane name="all" tab="全部">
            <div class="tool-category mb-8">
              <h2 class="text-lg font-medium mb-4">开发工具</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Git 工具集 -->
                <n-card class="tool-card" hoverable>
                  <template #cover>
                    <div class="tool-cover bg-gradient-to-r from-blue-50 to-blue-100">
                      <div class="icon-wrapper bg-blue-500">
                        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M2.6,10.59L8.38,4.8L10.07,6.5C9.83,7.35 10.22,8.28 11,8.73V14.27C10.4,14.61 10,15.26 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16C14,15.26 13.6,14.61 13,14.27V9.41L15.07,11.5C15,11.65 15,11.82 15,12A2,2 0 0,0 17,14A2,2 0 0,0 19,12A2,2 0 0,0 17,10C16.82,10 16.65,10 16.5,10.07L13.93,7.5C14.19,6.57 13.71,5.55 12.78,5.16C12.35,5 11.9,4.96 11.5,5.07L9.8,3.38L10.59,2.6C11.37,1.81 12.63,1.81 13.41,2.6L21.4,10.59C22.19,11.37 22.19,12.63 21.4,13.41L13.41,21.4C12.63,22.19 11.37,22.19 10.59,21.4L2.6,13.41C1.81,12.63 1.81,11.37 2.6,10.59Z" />
                        </svg>
                      </div>
                    </div>
                  </template>
                  <template #header>
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg font-medium">Git 工具集</h3>
                      <n-tag type="info" size="small">开发</n-tag>
                    </div>
                  </template>
                  <div class="text-gray-500 text-sm mb-4">
                    常用 Git 命令速查、分支图生成、commit message 模板生成
                  </div>
                  <n-button type="primary" ghost block @click="router.push('/tools/git')">
                    进入工具
                  </n-button>
                </n-card>

                <!-- Maven 依赖查询 -->
                <n-card class="tool-card" hoverable>
                  <template #cover>
                    <div class="tool-cover bg-gradient-to-r from-red-50 to-red-100">
                      <div class="icon-wrapper bg-red-500">
                        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M3.16 2c-.17 0-.34.05-.5.14C2.5 2.23 2.35 2.35 2.23 2.5s-.19.33-.19.5v18c0 .18.06.34.19.5.12.15.27.27.43.36.16.09.33.14.5.14h17.68c.17 0 .34-.05.5-.14.16-.09.31-.21.43-.36.13-.16.19-.32.19-.5V3c0-.17-.06-.35-.19-.5-.12-.15-.27-.27-.43-.36-.16-.09-.33-.14-.5-.14H3.16zm.34 1h17v18h-17V3zm2.5 4v1h12v-1h-12zm0 4v1h10v-1h-10zm0 4v1h12v-1h-12z"/>
                        </svg>
                      </div>
                    </div>
                  </template>
                  <template #header>
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg font-medium">Maven 依赖查询</h3>
                      <n-tag type="error" size="small">Java</n-tag>
                    </div>
                  </template>
                  <div class="text-gray-500 text-sm mb-4">
                    搜索 Maven 中央仓库、查看依赖树、生成 POM 配置
                  </div>
                  <n-button type="primary" ghost block @click="router.push('/tools/maven')">
                    进入工具
                  </n-button>
                </n-card>
              </div>
            </div>

            <div class="tool-category mb-8">
              <h2 class="text-lg font-medium mb-4">效率工具</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- AI 提示词库 -->
                <n-card class="tool-card" hoverable>
                  <template #cover>
                    <div class="tool-cover bg-gradient-to-r from-purple-50 to-purple-100">
                      <div class="icon-wrapper bg-purple-500">
                        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 1.99 12v2a1 1 0 0 0 1 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0 1-1v-1.938a1.006 1.006 0 0 0-.072-.455zM5 20V8h14l.001 3.996L19 12v2l.001.005.001 5.995H5z" />
                          <ellipse fill="currentColor" cx="8.5" cy="12" rx="1.5" ry="2" />
                          <ellipse fill="currentColor" cx="15.5" cy="12" rx="1.5" ry="2" />
                          <path fill="currentColor" d="M8 16h8v2H8z" />
                        </svg>
                      </div>
                    </div>
                  </template>
                  <template #header>
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg font-medium">AI 提示词库</h3>
                      <n-tag type="success" size="small">效率</n-tag>
                    </div>
                  </template>
                  <div class="text-gray-500 text-sm mb-4">
                    自定义 Prompt 模板库，支持变量占位、复制到剪贴板
                  </div>
                  <n-button type="primary" ghost block @click="router.push('/tools/prompts')">
                    进入工具
                  </n-button>
                </n-card>

                <!-- 正则表达式测试 -->
                <n-card class="tool-card" hoverable>
                  <template #cover>
                    <div class="tool-cover bg-gradient-to-r from-yellow-50 to-yellow-100">
                      <div class="icon-wrapper bg-yellow-500">
                        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M16 16.92c5.02-2.54 6.84-8.4 4.3-13.42-2.54-5.02-8.4-6.84-13.42-4.3-5.02 2.54-6.84 8.4-4.3 13.42 2.54 5.02 8.4 6.84 13.42 4.3M2 21v-2l3-3 2.5 2.5L10 16l3 3v2H2Z"/>
                        </svg>
                      </div>
                    </div>
                  </template>
                  <template #header>
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg font-medium">正则表达式测试</h3>
                      <n-tag type="warning" size="small">测试</n-tag>
                    </div>
                  </template>
                  <div class="text-gray-500 text-sm mb-4">
                    实时测试正则表达式，支持多种语言语法，可视化匹配结果
                  </div>
                  <n-button type="primary" ghost block @click="router.push('/tools/regex')">
                    进入工具
                  </n-button>
                </n-card>
              </div>
            </div>

            <div class="tool-category mb-8">
              <h2 class="text-lg font-medium mb-4">数据处理</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- JSON/XML 工具 -->
                <n-card class="tool-card" hoverable>
                  <template #cover>
                    <div class="tool-cover bg-gradient-to-r from-green-50 to-green-100">
                      <div class="icon-wrapper bg-green-500">
                        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M5 3h2v2H5v5a2 2 0 0 1-2 2a2 2 0 0 1 2 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2m14 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2a2 2 0 0 1-2-2V5h-2V3h2m-7 12a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m-4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1Z" />
                        </svg>
                      </div>
                    </div>
                  </template>
                  <template #header>
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg font-medium">JSON/XML 工具</h3>
                      <n-tag type="warning" size="small">格式化</n-tag>
                    </div>
                  </template>
                  <div class="text-gray-500 text-sm mb-4">
                    高亮 + 折叠 + 格式化；支持双向转换 JSON ⇄ XML；剪贴板导入导出
                  </div>
                  <n-button type="primary" ghost block @click="router.push('/tools/format')">
                    进入工具
                  </n-button>
                </n-card>

                <!-- SQL 格式化 -->
                <n-card class="tool-card" hoverable>
                  <template #cover>
                    <div class="tool-cover bg-gradient-to-r from-blue-50 to-blue-100">
                      <div class="icon-wrapper bg-blue-600">
                        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M12 3C7.58 3 4 4.79 4 7V17C4 19.21 7.59 21 12 21S20 19.21 20 17V7C20 4.79 16.42 3 12 3M18 17C18 17.5 15.87 19 12 19S6 17.5 6 17V14.77C7.61 15.55 9.72 16 12 16S16.39 15.55 18 14.77V17M18 12.45C16.7 13.4 14.42 14 12 14C9.58 14 7.3 13.4 6 12.45V9.64C7.47 10.47 9.61 11 12 11C14.39 11 16.53 10.47 18 9.64V12.45M12 9C8.13 9 6 7.5 6 7S8.13 5 12 5C15.87 5 18 6.5 18 7S15.87 9 12 9Z"/>
                        </svg>
                      </div>
                    </div>
                  </template>
                  <template #header>
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg font-medium">SQL 格式化</h3>
                      <n-tag type="info" size="small">数据库</n-tag>
                    </div>
                  </template>
                  <div class="text-gray-500 text-sm mb-4">
                    美化 SQL 查询语句，支持多种数据库方言，语法高亮显示
                  </div>
                  <n-button type="primary" ghost block @click="router.push('/tools/sql')">
                    进入工具
                  </n-button>
                </n-card>
              </div>
            </div>

            <div class="tool-category mb-8">
              <h2 class="text-lg font-medium mb-4">Java 开发</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Spring Boot 配置生成 -->
                <n-card class="tool-card" hoverable>
                  <template #cover>
                    <div class="tool-cover bg-gradient-to-r from-green-50 to-green-100">
                      <div class="icon-wrapper bg-green-600">
                        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M20.5 10c-.5-2.3-2.5-4-4.8-4H7.9c-.9 0-1.6-.7-1.6-1.6C6.3 3.1 7.4 2 8.8 2c.3 0 .5.1.8.2c.2.1.3.2.5.3c.3.2.6.3.9.3c.6 0 1.2-.3 1.4-.9c.3-.7-.1-1.5-.8-1.8c-.5-.2-1-.3-1.6-.3C7.5-.2 5.2 1.6 5 4.1v.2C4.8 6.5 6.5 8.7 8.8 9h6.9c1.2 0 2.3.8 2.6 2c.2.9-.1 1.8-.8 2.3c-.5.3-.7.9-.6 1.4c.1.5.6.9 1.1 1c1.3.1 2.5-.6 3-1.9c.2-.4.3-.9.3-1.4c.1-.5.1-1.1.2-1.7c.1-.7 0-1.2 0-1.7M9.9 14c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m4 4c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-8-2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m12 2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-4-6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"/>
                        </svg>
                      </div>
                    </div>
                  </template>
                  <template #header>
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg font-medium">Spring Boot 配置</h3>
                      <n-tag type="success" size="small">Spring</n-tag>
                    </div>
                  </template>
                  <div class="text-gray-500 text-sm mb-4">
                    生成 application.yml/properties 配置，常用注解速查
                  </div>
                  <n-button type="primary" ghost block @click="router.push('/tools/spring')">
                    进入工具
                  </n-button>
                </n-card>

                <!-- Java 类生成器 -->
                <n-card class="tool-card" hoverable>
                  <template #cover>
                    <div class="tool-cover bg-gradient-to-r from-orange-50 to-orange-100">
                      <div class="icon-wrapper bg-orange-500">
                        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M9.37 17.51c-3.09.86 1.87 2.64 5.8 1a7.18 7.18 0 0 1-1.1-.54a11.59 11.59 0 0 1-4.16.18c-1.31-.15-.54-.64-.54-.64m5.33-1.68a16.27 16.27 0 0 1-5.36.26c-1.31-.14-.45-.77-.45-.77c-3.4 1.13 1.89 2.9 6.64 1.08a6.61 6.61 0 0 1-.83-.57m-4.04-8.36c-.95-.02-1.97.18-3.16.59c0 0 .96.85 2.88.18a24.97 24.97 0 0 1 4.5-.37c1.4.03 2.96.21 4.76.5c0 0 .28-.19-.19-.39c-1.58-.57-4.02-.89-5.97-.88c-.9 0-1.92.12-2.82.37m.73 1.7c-.97-.03-1.97.18-3.13.59c0 0 .96.86 2.89.19a24.95 24.95 0 0 1 4.5-.37c1.4.02 2.95.2 4.76.5c0 0 .28-.2-.19-.4c-1.59-.56-4.03-.89-5.98-.88c-.9 0-1.92.12-2.85.37m.47 1.71c-1.95-.06-3.38.34-3.38.75c0 .42 1.67.82 3.75.87c2.08.05 3.77-.27 3.78-.69c0-.42-1.54-.87-4.15-.93m-3.21 4.43c4.92-.04 10.27-.45 10.57.1c0 0-.29.15-.98.34c-3.46.54-11.6.36-11.54-.3c0 0 .23-.1.67-.11a9.72 9.72 0 0 1 1.28-.03m-.76 1.71c4.92-.04 10.27-.45 10.57.1c0 0-.29.15-.98.34c-3.46.54-11.6.36-11.54-.3c0 0 .23-.1.67-.11a9.72 9.72 0 0 1 1.28-.03m.76 1.74c4.92-.04 10.27-.45 10.57.1c0 0-.29.14-.98.33c-3.46.55-11.6.36-11.54-.3c0 0 .23-.09.67-.1a9.72 9.72 0 0 1 1.28-.03m-1.86 1.82c5.08-1.14 11.91.5 11.91.5c0-.38-2.55-.7-5.69-.7c-3.14 0-5.73.26-6.22.2z"/>
                        </svg>
                      </div>
                    </div>
                  </template>
                  <template #header>
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg font-medium">Java 类生成器</h3>
                      <n-tag type="error" size="small">代码</n-tag>
                    </div>
                  </template>
                  <div class="text-gray-500 text-sm mb-4">
                    生成 Entity/DTO/VO/Controller 等常用类，支持 Lombok
                  </div>
                  <n-button type="primary" ghost block @click="router.push('/tools/java-gen')">
                    进入工具
                  </n-button>
                </n-card>
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
  padding: 10px;
}

.tool-card {
  transition: transform 0.2s ease;
}

.tool-card:hover {
  transform: translateY(-5px);
}

.tool-cover {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon {
  width: 32px;
  height: 32px;
}
</style> 