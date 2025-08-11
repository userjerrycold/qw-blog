<template>
  <div class="wendao-build">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">问道搭建</h1>
      <p class="page-subtitle">完整的问道私服搭建指南</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 搭建步骤展示 -->
      <div class="build-steps">
        <div class="step-card" v-for="(step, index) in buildSteps" :key="index">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
            <div class="step-details">
              <ul>
                <li v-for="detail in step.details" :key="detail">{{ detail }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 下载资源区域 -->
      <div class="download-section">
        <h2 class="section-title">下载资源</h2>
        <div class="download-cards">
          <div class="download-card" v-for="resource in downloadResources" :key="resource.id">
            <div class="resource-icon">{{ resource.icon }}</div>
            <h3 class="resource-title">{{ resource.title }}</h3>
            <p class="resource-description">{{ resource.description }}</p>
            <div class="resource-info">
              <span class="resource-size">{{ resource.size }}</span>
              <span class="resource-version">{{ resource.version }}</span>
            </div>
            <button class="download-btn" @click="downloadResource(resource)">
              <span class="download-icon">⬇</span>
              立即下载
            </button>
          </div>
        </div>
      </div>

      <!-- 注意事项 -->
      <div class="notice-section">
        <h2 class="section-title">重要提醒</h2>
        <div class="notice-card">
          <div class="notice-content">
            <h3>搭建前必读</h3>
            <ul class="notice-list">
              <li>确保服务器配置满足最低要求（2核4G内存）</li>
              <li>建议使用CentOS 7.x或Ubuntu 18.04+系统</li>
              <li>搭建过程中请保持网络稳定</li>
              <li>首次搭建建议预留2-3小时时间</li>
              <li>遇到问题可参考常见问题解答或联系技术支持</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 搭建步骤数据
const buildSteps = ref([
  {
    title: '环境准备',
    description: '准备服务器环境和必要的软件依赖',
    details: [
      '准备一台Linux服务器（推荐CentOS 7.x）',
      '安装MySQL 5.7数据库',
      '安装Java 8运行环境',
      '配置防火墙和安全组规则'
    ]
  },
  {
    title: '文件上传',
    description: '上传问道服务端文件到服务器',
    details: [
      '使用FTP工具上传服务端压缩包',
      '解压到指定目录（建议/opt/wendao/）',
      '设置文件权限为755',
      '检查文件完整性'
    ]
  },
  {
    title: '数据库配置',
    description: '创建数据库并导入初始数据',
    details: [
      '创建wendao数据库',
      '导入基础数据表结构',
      '导入游戏初始数据',
      '创建数据库用户并授权'
    ]
  },
  {
    title: '服务器配置',
    description: '配置游戏服务器参数',
    details: [
      '修改数据库连接配置',
      '设置服务器IP和端口',
      '配置游戏参数（经验倍率等）',
      '设置日志输出路径'
    ]
  },
  {
    title: '启动测试',
    description: '启动服务器并进行功能测试',
    details: [
      '启动游戏服务器',
      '检查服务器日志',
      '测试客户端连接',
      '验证基础功能正常'
    ]
  }
])

// 下载资源数据
const downloadResources = ref([
  {
    id: 1,
    title: '问道服务端',
    description: '完整的问道私服服务端程序',
    size: '2.8GB',
    version: 'v2.0.8',
    icon: '🖥️'
  },
  {
    id: 2,
    title: '客户端补丁',
    description: '配套的客户端连接补丁',
    size: '156MB',
    version: 'v2.0.8',
    icon: '🔧'
  },
  {
    id: 3,
    title: '数据库文件',
    description: '游戏数据库备份文件',
    size: '892MB',
    version: 'v2.0.8',
    icon: '🗄️'
  },
  {
    id: 4,
    title: '搭建工具包',
    description: '一键搭建脚本和工具',
    size: '45MB',
    version: 'v1.2.0',
    icon: '⚡'
  }
])

// 下载资源方法
const downloadResource = (resource: any) => {
  console.log(`开始下载: ${resource.title}`)
  // 这里可以添加实际的下载逻辑
  alert(`开始下载 ${resource.title}，请稍候...`)
}

// 页面加载动画
onMounted(() => {
  console.log('问道搭建页面已加载')
  // 添加渐入动画
  const cards = document.querySelectorAll('.step-card, .download-card')
  cards.forEach((card: Element, index: number) => {
    const htmlCard = card as HTMLElement
    htmlCard.style.opacity = '0'
    htmlCard.style.transform = 'translateY(30px)'
    
    setTimeout(() => {
      htmlCard.style.transition = 'all 0.6s ease'
      htmlCard.style.opacity = '1'
      htmlCard.style.transform = 'translateY(0)'
    }, index * 150)
  })
})
</script>

<style scoped>
.wendao-build {
  background: linear-gradient(135deg, 
    #2c3e50 0%,     /* 深蓝灰 */
    #34495e 25%,    /* 石板蓝 */ 
    #5d4e75 50%,    /* 丹青紫 */
    #8b7355 75%,    /* 古铜色 */
    #a0826d 100%    /* 暖褐色 */
  );
  padding: 40px 20px;
  position: relative;
  overflow-y: auto;
  /* 隐藏滚动条但保持滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 和 Edge */
}

.wendao-build::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.wendao-build::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%);
  pointer-events: none;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  z-index: 2;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef, #dee2e6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.page-subtitle {
  font-size: 1.2rem;
  color: rgba(255,255,255,0.8);
  font-weight: 300;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.build-steps {
  margin-bottom: 60px;
}

.step-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 25px;
  display: flex;
  align-items: flex-start;
  gap: 25px;
  transition: all 0.4s ease;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.step-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  background: rgba(255,255,255,0.15);
}

.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
}

.step-description {
  color: rgba(255,255,255,0.8);
  margin-bottom: 15px;
  line-height: 1.6;
}

.step-details ul {
  list-style: none;
  padding: 0;
}

.step-details li {
  color: rgba(255,255,255,0.7);
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  line-height: 1.5;
}

.step-details li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.download-section, .notice-section {
  margin-bottom: 50px;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 30px;
  text-align: center;
}

.download-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.download-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.4s ease;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.download-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  background: rgba(255,255,255,0.15);
}

.resource-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.resource-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
}

.resource-description {
  color: rgba(255,255,255,0.8);
  margin-bottom: 20px;
  line-height: 1.5;
}

.resource-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  padding: 10px 0;
  border-top: 1px solid rgba(255,255,255,0.1);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.resource-size, .resource-version {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
}

.download-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.download-icon {
  font-size: 1.2rem;
}

.notice-section {
  margin-bottom: 0;
}

.notice-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.notice-content h3 {
  color: white;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.notice-list {
  list-style: none;
  padding: 0;
}

.notice-list li {
  color: rgba(255,255,255,0.8);
  padding: 10px 0;
  padding-left: 25px;
  position: relative;
  line-height: 1.6;
}

.notice-list li::before {
  content: '⚠️';
  position: absolute;
  left: 0;
  top: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .step-card {
    flex-direction: column;
    text-align: center;
  }
  
  .step-number {
    align-self: center;
  }
  
  .download-cards {
    grid-template-columns: 1fr;
  }
}
</style>
