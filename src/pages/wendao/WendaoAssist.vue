<template>
  <div class="wendao-assist">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">问道辅助</h1>
      <p class="page-subtitle">专业的问道游戏辅助工具集合</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <!-- 辅助工具展示 -->
      <div class="assist-tools">
        <div class="tool-card" v-for="(tool, index) in assistTools" :key="index">
          <div class="tool-icon">{{ tool.icon }}</div>
          <div class="tool-content">
            <h3 class="tool-title">{{ tool.title }}</h3>
            <p class="tool-description">{{ tool.description }}</p>
            <div class="tool-features">
              <div class="feature-tag" v-for="feature in tool.features" :key="feature">
                {{ feature }}
              </div>
            </div>
            <div class="tool-info">
              <span class="tool-version">版本：{{ tool.version }}</span>
              <span class="tool-size">大小：{{ tool.size }}</span>
              <span class="tool-compatibility">兼容性：{{ tool.compatibility }}</span>
            </div>
            <div class="tool-actions">
              <button class="preview-btn" @click="previewTool(tool)">
                <span class="btn-icon">👁️</span>
                预览截图
              </button>
              <button class="download-btn" @click="downloadTool(tool)">
                <span class="btn-icon">⬇️</span>
                立即下载
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用说明区域 -->
      <div class="usage-section">
        <h2 class="section-title">使用指南</h2>
        <div class="usage-tabs">
          <div 
            class="tab-item" 
            v-for="(tab, index) in usageTabs" 
            :key="index"
            :class="{ active: activeTab === index }"
            @click="activeTab = index"
          >
            {{ tab.title }}
          </div>
        </div>
        <div class="tab-content">
          <div class="usage-card">
            <h3>{{ usageTabs[activeTab].title }}</h3>
            <div class="usage-steps">
              <div 
                class="usage-step" 
                v-for="(step, index) in usageTabs[activeTab].steps" 
                :key="index"
              >
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-text">{{ step }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全提醒 -->
      <div class="security-section">
        <h2 class="section-title">安全提醒</h2>
        <div class="security-card">
          <div class="security-icon">🛡️</div>
          <div class="security-content">
            <h3>使用须知</h3>
            <div class="security-warnings">
              <div class="warning-item">
                <span class="warning-icon">⚠️</span>
                <span>请在游戏允许的范围内使用辅助工具</span>
              </div>
              <div class="warning-item">
                <span class="warning-icon">⚠️</span>
                <span>使用前请关闭杀毒软件，避免误报</span>
              </div>
              <div class="warning-item">
                <span class="warning-icon">⚠️</span>
                <span>建议在虚拟机或测试环境中首次使用</span>
              </div>
              <div class="warning-item">
                <span class="warning-icon">⚠️</span>
                <span>不承担因使用辅助工具产生的任何后果</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 辅助工具数据
const assistTools = ref([
  {
    title: '问道全能助手',
    description: '集成多种实用功能的综合性辅助工具，支持自动任务、快速操作等功能',
    icon: '🚀',
    features: ['自动任务', '快速操作', '数据统计', '界面美化'],
    version: 'v3.2.1',
    size: '12.5MB',
    compatibility: 'Windows 7/8/10/11'
  },
  {
    title: '修炼加速器',
    description: '专注于修炼效率提升的辅助工具，帮助玩家更高效地进行角色培养',
    icon: '⚡',
    features: ['修炼优化', '经验计算', '时间管理', '进度追踪'],
    version: 'v2.8.6',
    size: '8.3MB',
    compatibility: 'Windows 7/8/10/11'
  },
  {
    title: '交易小助手',
    description: '便捷的交易辅助工具，提供价格查询、交易记录等实用功能',
    icon: '💰',
    features: ['价格查询', '交易记录', '利润计算', '市场分析'],
    version: 'v1.9.4',
    size: '6.7MB',
    compatibility: 'Windows 7/8/10/11'
  },
  {
    title: '宠物管理器',
    description: '专业的宠物培养辅助工具，帮助玩家更好地管理和培养宠物',
    icon: '🐾',
    features: ['属性计算', '成长预测', '技能搭配', '培养建议'],
    version: 'v2.1.8',
    size: '9.2MB',
    compatibility: 'Windows 7/8/10/11'
  }
])

