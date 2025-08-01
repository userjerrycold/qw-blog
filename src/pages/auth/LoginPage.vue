<template>
  <div class="login-container">
    <!-- 背景粒子 -->
    <div class="particles" ref="particlesRef"></div>
    
    <!-- 毛玻璃登录卡片 -->
    <div class="login-card">
      <div class="logo">
        <i class="fas fa-lock"></i>
        <h1>欢迎登录</h1>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="input-group" :class="{ error: errors.username }">
          <i class="fas fa-user"></i>
          <input 
            type="text" 
            placeholder="用户名" 
            v-model="loginForm.username"
            @input="clearError('username')"
          >
          <div class="error-message">{{ errors.username }}</div>
        </div>
        
        <div class="input-group" :class="{ error: errors.password }">
          <i class="fas fa-lock"></i>
          <input 
            type="password" 
            placeholder="密码" 
            v-model="loginForm.password"
            @input="clearError('password')"
          >
          <div class="error-message">{{ errors.password }}</div>
        </div>
        
        <div class="options">
          <label class="remember">
            <input type="checkbox" v-model="loginForm.remember"> 记住我
          </label>
          <a href="#" class="forgot-password" @click.prevent="showPasswordModal = true">忘记密码?</a>
        </div>
        
        <button type="submit" class="login-btn" :disabled="isLoading">
          <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
          <i v-else-if="loginSuccess" class="fas fa-check"></i>
          <span v-if="!isLoading && !loginSuccess">登 录</span>
          <span v-else-if="loginSuccess">登录成功</span>
          <span v-else>登录中...</span>
        </button>
      </form>
      
      <div class="divider">
        <span>或使用社交账号登录</span>
      </div>
      
      <div class="social-login">
        <div class="social-btn" @click="socialLogin('google')">
          <i class="fab fa-google"></i>
        </div>
        <div class="social-btn" @click="socialLogin('github')">
          <i class="fab fa-github"></i>
        </div>
        <div class="social-btn" @click="socialLogin('wechat')">
          <i class="fab fa-weixin"></i>
        </div>
      </div>
      
      <div class="signup-link">
        还没有账号? <a href="#" @click.prevent="showRegisterModal = true">立即注册</a>
      </div>
    </div>
    
    <!-- 注册弹窗 -->
    <div class="modal-container" :class="{ active: showRegisterModal }">
      <div class="modal-backdrop" @click="showRegisterModal = false"></div>
      <div class="register-modal">
        <div class="modal-header">
          <h2>创建新账户</h2>
          <div class="close-btn" @click="showRegisterModal = false">
            <i class="fas fa-times"></i>
          </div>
        </div>
        
        <form @submit.prevent="handleRegister">
          <div class="input-group">
            <i class="fas fa-user"></i>
            <input type="text" placeholder="用户名" v-model="registerForm.username" required>
          </div>
          
          <div class="input-group">
            <i class="fas fa-envelope"></i>
            <input type="email" placeholder="电子邮箱" v-model="registerForm.email" required>
          </div>
          
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input type="password" placeholder="密码" v-model="registerForm.password" required>
          </div>
          
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input type="password" placeholder="确认密码" v-model="registerForm.confirmPassword" required>
          </div>
          
          <div class="terms">
            <input type="checkbox" id="terms" v-model="registerForm.agreeTerms" required>
            <label for="terms">我同意<a href="#" @click.prevent>服务条款</a>和<a href="#" @click.prevent>隐私政策</a></label>
          </div>
          
          <button type="submit" class="modal-btn" :disabled="isRegistering">
            <i v-if="isRegistering" class="fas fa-spinner fa-spin"></i>
            <span v-if="!isRegistering">注册账户</span>
            <span v-else>注册中...</span>
          </button>
        </form>
        
        <div class="signup-link" style="margin-top: 20px;">
          已有账号? <a href="#" @click.prevent="showRegisterModal = false">立即登录</a>
        </div>
      </div>
    </div>
    
    <!-- 密码找回弹窗 -->
    <div class="modal-container" :class="{ active: showPasswordModal }">
      <div class="modal-backdrop" @click="closePasswordModal"></div>
      <div class="password-modal">
        <div class="modal-header">
          <h2>找回密码</h2>
          <div class="close-btn" @click="closePasswordModal">
            <i class="fas fa-times"></i>
          </div>
        </div>
        
        <p>请输入与您账户关联的电子邮箱，我们将发送验证码给您。</p>
        
        <div class="input-group" style="margin-top: 25px;">
          <i class="fas fa-envelope"></i>
          <input type="email" placeholder="电子邮箱" v-model="recoveryEmail">
        </div>
        
        <button class="modal-btn" @click="sendVerificationCode" :disabled="!recoveryEmail || codeSent">
          <i v-if="codeSent" class="fas fa-check"></i>
          <span v-if="!codeSent">发送验证码</span>
          <span v-else>已发送</span>
        </button>
        
        <div class="verification-container" v-show="showVerification">
          <p style="text-align: center; margin-top: 20px;">请输入发送到您邮箱的6位验证码</p>
          
          <div class="verification-group">
                         <input 
               v-for="(code, index) in verificationCodes" 
               :key="index"
               type="text" 
               class="verification-input" 
               maxlength="1"
               v-model="verificationCodes[index]"
               @input="handleVerificationInput(index)"
               @keydown="handleVerificationKeydown(index, $event)"
               :ref="el => setVerificationInput(index, el)"
             >
          </div>
          
          <div class="password-instructions">
            <h3>密码要求:</h3>
            <ul>
              <li>至少8个字符</li>
              <li>包含大写字母和小写字母</li>
              <li>至少包含一个数字</li>
              <li>至少包含一个特殊字符（如!@#$%）</li>
            </ul>
          </div>
          
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input type="password" placeholder="新密码" v-model="newPassword">
          </div>
          
          <div class="input-group">
            <i class="fas fa-lock"></i>
            <input type="password" placeholder="确认新密码" v-model="confirmNewPassword">
          </div>
          
          <button class="modal-btn" @click="resetPassword">重置密码</button>
          
          <div class="resend-code">
            没有收到验证码? <a href="#" @click.prevent="resendCode">重新发送</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 响应式数据
