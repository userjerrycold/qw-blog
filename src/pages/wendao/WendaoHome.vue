<template>
  <div class="wendao-container">
    <!-- 游戏介绍横幅 -->
    <section class="game-hero" ref="heroRef">
      <!-- 古风装饰元素 -->
      <div class="ancient-decoration"></div>
      <div class="ancient-decoration"></div>
      <div class="ancient-decoration"></div>
      <div class="hero-content">
        <h1 class="hero-title">时光回溯：90后的《问道》青春手札</h1>
        <div class="hero-story">
          <p class="story-paragraph">
            指尖敲击老式键盘，屏幕泛起水墨微光——那是独属90后的修仙江湖初体验。<br>
            揽仙镇外蛙鸣阵阵，我们攥着木剑追捕<strong class="highlight-term">野狗白猿</strong>，却在卧龙坡被小怪送回多闻道人面前，戏称一声"<strong class="highlight-term">见多多</strong>"。
          </p>
          
          <p class="story-paragraph">
            通宵的网吧烟雾缭绕，少年们为一只<strong class="highlight-term">海龟</strong>匍匐北海滩。体宠加点、血厚为王的时代，满血龟壳是全网吧的焦点，连陌生道友都会凑近夸赞一句："兄弟，龟不错！"。更痴狂者彻夜蹲守<strong class="highlight-term">天技花妖</strong>，凌晨四点金光闪过——三天技在手，全班沸腾三日。
          </p>
          
          <p class="story-paragraph">
            百环长路漫漫，<strong class="highlight-term">除暴（CB）、伏魔（FM）、除妖（CY）</strong> 是刻进DNA的暗号。组队栏刷屏的"Q4力战桃柳林"，攒钱买的改三金套，年兽爆竹映红北海的夜……<br>
            如今坐骑光效绚烂，却再难寻回当年攥着<strong class="highlight-term">点卡换328元宝</strong>时，那份笨拙而炽热的欢喜。
          </p>
          
          <blockquote class="story-quote">
            <p>中洲大陆的清风拂过十六载，<br>
            吹不散天墉城下少年游。<br>
            ——问道未老，青春长留。</p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- 功能标签区域 -->
    <section class="features-section">
      <h2 class="section-title">功能模块</h2>
      
      <div class="features-grid">
        <div 
          class="feature-card" 
          @click="navigateToFeature('build')"
          :class="{ active: selectedFeature === '搭建' }"
        >
          <div class="feature-icon">🏗️</div>
          <h3 class="feature-title">搭建</h3>
          <p class="feature-description">游戏环境搭建、服务器部署、数据库配置等基础设施建设工具</p>
        </div>
        
        <div 
          class="feature-card" 
          @click="navigateToFeature('assist')"
          :class="{ active: selectedFeature === '辅助' }"
        >
          <div class="feature-icon">🤖</div>
          <h3 class="feature-title">辅助</h3>
          <p class="feature-description">游戏辅助工具、自动化脚本、智能挂机等提升游戏体验的功能</p>
        </div>
        
        <div 
          class="feature-card" 
          @click="navigateToFeature('material')"
          :class="{ active: selectedFeature === '素材' }"
        >
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">素材</h3>
          <p class="feature-description">游戏素材库、贴图资源、音效文件、UI组件等美术资源管理</p>
        </div>
        
        <div 
          class="feature-card" 
          @click="selectFeature('BOSS')"
          :class="{ active: selectedFeature === 'BOSS' }"
        >
          <div class="feature-icon">👹</div>
          <h3 class="feature-title">BOSS</h3>
          <p class="feature-description">BOSS数据管理、掉落配置、刷新时间、战斗机制等核心玩法设定</p>
        </div>
        
        <div 
          class="feature-card" 
          @click="selectFeature('ETC')"
          :class="{ active: selectedFeature === 'ETC' }"
        >
          <div class="feature-icon">📦</div>
          <h3 class="feature-title">ETC</h3>
          <p class="feature-description">其他杂项功能、实用小工具、系统维护、数据备份等辅助功能</p>
        </div>
        
        <div 
          class="feature-card" 
          @click="selectFeature('服务端')"
          :class="{ active: selectedFeature === '服务端' }"
        >
          <div class="feature-icon">🖥️</div>
          <h3 class="feature-title">服务端</h3>
          <p class="feature-description">服务器管理、性能监控、日志分析、负载均衡等后端技术支持</p>
        </div>
        
        <div 
          class="feature-card" 
          @click="selectFeature('客户端')"
          :class="{ active: selectedFeature === '客户端' }"
        >
          <div class="feature-icon">💻</div>
          <h3 class="feature-title">客户端</h3>
          <p class="feature-description">游戏客户端开发、界面优化、补丁更新、兼容性测试等前端功能</p>
        </div>
        
        <div 
          class="feature-card" 
          @click="selectFeature('插件')"
          :class="{ active: selectedFeature === '插件' }"
        >
          <div class="feature-icon">🔌</div>
          <h3 class="feature-title">插件</h3>
          <p class="feature-description">第三方插件开发、API接口、扩展功能、自定义模块等开放平台</p>
        </div>
        
        <div 
          class="feature-card" 
          @click="selectFeature('工具')"
          :class="{ active: selectedFeature === '工具' }"
        >
          <div class="feature-icon">🛠️</div>
          <h3 class="feature-title">工具</h3>
          <p class="feature-description">开发调试工具、数据分析工具、性能测试工具等专业技术工具集</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// 响应式状态
