<template>
  <aside class="w-1/4 max-w-[300px] overflow-y-auto pl-3 pr-2 scrollbar-hide" style="height:100%; border-left:1px solid var(--color-border);">
    <!-- Quick Tips section -->
    <div class="mb-4">
      <h3 class="text-sm font-semibold mb-2">快速提示</h3>
      <div class="space-y-2">
        <div class="tip-card">
          <div class="tip-icon bg-blue-100 text-blue-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z" fill="currentColor"/>
            </svg>
          </div>
          <div class="tip-content">
            <h4 class="text-sm font-medium">Git 技巧</h4>
            <p class="text-xs text-gray-500">使用 git stash 临时保存工作区更改</p>
          </div>
        </div>

        <div class="tip-card">
          <div class="tip-icon bg-purple-100 text-purple-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z" fill="currentColor"/>
            </svg>
          </div>
          <div class="tip-content">
            <h4 class="text-sm font-medium">AI 提示</h4>
            <p class="text-xs text-gray-500">使用 "step by step" 获得详细解释</p>
          </div>
        </div>

        <div class="tip-card">
          <div class="tip-icon bg-green-100 text-green-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z" fill="currentColor"/>
            </svg>
          </div>
          <div class="tip-content">
            <h4 class="text-sm font-medium">JSON 格式化</h4>
            <p class="text-xs text-gray-500">JSON.stringify(obj, null, 2) 格式化</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Documentation section -->
    <div class="mb-4">
      <h3 class="text-sm font-semibold mb-2">相关文档</h3>
      <div class="space-y-1">
        <a href="https://git-scm.com/doc" target="_blank" class="doc-link">
          <svg class="doc-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M2.6,10.59L8.38,4.8L10.07,6.5C9.83,7.35 10.22,8.28 11,8.73V14.27C10.4,14.61 10,15.26 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16C14,15.26 13.6,14.61 13,14.27V9.41L15.07,11.5C15,11.65 15,11.82 15,12A2,2 0 0,0 17,14A2,2 0 0,0 19,12A2,2 0 0,0 17,10C16.82,10 16.65,10 16.5,10.07L13.93,7.5C14.19,6.57 13.71,5.55 12.78,5.16C12.35,5 11.9,4.96 11.5,5.07L9.8,3.38L10.59,2.6C11.37,1.81 12.63,1.81 13.41,2.6L21.4,10.59C22.19,11.37 22.19,12.63 21.4,13.41L13.41,21.4C12.63,22.19 11.37,22.19 10.59,21.4L2.6,13.41C1.81,12.63 1.81,11.37 2.6,10.59Z" />
          </svg>
          <span>Git 文档</span>
        </a>

        <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" class="doc-link">
          <svg class="doc-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M13.5,7A6.5,6.5 0 0,1 20,13.5A6.5,6.5 0 0,1 13.5,20H10V18H13.5C16,18 18,16 18,13.5C18,11 16,9 13.5,9H7.83L10.91,12.09L9.5,13.5L4,8L9.5,2.5L10.92,3.91L7.83,7H13.5M6,18H8V20H6V18Z" />
          </svg>
          <span>Prompt 指南</span>
        </a>

        <a href="https://www.json.org/" target="_blank" class="doc-link">
          <svg class="doc-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M5 3h2v2H5v5a2 2 0 0 1-2 2a2 2 0 0 1 2 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2m14 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2a2 2 0 0 1-2-2V5h-2V3h2m-7 12a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m-4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1Z" />
          </svg>
          <span>JSON 文档</span>
        </a>
      </div>
    </div>

    <!-- Java Resources section -->
    <div class="mb-4">
      <h3 class="text-sm font-semibold mb-2">Java 资源</h3>
      <div class="space-y-1">
        <a href="https://docs.oracle.com/en/java/" target="_blank" class="doc-link">
          <svg class="doc-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M9.37 17.51c-3.09.86 1.87 2.64 5.8 1a7.18 7.18 0 0 1-1.1-.54a11.59 11.59 0 0 1-4.16.18c-1.31-.15-.54-.64-.54-.64m5.33-1.68a16.27 16.27 0 0 1-5.36.26c-1.31-.14-.45-.77-.45-.77c-3.4 1.13 1.89 2.9 6.64 1.08a6.61 6.61 0 0 1-.83-.57m-4.04-8.36c-.95-.02-1.97.18-3.16.59c0 0 .96.85 2.88.18a24.97 24.97 0 0 1 4.5-.37c1.4.03 2.96.21 4.76.5c0 0 .28-.19-.19-.39c-1.58-.57-4.02-.89-5.97-.88c-.9 0-1.92.12-2.82.37m.73 1.7c-.97-.03-1.97.18-3.13.59c0 0 .96.86 2.89.19a24.95 24.95 0 0 1 4.5-.37c1.4.02 2.95.2 4.76.5c0 0 .28-.2-.19-.4c-1.59-.56-4.03-.89-5.98-.88c-.9 0-1.92.12-2.85.37m.47 1.71c-1.95-.06-3.38.34-3.38.75c0 .42 1.67.82 3.75.87c2.08.05 3.77-.27 3.78-.69c0-.42-1.54-.87-4.15-.93m-3.21 4.43c4.92-.04 10.27-.45 10.57.1c0 0-.29.15-.98.34c-3.46.54-11.6.36-11.54-.3c0 0 .23-.1.67-.11a9.72 9.72 0 0 1 1.28-.03m-.76 1.71c4.92-.04 10.27-.45 10.57.1c0 0-.29.15-.98.34c-3.46.54-11.6.36-11.54-.3c0 0 .23-.1.67-.11a9.72 9.72 0 0 1 1.28-.03m.76 1.74c4.92-.04 10.27-.45 10.57.1c0 0-.29.14-.98.33c-3.46.55-11.6.36-11.54-.3c0 0 .23-.09.67-.1a9.72 9.72 0 0 1 1.28-.03m-1.86 1.82c5.08-1.14 11.91.5 11.91.5c0-.38-2.55-.7-5.69-.7c-3.14 0-5.73.26-6.22.2z"/>
          </svg>
          <span>Java API</span>
        </a>

        <a href="https://spring.io/guides" target="_blank" class="doc-link">
          <svg class="doc-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M20.5 10c-.5-2.3-2.5-4-4.8-4H7.9c-.9 0-1.6-.7-1.6-1.6C6.3 3.1 7.4 2 8.8 2c.3 0 .5.1.8.2c.2.1.3.2.5.3c.3.2.6.3.9.3c.6 0 1.2-.3 1.4-.9c.3-.7-.1-1.5-.8-1.8c-.5-.2-1-.3-1.6-.3C7.5-.2 5.2 1.6 5 4.1v.2C4.8 6.5 6.5 8.7 8.8 9h6.9c1.2 0 2.3.8 2.6 2c.2.9-.1 1.8-.8 2.3c-.5.3-.7.9-.6 1.4c.1.5.6.9 1.1 1c1.3.1 2.5-.6 3-1.9c.2-.4.3-.9.3-1.4c.1-.5.1-1.1.2-1.7c.1-.7 0-1.2 0-1.7"/>
          </svg>
          <span>Spring</span>
        </a>

        <a href="https://maven.apache.org/guides/" target="_blank" class="doc-link">
          <svg class="doc-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M3.16 2c-.17 0-.34.05-.5.14C2.5 2.23 2.35 2.35 2.23 2.5s-.19.33-.19.5v18c0 .18.06.34.19.5.12.15.27.27.43.36.16.09.33.14.5.14h17.68c.17 0 .34-.05.5-.14.16-.09.31-.21.43-.36.13-.16.19-.32.19-.5V3c0-.17-.06-.35-.19-.5-.12-.15-.27-.27-.43-.36-.16-.09-.33-.14-.5-.14H3.16z"/>
          </svg>
          <span>Maven</span>
        </a>
      </div>
    </div>

    <!-- Updates section -->
    <div>
      <h3 class="text-sm font-semibold mb-2">最近更新</h3>
      <div class="update-item">
        <div class="update-date">2023-11-15</div>
        <div class="update-content">
          <h4>Git 工具新增分支图生成</h4>
          <p class="text-gray-500">可视化展示分支合并历史</p>
        </div>
      </div>
      <div class="update-item">
        <div class="update-date">2023-11-10</div>
        <div class="update-content">
          <h4>AI 提示词库增加 30+ 模板</h4>
          <p class="text-gray-500">覆盖代码生成、文案创作等场景</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// No additional logic needed for now
</script>

<style scoped>
.tip-card {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 4px 5px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.tip-icon {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.tip-content h4 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  margin-bottom: 1px;
}

.tip-content p {
  font-size: 10px;
  line-height: 1.2;
}

.doc-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 5px;
  border-radius: 4px;
  color: #333;
  text-decoration: none;
  font-size: 11px;
  transition: background-color 0.2s;
}

.doc-link:hover {
  background-color: #f5f5f5;
}

.doc-icon {
  width: 12px;
  height: 12px;
  color: #666;
  flex-shrink: 0;
}

.update-item {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.update-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.update-date {
  font-size: 10px;
  color: #888;
  margin-bottom: 2px;
}

.update-content h4 {
  font-size: 11px;
  margin-bottom: 1px;
}

.update-content p {
  font-size: 10px;
  line-height: 1.2;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style> 