const particlesRef = ref<HTMLElement>()
const verificationInputs = ref<HTMLInputElement[]>([])

const isLoading = ref(false)
const loginSuccess = ref(false)
const isRegistering = ref(false)
const showRegisterModal = ref(false)
const showPasswordModal = ref(false)
const showVerification = ref(false)
const codeSent = ref(false)

// 粒子动画控制
const particlesContainer = ref<HTMLElement>()
const isModalOpen = computed(() => showRegisterModal.value || showPasswordModal.value)

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const errors = reactive({
  username: '',
  password: ''
})

const recoveryEmail = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const verificationCodes = ref(['', '', '', '', '', ''])

// 方法
const clearError = (field: keyof typeof errors) => {
  errors[field] = ''
}

const validateForm = () => {
  let isValid = true
  
  if (!loginForm.username.trim()) {
    errors.username = '请输入有效的用户名'
    isValid = false
  }
  
  if (!loginForm.password.trim()) {
    errors.password = '密码不能为空'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟登录成功
    loginSuccess.value = true
    message.success('登录成功！')
    
    // 延迟跳转
    setTimeout(() => {
      router.push('/tools')
    }, 1000)
    
  } catch (error) {
    message.error('登录失败，请检查用户名和密码')
  } finally {
    isLoading.value = false
    setTimeout(() => {
      loginSuccess.value = false
    }, 2000)
  }
}

const handleRegister = async () => {
  if (registerForm.password !== registerForm.confirmPassword) {
    message.error('两次输入的密码不一致')
    return
  }
  
  if (!registerForm.agreeTerms) {
    message.error('请同意服务条款和隐私政策')
    return
  }
  
  isRegistering.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    message.success('注册成功！请登录')
    showRegisterModal.value = false
    
    // 清空表单
    Object.assign(registerForm, {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    })
    
  } catch (error) {
    message.error('注册失败，请重试')
  } finally {
    isRegistering.value = false
  }
}

