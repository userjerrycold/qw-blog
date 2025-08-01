<template>
  <div class="login-container">
    <!-- 背景粒子 -->
    <div class="particles" ref="particlesRef"></div>
    
    <!-- 毛玻璃登录卡片 -->
    <div class="login-card">
      <div class="login-header">
        <div class="login-icon">
          <i class="fas fa-user-circle"></i>
        </div>
        <h1 class="login-title">欢迎回来</h1>
        <p class="login-subtitle">请登录您的账户</p>
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
        
        <button class="modal-btn" @click="sendVerificationCode" :disabled="!recoveryEmail || !isValidEmail(recoveryEmail) || codeSent">
          <i v-if="codeSent" class="fas fa-spinner fa-spin"></i>
          <span v-if="!codeSent">发送验证码</span>
          <span v-else>发送中...</span>
        </button>
        
        <div class="modal-footer">
          已有账号? <a href="#" @click.prevent="closePasswordModal">返回登录</a>
        </div>
      </div>
    </div>

    <!-- 第二层：验证码输入弹窗 -->
    <div class="modal-container" :class="{ active: showVerificationModal }">
      <div class="modal-backdrop" @click="closeVerificationModal"></div>
      <div class="verification-modal">
        <div class="modal-header">
          <h2>输入验证码</h2>
          <div class="close-btn" @click="closeVerificationModal">
            <i class="fas fa-times"></i>
          </div>
        </div>
        
        <p>请输入发送到您邮箱 <strong>{{ recoveryEmail }}</strong> 的6位验证码</p>
        
        <div class="verification-group" style="margin: 30px 0;">
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
        
        <button class="modal-btn" @click="verifyCode" :disabled="!isVerificationCodeComplete || isVerifying">
          <i v-if="isVerifying" class="fas fa-spinner fa-spin"></i>
          <span v-if="!isVerifying">验证并继续</span>
          <span v-else>验证中...</span>
        </button>
        
        <div class="modal-footer">
          <div class="resend-section">
            没有收到验证码? 
            <a href="#" @click.prevent="resendCode" :class="{ disabled: resendCountdown > 0 }">
              <span v-if="resendCountdown > 0">{{ resendCountdown }}秒后重新发送</span>
              <span v-else>重新发送</span>
            </a>
          </div>
          <div class="back-section">
            <a href="#" @click.prevent="backToEmailInput">返回上一步</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 第三层：密码重置弹窗 -->
    <div class="modal-container" :class="{ active: showResetPasswordModal }">
      <div class="modal-backdrop" @click="closeResetPasswordModal"></div>
      <div class="reset-password-modal">
        <div class="modal-header">
          <h2>重置密码</h2>
          <div class="close-btn" @click="closeResetPasswordModal">
            <i class="fas fa-times"></i>
          </div>
        </div>
        
        <div class="password-instructions">
          <h3>密码要求:</h3>
          <ul>
            <li :class="{ valid: passwordValidation.length }">至少8个字符</li>
            <li :class="{ valid: passwordValidation.uppercase }">包含大写字母</li>
            <li :class="{ valid: passwordValidation.lowercase }">包含小写字母</li>
            <li :class="{ valid: passwordValidation.number }">至少包含一个数字</li>
            <li :class="{ valid: passwordValidation.special }">至少包含一个特殊字符（如!@#$%）</li>
          </ul>
        </div>
        
        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input type="password" placeholder="新密码" v-model="newPassword" @input="validatePassword">
        </div>
        
        <div class="input-group">
          <i class="fas fa-lock"></i>
          <input type="password" placeholder="确认新密码" v-model="confirmNewPassword" @keyup.enter="resetPassword">
        </div>
        
        <div v-if="newPassword && confirmNewPassword && newPassword !== confirmNewPassword" class="error-message">
          两次输入的密码不一致
        </div>
        
        <button class="modal-btn" @click="resetPassword" :disabled="!isPasswordValid || isResetting">
          <i v-if="isResetting" class="fas fa-spinner fa-spin"></i>
          <span v-if="!isResetting">重置密码</span>
          <span v-else>重置中...</span>
        </button>
        
        <div class="modal-footer">
          <a href="#" @click.prevent="backToVerification">返回验证码输入</a>
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
// 忘记密码三层级弹窗状态
const showPasswordModal = ref(false)      // 第一层：邮箱输入
const showVerificationModal = ref(false)  // 第二层：验证码输入
const showResetPasswordModal = ref(false) // 第三层：密码重置
const codeSent = ref(false)