const selectedFeature = ref<string>('')
const heroRef = ref<HTMLElement>()
const router = useRouter()

// 功能卡片选择
const selectFeature = (featureName: string) => {
  console.log(`选择功能模块: ${featureName}`)
  selectedFeature.value = featureName
  
  // 高亮选中的卡片效果
  const cards = document.querySelectorAll('.feature-card')
  cards.forEach(card => {
    const htmlCard = card as HTMLElement
    htmlCard.style.transform = 'translateY(0) scale(0.93)'
    htmlCard.style.boxShadow = ''
  })
  
  // 模拟功能切换
  setTimeout(() => {
    alert(`即将进入 ${featureName} 模块！`)
  }, 300)
}

// 导航到功能页面
const navigateToFeature = (featurePath: string) => {
  console.log(`导航到功能页面: ${featurePath}`)
  router.push(`/wendao/${featurePath}`)
}

// 鼠标跟随效果
const handleMouseMove = (e: MouseEvent) => {
  if (!heroRef.value) return
  
  const hero = heroRef.value
  const rect = hero.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const deltaX = (x - centerX) / centerX
    const deltaY = (y - centerY) / centerY
    
    hero.style.transform = `perspective(1000px) rotateX(${deltaY * 2}deg) rotateY(${deltaX * 2}deg)`
  }
}

const handleMouseLeave = () => {
  if (heroRef.value) {
    heroRef.value.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
  }
}

// 页面加载动画
const initLoadAnimation = async () => {
  await nextTick()
  const cards = document.querySelectorAll('.feature-card')
  cards.forEach((card: Element, index: number) => {
    const htmlCard = card as HTMLElement
    htmlCard.style.opacity = '0'
    htmlCard.style.transform = 'translateY(30px)'
    
    setTimeout(() => {
      htmlCard.style.transition = 'all 0.6s ease'
      htmlCard.style.opacity = '1'
      htmlCard.style.transform = 'translateY(0) scale(0.93)'
    }, index * 100)
  })
}

onMounted(() => {
  console.log('问道页面已加载')
  initLoadAnimation()
  
  // 添加事件监听
  document.addEventListener('mousemove', handleMouseMove)
  if (heroRef.value) {
    heroRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  // 清理事件监听
  document.removeEventListener('mousemove', handleMouseMove)
  if (heroRef.value) {
    heroRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }
})
</script>

<style scoped>
/* 隐藏滚动条 */
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

*::-webkit-scrollbar {
  display: none; /* WebKit */
}

.wendao-container {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  background-color: white;
  overflow-y: auto;
  max-width: 1400px;
  margin: 0 auto;
}

/* 游戏介绍横幅 - 水墨古风 */
.game-hero {
  background: 
    linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%),
    url('/product/mini.jpeg') center/cover no-repeat;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(139, 69, 19, 0.3);
  border-radius: 20px;
  padding: 50px 40px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 15px 50px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.game-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(139, 69, 19, 0.1) 0%,
    transparent 25%,
    transparent 75%,
    rgba(205, 133, 63, 0.1) 100%
  );
  opacity: 0.8;
  animation: ancientMist 25s ease-in-out infinite;
}

