<template>
  <aside class="w-1/4 max-w-[300px] overflow-y-auto pl-3 pr-2 scrollbar-hide" style="height:100%; border-left:1px solid var(--color-border);">
    <!-- Recent Documents section -->
    <div class="mb-4">
      <h3 class="text-sm font-semibold mb-2">最近浏览</h3>
      <div class="space-y-2">
        <div class="doc-card">
          <div class="doc-icon bg-blue-100 text-blue-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="doc-content">
            <h4 class="text-sm font-medium">Spring Boot 配置指南</h4>
            <p class="text-xs text-gray-500">Java • 5分钟前</p>
          </div>
        </div>

        <div class="doc-card">
          <div class="doc-icon bg-purple-100 text-purple-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="doc-content">
            <h4 class="text-sm font-medium">React Hooks 最佳实践</h4>
            <p class="text-xs text-gray-500">前端 • 昨天</p>
          </div>
        </div>

        <div class="doc-card">
          <div class="doc-icon bg-green-100 text-green-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="doc-content">
            <h4 class="text-sm font-medium">Docker 容器化部署</h4>
            <p class="text-xs text-gray-500">DevOps • 3天前</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Popular Tags section -->
    <div class="mb-4">
      <h3 class="text-sm font-semibold mb-2">热门标签</h3>
      <div class="flex flex-wrap gap-2">
        <span class="tag">Java</span>
        <span class="tag">Spring</span>
        <span class="tag">前端</span>
        <span class="tag">Vue</span>
        <span class="tag">React</span>
        <span class="tag">DevOps</span>
        <span class="tag">数据库</span>
        <span class="tag">Git</span>
      </div>
    </div>

    <!-- Quick Add section -->
    <div class="mb-4">
      <h3 class="text-sm font-semibold mb-2">快速添加</h3>
      <div class="quick-add">
        <button class="quick-add-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
          </svg>
          <span>添加文档</span>
        </button>
      </div>
    </div>

    <!-- Statistics section -->
    <div>
      <h3 class="text-sm font-semibold mb-2">文档统计</h3>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">总文档数</span>
          <span class="stat-value">42</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">标签数</span>
          <span class="stat-value">12</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">本月新增</span>
          <span class="stat-value">8</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.doc-card {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 4px 5px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.doc-icon {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doc-content {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.doc-content h4 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  margin-bottom: 1px;
}

.doc-content p {
  font-size: 10px;
  line-height: 1.2;
}

.tag {
  display: inline-block;
  padding: 2px 6px;
  background-color: #f0f0f0;
  border-radius: 12px;
  font-size: 10px;
  color: #555;
}

.quick-add-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  border: none;
  font-size: 11px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quick-add-btn:hover {
  background-color: #e0e0e0;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  padding: 4px 0;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: 500;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style> 