// 粒子动画控制
const particlesContainer = ref<HTMLElement>()
const isModalOpen = computed(() => 
  showRegisterModal.value || 
  showPasswordModal.value || 
  showVerificationModal.value || 
  showResetPasswordModal.value
)

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

// 新的验证码和密码重置状态
const isVerifying = ref(false)
const isResetting = ref(false)
const resendCountdown = ref(0)

// 邮箱验证
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证码完整性检查
const isVerificationCodeComplete = computed(() => {
  return verificationCodes.value.every(code => code.length === 1)
})

// 密码验证逻辑
const passwordValidation = reactive({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  special: false
})

const validatePassword = () => {
  const password = newPassword.value
  passwordValidation.length = password.length >= 8
  passwordValidation.uppercase = /[A-Z]/.test(password)
  passwordValidation.lowercase = /[a-z]/.test(password)
  passwordValidation.number = /\d/.test(password)
  passwordValidation.special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
}

const isPasswordValid = computed(() => {
  return Object.values(passwordValidation).every(valid => valid) && 
         newPassword.value === confirmNewPassword.value &&
         newPassword.value.length > 0
})

// 第一层：发送验证码
const sendVerificationCode = async () => {
  if (!recoveryEmail.value || !isValidEmail(recoveryEmail.value)) {
    message.error('请输入有效的邮箱地址')
    return
  }
  
  codeSent.value = true
  
  try {
    // 模拟发送验证码API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    message.success('验证码已发送到您的邮箱')
    
    // 关闭邮箱输入弹窗，打开验证码输入弹窗
    showPasswordModal.value = false
    showVerificationModal.value = true
    codeSent.value = false
    
    // 启动重发倒计时
    startResendCountdown()
    
    // 自动聚焦到第一个验证码输入框
    await nextTick()
    if (verificationInputs.value[0]) {
      verificationInputs.value[0].focus()
    }
  } catch (error) {
    message.error('发送验证码失败，请重试')
    codeSent.value = false
  }
}

// 重发验证码倒计时
const startResendCountdown = () => {
  resendCountdown.value = 60
  const timer = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 重发验证码
const resendCode = async () => {
  if (resendCountdown.value > 0) return
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('验证码已重新发送')
    startResendCountdown()
  } catch (error) {
    message.error('重发失败，请重试')
  }
}

// 第二层：验证验证码
const verifyCode = async () => {
  if (!isVerificationCodeComplete.value) {
    message.error('请输入完整的6位验证码')
    return
  }
  
  isVerifying.value = true
  
  try {
    // 模拟验证码验证API调用
    const code = verificationCodes.value.join('')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟验证结果 (在实际应用中，这里应该调用后端API)
    if (code === '123456') { // 模拟正确的验证码
      message.success('验证码验证成功')
      
      // 关闭验证码弹窗，打开密码重置弹窗
      showVerificationModal.value = false
      showResetPasswordModal.value = true
    } else {
      message.error('验证码错误，请重新输入')
      // 清空验证码输入
      verificationCodes.value = ['', '', '', '', '', '']
      if (verificationInputs.value[0]) {
        verificationInputs.value[0].focus()
      }
    }
  } catch (error) {
    message.error('验证失败，请重试')
  } finally {
    isVerifying.value = false
  }
}

// 第三层：重置密码
const resetPassword = async () => {
  if (!isPasswordValid.value) {
    message.error('请确保密码满足所有要求且两次输入一致')
    return
  }
  
  isResetting.value = true
  
  try {
    // 模拟重置密码API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    message.success('密码重置成功！请使用新密码登录')
    
    // 关闭所有弹窗，清空表单
    closeAllModals()
    resetForms()
  } catch (error) {
    message.error('密码重置失败，请重试')
  } finally {
    isResetting.value = false
  }
}

