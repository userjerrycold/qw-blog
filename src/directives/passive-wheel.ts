import { DirectiveBinding } from 'vue'

// 修复非被动wheel事件监听器警告的指令
export const vPassiveWheel = {
  mounted(el: HTMLElement) {
    // 使用MutationObserver监视DOM变化
    const observer = new MutationObserver((mutations) => {
      // 为元素及其所有子元素添加passive wheel事件监听器替换
      addPassiveWheelSupport(el)
      
      // 处理任何新添加的子元素
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element节点
              addPassiveWheelSupport(node as HTMLElement)
            }
          })
        }
      })
    })
    
    // 开始观察元素
    observer.observe(el, { 
      childList: true,
      subtree: true 
    })
    
    // 初始应用
    addPassiveWheelSupport(el)
  }
}

// 应该排除的元素类名或选择器
const excludeSelectors = [
  // Naive UI 表格和滚动组件
  '.n-data-table',
  '.n-data-table-base-table',
  '.n-data-table-base-table-body',
  '.n-data-table-wrapper',
  '.n-virtual-list',
  '.n-scrollbar',
  '.n-scrollbar-container',
  '.n-scrollbar-content',
  
  // 表格相关
  '.interface-table',
  '.interface-list-card',
  '.mock-table-row',
  
  // 通用滚动容器
  '[class*="scroll"]', // 匹配所有包含"scroll"的类名
  '[style*="overflow"]', // 匹配所有设置了overflow样式的元素
  '.expanded-row',
  '.expanded-content',
  
  // 特定模块的滚动区域
  '.monaco-scrollable-element',
  '.monaco-editor-background',
  '.monaco-editor',
  '.monaco-mouse-cursor-text',
  '.mock-service-container',
  
  // 更通用的属性选择器
  '[data-scrollable="true"]'
];

// 检查元素是否应该被排除
function shouldExcludeElement(el: HTMLElement | Node): boolean {
  if (!(el instanceof HTMLElement)) return false;
  
  // 针对特定ID直接排除
  if (el.id && (
    el.id.includes('scroll') || 
    el.id.includes('table') || 
    el.id.includes('list') ||
    el.id.includes('grid')
  )) {
    return true;
  }
  
  // 检查特定的自定义数据属性
  if (el.dataset && (
    el.dataset.scrollable === 'true' ||
    el.dataset.preventPassive === 'true'
  )) {
    return true;
  }
  
  // 检查当前元素是否有任何排除类名
  for (const selector of excludeSelectors) {
    try {
      if (selector.startsWith('.')) {
        // 类名选择器
        const className = selector.substring(1);
        if (el.classList.contains(className)) {
          return true;
        }
      } else {
        // 其他选择器
        if (el.matches(selector)) {
          return true;
        }
      }
    } catch (e) {
      // 某些复杂选择器在matches时可能会抛出错误
      continue;
    }
  }
  
  // 检查父元素链
  let parent = el.parentElement;
  let depth = 0; // 限制检查深度，避免性能问题
  while (parent && depth < 5) {
    // 针对特定ID直接排除
    if (parent.id && (
      parent.id.includes('scroll') || 
      parent.id.includes('table') || 
      parent.id.includes('list') ||
      parent.id.includes('grid')
    )) {
      return true;
    }
    
    // 检查特定的自定义数据属性
    if (parent.dataset && (
      parent.dataset.scrollable === 'true' ||
      parent.dataset.preventPassive === 'true'
    )) {
      return true;
    }
    
    for (const selector of excludeSelectors) {
      try {
        if (selector.startsWith('.')) {
          const className = selector.substring(1);
          if (parent.classList.contains(className)) {
            return true;
          }
        } else {
          if (parent.matches(selector)) {
            return true;
          }
        }
      } catch (e) {
        continue;
      }
    }
    parent = parent.parentElement;
    depth++;
  }
  
  return false;
}

// 添加passive wheel支持的助手函数
function addPassiveWheelSupport(el: HTMLElement | Node) {
  try {
    // 如果是排除的元素，不应用修改
    if (shouldExcludeElement(el)) {
      return;
    }
    
    // 保存原始addEventListener方法
    const originalAddEventListener = el.addEventListener
    
    // 替换addEventListener方法以自动添加passive选项
    el.addEventListener = function(
      type: string, 
      listener: EventListenerOrEventListenerObject, 
      options?: boolean | AddEventListenerOptions
    ) {
      // 只对wheel和touchmove事件应用passive选项
      if (type === 'wheel' || type === 'touchmove') {
        let newOptions: AddEventListenerOptions
        
        // 处理不同形式的选项参数
        if (typeof options === 'object') {
          // 只有当options中没有显式设置passive时才设置为true
          newOptions = { 
            ...options, 
            passive: options.passive !== undefined ? options.passive : true 
          }
        } else {
          newOptions = { passive: true, capture: !!options }
        }
        
        // 使用修改后的选项调用原始方法
        return originalAddEventListener.call(
          this, 
          type, 
          listener, 
          newOptions
        )
      }
      
      // 对于其他事件类型，保持原样
      return originalAddEventListener.call(this, type, listener, options)
    }
  } catch (e) {
    console.warn('Failed to patch addEventListener for passive events', e)
  }
}

export default vPassiveWheel 