// 使用指南标签页
const activeTab = ref(0)
const usageTabs = ref([
  {
    title: '安装教程',
    steps: [
      '下载对应的辅助工具安装包',
      '关闭杀毒软件和Windows Defender',
      '右键以管理员身份运行安装程序',
      '按照安装向导完成安装过程',
      '首次运行时选择游戏目录',
      '根据需要配置相关参数'
    ]
  },
  {
    title: '功能设置',
    steps: [
      '启动辅助工具并登录账号',
      '在设置面板中配置基础参数',
      '根据角色职业选择合适的功能模块',
      '设置自动化任务的执行条件',
      '调整界面布局和快捷键',
      '保存配置并重启工具生效'
    ]
  },
  {
    title: '常见问题',
    steps: [
      '工具无法启动：检查是否以管理员权限运行',
      '功能不生效：确认游戏版本与工具版本匹配',
      '被杀毒软件拦截：添加到白名单或关闭实时保护',
      '游戏闪退：降低工具功能强度或更新版本',
      '数据不准确：清除缓存数据并重新校准',
      '其他问题：联系技术支持获取帮助'
    ]
  }
])

// 预览工具
const previewTool = (tool: any) => {
  console.log(`预览工具: ${tool.title}`)
  alert(`正在加载 ${tool.title} 的预览截图...`)
}

// 下载工具
const downloadTool = (tool: any) => {
  console.log(`下载工具: ${tool.title}`)
  alert(`开始下载 ${tool.title}，请稍候...`)
}

// 页面加载动画
onMounted(() => {
  console.log('问道辅助页面已加载')
  // 添加渐入动画
  const cards = document.querySelectorAll('.tool-card, .usage-card, .security-card')
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
.wendao-assist {
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

.wendao-assist::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.wendao-assist::before {
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

.assist-tools {
  margin-bottom: 60px;
}

.tool-card {
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

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  background: rgba(255,255,255,0.15);
}

.tool-icon {
  font-size: 3rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  flex-shrink: 0;
}

.tool-content {
  flex: 1;
}

.tool-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
}

.tool-description {
  color: rgba(255,255,255,0.8);
  margin-bottom: 15px;
  line-height: 1.6;
}

.tool-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.feature-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.tool-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tool-version, .tool-size, .tool-compatibility {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
}

.tool-actions {
  display: flex;
  gap: 15px;
}

.preview-btn, .download-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

.preview-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.download-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.usage-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 30px;
  text-align: center;
}

.usage-tabs {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-bottom: 30px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 5px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
}

.tab-item {
  flex: 1;
  padding: 12px 20px;
  text-align: center;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 20px;
  font-weight: 500;
}

.tab-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.tab-item:hover:not(.active) {
  color: white;
  background: rgba(255,255,255,0.1);
}

.usage-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.usage-card h3 {
  color: white;
  font-size: 1.3rem;
  margin-bottom: 25px;
  text-align: center;
}

.usage-steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.usage-step {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-text {
  color: rgba(255,255,255,0.8);
  line-height: 1.6;
  padding-top: 4px;
}

.security-section {
  margin-bottom: 0;
}

.security-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  display: flex;
  align-items: flex-start;
  gap: 25px;
}

.security-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.security-content h3 {
  color: white;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.security-warnings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255,255,255,0.8);
  line-height: 1.5;
}

.warning-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .tool-card {
    flex-direction: column;
    text-align: center;
  }
  
  .tool-actions {
    justify-content: center;
  }
  
  .usage-tabs {
    flex-direction: column;
    max-width: 300px;
  }
  
  .security-card {
    flex-direction: column;
    text-align: center;
  }
  
  .tool-info {
    justify-content: center;
  }
}
</style>