const socialLogin = (provider: string) => {
  message.info(`${provider} 登录功能开发中...`)
}

const sendVerificationCode = () => {
  if (!recoveryEmail.value) return
  
  codeSent.value = true
  showVerification.value = true
  message.success('验证码已发送到您的邮箱')
  
  setTimeout(() => {
    codeSent.value = false
  }, 5000)
}

const resendCode = () => {
  message.success('验证码已重新发送')
}

const resetPassword = () => {
  if (newPassword.value !== confirmNewPassword.value) {
    message.error('两次输入的密码不一致')
    return
  }
  
  message.success('密码重置成功！')
  closePasswordModal()
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  showVerification.value = false
  codeSent.value = false
  recoveryEmail.value = ''
  newPassword.value = ''
  confirmNewPassword.value = ''
  verificationCodes.value = ['', '', '', '', '', '']
}

const handleVerificationInput = async (index: number) => {
  const value = verificationCodes.value[index]
  if (value.length === 1 && index < verificationCodes.value.length - 1) {
    await nextTick()
    verificationInputs.value[index + 1]?.focus()
  }
}

const handleVerificationKeydown = async (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && verificationCodes.value[index] === '' && index > 0) {
    await nextTick()
    verificationInputs.value[index - 1]?.focus()
  }
}

const setVerificationInput = (index: number, el: any) => {
  if (el) {
    verificationInputs.value[index] = el
  }
}

// 创建背景粒子
const createParticles = () => {
  if (!particlesRef.value) return
  
  const particleCount = 30
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.classList.add('particle')
    
    // 随机大小 (3px - 8px)
    const size = Math.random() * 5 + 3
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    
    // 随机位置
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    
    // 随机动画延迟
    particle.style.animationDelay = `${Math.random() * 5}s`
    
    // 随机动画持续时间
    const duration = Math.random() * 5 + 8
    particle.style.animationDuration = `${duration}s`
    
    particlesRef.value.appendChild(particle)
  }
  
  particlesContainer.value = particlesRef.value
}

// 控制粒子动画
const toggleParticles = (pause: boolean) => {
  if (!particlesContainer.value) return
  
  const particles = particlesContainer.value.querySelectorAll('.particle')
  particles.forEach((particle: Element) => {
    const htmlParticle = particle as HTMLElement
    htmlParticle.style.animationPlayState = pause ? 'paused' : 'running'
  })
}

// 创建鼠标涟漪效果
const createRippleEffect = () => {
  document.body.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.1) { // 降低频率
      const ripple = document.createElement('div')
      ripple.classList.add('ripple')
      
      // 设置涟漪位置
      ripple.style.left = `${e.clientX}px`
      ripple.style.top = `${e.clientY}px`
      
      // 随机大小
      const size = Math.random() * 100 + 50
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      
      document.body.appendChild(ripple)
      
      // 动画结束后移除元素
      setTimeout(() => {
        ripple.remove()
      }, 600)
    }
  })
}

// 监听弹窗状态变化
watch(isModalOpen, (isOpen: boolean) => {
  toggleParticles(isOpen)
})

onMounted(() => {
  createParticles()
  createRippleEffect()
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #a1c4fd, #c2e9fb, #fbc2eb, #a6c1ee);
  background-size: 300% 300%;
  animation: gradientBG 15s ease infinite;
  overflow: hidden;
  position: relative;
  font-family: 'Segoe UI', 'Inter', sans-serif;
}

/* 背景粒子效果 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

:deep(.particle) {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: float 8s infinite ease-in-out;
}

/* 增强的毛玻璃登录卡片 */
.login-card {
  position: relative;
  z-index: 10;
  width: 420px;
  padding: 48px;
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15), 
    inset 0 0 25px rgba(255, 255, 255, 0.65);
  animation: cardEntry 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  transform: translateY(20px);
  opacity: 0;
}