@keyframes ancientMist {
  0%, 100% { 
    opacity: 0.6;
    transform: translateX(0) scale(1);
  }
  50% { 
    opacity: 0.9;
    transform: translateX(20px) scale(1.05);
  }
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 600;
  font-family: 'KaiTi', 'STKaiti', '楷体', serif;
  color: #f4f1de;
  text-shadow: 
    2px 2px 4px rgba(0,0,0,0.8),
    0 0 20px rgba(244, 241, 222, 0.5);
  margin-bottom: 40px;
  text-align: center;
  line-height: 1.4;
  position: relative;
  z-index: 2;
  letter-spacing: 2px;
}

.hero-story {
  position: relative;
  z-index: 2;
}

/* 古风装饰元素 */
.ancient-decoration {
  position: absolute;
  width: 60px;
  height: 60px;
  opacity: 0.2;
  z-index: 1;
  pointer-events: none;
}

.ancient-decoration::before {
  content: '❀';
  font-size: 2rem;
  color: #cd853f;
  position: absolute;
  animation: floatDecor 6s ease-in-out infinite;
}

.ancient-decoration:nth-child(1) {
  top: 20px;
  left: 20px;
  animation-delay: 0s;
}

.ancient-decoration:nth-child(2) {
  top: 50px;
  right: 30px;
  animation-delay: 2s;
}

.ancient-decoration:nth-child(3) {
  bottom: 30px;
  left: 50px;
  animation-delay: 4s;
}

@keyframes floatDecor {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.2;
  }
  50% { 
    transform: translateY(-10px) rotate(180deg);
    opacity: 0.4;
  }
}

.story-paragraph {
  font-size: 1.15rem;
  line-height: 2;
  font-family: 'KaiTi', 'STKaiti', '楷体', serif;
  color: rgba(244, 241, 222, 0.95);
  margin-bottom: 25px;
  text-align: justify;
  text-indent: 2.5em;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
  position: relative;
  z-index: 2;
}

.highlight-term {
  color: #ffd700;
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.4), rgba(205, 133, 63, 0.3));
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 700;
  font-family: 'KaiTi', 'STKaiti', '楷体', serif;
  border: 1px solid rgba(255, 215, 0, 0.4);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  box-shadow: inset 0 1px 0 rgba(255, 215, 0, 0.2);
}

.story-quote {
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.2), rgba(205, 133, 63, 0.1));
  border-left: 4px solid #cd853f;
  border-right: 4px solid #cd853f;
  margin: 40px 0;
  padding: 30px 35px;
  border-radius: 12px;
  font-style: normal;
  font-family: 'KaiTi', 'STKaiti', '楷体', serif;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 25px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(205, 133, 63, 0.3);
}

.story-quote::before {
  content: '「';
  position: absolute;
  top: -5px;
  left: 5px;
  font-size: 5rem;
  color: rgba(205, 133, 63, 0.3);
  font-family: 'KaiTi', 'STKaiti', '楷体', serif;
  z-index: 1;
}

.story-quote::after {
  content: '」';
  position: absolute;
  bottom: -20px;
  right: 5px;
  font-size: 5rem;
  color: rgba(205, 133, 63, 0.3);
  font-family: 'KaiTi', 'STKaiti', '楷体', serif;
  z-index: 1;
}

.story-quote p {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(244, 241, 222, 0.9);
  position: relative;
  z-index: 2;
  text-align: center;
  font-family: 'KaiTi', 'STKaiti', '楷体', serif;
  letter-spacing: 1.5px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
}

/* 功能标签区域 */
.features-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: rgba(71, 85, 105, 0.9);
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 3px;
  background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  margin: 15px auto 0;
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transform: scale(0.93);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  transition: all 0.6s ease;
  transform: translate(-50%, -50%);
}

.feature-card:hover::before,
.feature-card.active::before {
  width: 300%;
  height: 300%;
}

.feature-card:hover,
.feature-card.active {
  transform: translateY(-10px) scale(0.95);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 
    0 20px 40px rgba(99, 102, 241, 0.15),
    0 0 0 1px rgba(99, 102, 241, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 2;
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: rgba(71, 85, 105, 0.9);
  margin-bottom: 15px;
  position: relative;
  z-index: 2;
}

.feature-description {
  color: rgba(71, 85, 105, 0.7);
  font-size: 0.9rem;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .wendao-container {
    padding: 10px;
  }
  
  .game-hero {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .features-section {
    padding: 0 10px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .story-paragraph {
    font-size: 1rem;
    text-indent: 2em;
    line-height: 1.8;
  }
  
  .story-quote p {
    font-size: 1rem;
    letter-spacing: 1px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* 特殊动画效果 */
.floating {
  animation: floating 6s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
</style>