// 弹窗导航方法
const backToEmailInput = () => {
  showVerificationModal.value = false
  showPasswordModal.value = true
  verificationCodes.value = ['', '', '', '', '', '']
}

const backToVerification = () => {
  showResetPasswordModal.value = false
  showVerificationModal.value = true
  newPassword.value = ''
  confirmNewPassword.value = ''
}

// 关闭弹窗方法
const closePasswordModal = () => {
  showPasswordModal.value = false
  resetForms()
}

const closeVerificationModal = () => {
  showVerificationModal.value = false
  resetForms()
}

const closeResetPasswordModal = () => {
  showResetPasswordModal.value = false
  resetForms()
}

const closeAllModals = () => {
  showPasswordModal.value = false
  showVerificationModal.value = false
  showResetPasswordModal.value = false
}

const resetForms = () => {
  recoveryEmail.value = ''
  verificationCodes.value = ['', '', '', '', '', '']
  newPassword.value = ''
  confirmNewPassword.value = ''
  codeSent.value = false
  resendCountdown.value = 0
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

/* 全新的登录头部设计 */
.login-header {
  text-align: center;
  margin: 0 0 40px 0;
  animation: headerFloat 4s infinite ease-in-out;
}

.login-icon {
  margin-bottom: 25px;
}

.login-icon i {
  font-size: 72px;
  color: rgba(94, 129, 244, 0.8);
  display: block;
  text-shadow: 0 4px 8px rgba(94, 129, 244, 0.3);
  animation: iconPulse 3s infinite ease-in-out;
  transition: all 0.3s ease;
}

.login-icon i:hover {
  color: rgba(94, 129, 244, 1);
  text-shadow: 0 6px 12px rgba(94, 129, 244, 0.4);
  transform: scale(1.05);
}

.login-title {
  font-size: 32px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 10px 0;
  letter-spacing: 1px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(94, 129, 244, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  margin: 0;
  letter-spacing: 0.5px;
  line-height: 1.4;
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

/* 🎯 三层级弹窗的专用样式 */

/* 验证码弹窗样式 */
.verification-modal {
  width: 90%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 1000;
}

/* 重置密码弹窗样式 */
.reset-password-modal {
  width: 90%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 1000;
}

/* 验证码输入组样式 */
.verification-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.verification-input {
  width: 45px;
  height: 45px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.verification-input:focus {
  border-color: #5E81F4;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 3px rgba(94, 129, 244, 0.2);
  outline: none;
}

/* 密码要求样式增强 */
.password-instructions {
  background: rgba(94, 129, 244, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.password-instructions h3 {
  margin: 0 0 15px 0;
  color: rgba(0, 0, 0, 0.8);
  font-size: 16px;
  font-weight: 600;
}

.password-instructions ul {
  margin: 0;
  padding-left: 20px;
  list-style-type: none;
}

.password-instructions li {
  margin: 8px 0;
  color: rgba(0, 0, 0, 0.6);
  position: relative;
  font-size: 14px;
  transition: color 0.3s ease;
}

.password-instructions li::before {
  content: "✗";
  position: absolute;
  left: -20px;
  color: #dc2626;
  font-weight: bold;
  transition: all 0.3s ease;
}

.password-instructions li.valid {
  color: #16a34a;
  font-weight: 500;
}

.password-instructions li.valid::before {
  content: "✓";
  color: #16a34a;
}

/* 弹窗底部样式 */
.modal-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-footer a {
  color: #5E81F4;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.modal-footer a:hover {
  color: #4c63d2;
  text-decoration: underline;
}

.modal-footer a.disabled {
  color: rgba(0, 0, 0, 0.4);
  cursor: not-allowed;
  pointer-events: none;
}

/* 重发验证码区域 */
.resend-section {
  margin-bottom: 10px;
}

.back-section {
  font-size: 13px;
}

/* 错误消息样式 */
.error-message {
  color: #dc2626;
  font-size: 14px;
  text-align: center;
  margin: 10px 0;
  padding: 8px 12px;
  background: rgba(220, 38, 38, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

/* 登录头部动画效果 */
@keyframes headerFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes iconPulse {
  0%, 100% { 
    transform: scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.02);
    filter: brightness(1.1);
  }
}

</style> 