.login-card::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(45deg, rgba(94, 129, 244, 0.1), rgba(132, 100, 246, 0.1));
  border-radius: 26px;
  z-index: -1;
  filter: blur(15px);
}

.logo {
  text-align: center;
  margin-bottom: 40px;
  animation: floatIcon 3s infinite ease-in-out;
}

.logo i {
  font-size: 3.5rem;
  color: rgba(255, 255, 255, 0.95);
  background: linear-gradient(45deg, #5E81F4, #8464F6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo h1 {
  font-weight: 300;
  font-size: 1.8rem;
  margin-top: 15px;
  color: rgba(0, 0, 0, 0.75);
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.input-group {
  position: relative;
  margin-bottom: 30px;
}

.input-group input {
  width: 85%;
  padding: 15px 15px 15px 50px;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.8);
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.input-group input:focus {
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0 5px 20px rgba(94, 129, 244, 0.2);
}

.input-group i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.5);
  font-size: 20px;
  animation: floatIcon 3s infinite ease-in-out;
}

.input-group input:focus + i {
  color: #5E81F4;
}

.input-group input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

/* 弹窗内的输入框样式增强 */
.modal-container .input-group input {
  background: rgba(255, 255, 255, 0.8);
  color: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-container .input-group input:focus {
  background: rgba(255, 255, 255, 0.95);
  border-color: #5E81F4;
  box-shadow: 0 0 0 3px rgba(94, 129, 244, 0.2);
}

.modal-container .input-group input::placeholder {
  color: rgba(0, 0, 0, 0.6);
}

/* 输入组图标样式优化 - 保持与登录页一致的位置 */
.modal-container .input-group i {
  /* 位置样式与登录页保持一致 */
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.7);
  font-size: 20px;
  z-index: 10;
  
  /* 清除模糊但保持原有样式 */
  filter: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  
  /* 基础清晰化 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 弹窗中图标的悬停效果 */
.modal-container .input-group input:focus + i {
  color: #5E81F4;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
}

.remember {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember input {
  margin-right: 8px;
  accent-color: #5E81F4;
}

.forgot-password {
  color: rgba(0, 0, 0, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #5E81F4;
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #5E81F4, #8464F6);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(94, 129, 244, 0.4);
  letter-spacing: 1px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(94, 129, 244, 0.5);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: rgba(0, 0, 0, 0.5);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(0, 0, 0, 0.15);
}

.divider span {
  padding: 0 15px;
  font-size: 14px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-btn {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: rgba(0, 0, 0, 0.7);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.signup-link {
  text-align: center;
  margin-top: 30px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 14px;
}

.signup-link a {
  color: #5E81F4;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.signup-link a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #5E81F4;
  transition: width 0.3s ease;
}

.signup-link a:hover::after {
  width: 100%;
}

/* 错误提示 */
.error-message {
  position: absolute;
  top: -25px;
  left: 0;
  color: #FF5E7D;
  font-size: 13px;
  font-weight: 500;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;
}

.input-group.error .error-message {
  opacity: 1;
  transform: translateY(0);
}

/* 涟漪效果 */
:deep(.ripple) {
  position: fixed;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
  z-index: 5;
}

/* 弹窗容器 */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s ease;
}

.modal-container.active {
  opacity: 1;
  visibility: visible;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* 🎯 温和而有效的图标清晰化方案 */

/* 弹窗容器的基础设置 */
.register-modal,
.password-modal {
  position: relative;
}

/* 核心图标清晰化 - 简洁有效 */
.modal-container i,
.register-modal i,
.password-modal i {
  /* 清除模糊效果 */
  filter: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  
  /* 确保显示 */
  opacity: 1 !important;
  visibility: visible !important;
  display: inline-block !important;
  
  /* 基础清晰化 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  
  /* 轻微硬件加速 */
  transform: translateZ(0);
  will-change: auto;
}

/* 注册弹窗 */
.register-modal,
.password-modal {
  position: relative;
  z-index: 101;
  width: 450px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3), 
    inset 0 0 25px rgba(255, 255, 255, 0.8);
  transform: translateY(30px);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.modal-container.active .register-modal,
.modal-container.active .password-modal {
  transform: translateY(0);
  opacity: 1;
}

.register-modal::before,
.password-modal::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(45deg, rgba(94, 129, 244, 0.1), rgba(132, 100, 246, 0.1));
  border-radius: 26px;
  z-index: -1;
  filter: blur(15px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.modal-header h2 {
  font-weight: 600;
  font-size: 1.8rem;
  color: rgba(0, 0, 0, 0.9);
  background: linear-gradient(45deg, #5E81F4, #8464F6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 关闭按钮样式优化 */
.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.8);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 100;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: rgba(0, 0, 0, 1);
}

.close-btn i {
  /* 确保图标显示且清晰 */
  filter: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  
  /* 确保可见性 */
  opacity: 1 !important;
  visibility: visible !important;
  color: inherit;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: rotate(90deg);
  color: rgba(0, 0, 0, 1);
}

.terms {
  display: flex;
  align-items: center;
  margin: 20px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
}

.terms input {
  margin-right: 10px;
  accent-color: #5E81F4;
}

.terms a {
  color: #5E81F4;
  text-decoration: none;
}

.modal-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #5E81F4, #8464F6);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(94, 129, 244, 0.4);
  letter-spacing: 1px;
  margin-top: 10px;
}

.modal-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(94, 129, 244, 0.5);
}

.password-instructions {
  margin: 20px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.password-instructions h3 {
  margin-bottom: 10px;
  color: #5E81F4;
}

.password-instructions ul {
  padding-left: 20px;
}

.password-instructions li {
  margin-bottom: 5px;
}

.resend-code {
  text-align: center;
  margin-top: 20px;
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
}

.resend-code a {
  color: #5E81F4;
  text-decoration: none;
  font-weight: 500;
}

/* 验证码输入 */
.verification-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 25px 0;
}

.verification-input {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 24px;
  background: rgba(255, 255, 255, 0.25) !important;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  outline: none;
  transition: all 0.3s ease;
  padding: 0 !important;
}

.verification-input:focus {
  border-color: #5E81F4;
  box-shadow: 0 0 10px rgba(94, 129, 244, 0.3);
}

/* 动画 */
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes floatIcon {
  0%, 100% { transform: translateY(-50%); }
  50% { transform: translateY(-55%); }
}

@keyframes cardEntry {
  to { transform: translateY(0); opacity: 1; }
}

@keyframes ripple {
  to { transform: scale(2.5); opacity: 0; }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card,
  .register-modal,
  .password-modal {
    width: 90%;
    padding: 30px;
  }
  
  .verification-group {
    gap: 10px;
  }
  
  .verification-input {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}

/* FontAwesome图标具体优化 */
.modal-container .fas,
.register-modal .fas,
.password-modal .fas {
  /* 确保图标显示 */
  display: inline-block !important;
  font-family: "Font Awesome 5 Free" !important;
  font-weight: 900 !important;
  
  /* 清除模糊但保持可见 */
  filter: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  
  /* 确保清晰 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  
  /* 确保可见 */
  opacity: 1 !important;
  visibility: visible !important;
}

/* 为不同图标设置适当的颜色 */
.modal-container .fa-user { 
  color: rgba(0, 0, 0, 0.7) !important; 
}
.modal-container .fa-envelope { 
  color: rgba(0, 0, 0, 0.7) !important; 
}
.modal-container .fa-lock { 
  color: rgba(0, 0, 0, 0.7) !important; 
}
.modal-container .fa-times { 
  color: rgba(0, 0, 0, 0.8) !important; 
}
.modal-container .fa-spinner { 
  color: rgba(0, 0, 0, 0.7) !important; 
}
.modal-container .fa-check { 
  color: rgba(0, 0, 0, 0.7) !important; 
}

</style> 