<!--
  这个组件用于修复Naive UI的虚拟列表在wheel事件上的passive问题
  通过在应用程序初始化时注入，防止错误信息的出现
-->
<template></template>

<script>
// 使用普通<script>块来定义组件
import { onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'NaiveListFix',
  setup() {
    // 定义特定的选择器列表，这些元素需要非passive的wheel事件
    const nonPassiveSelectors = [
      // Naive UI 虚拟列表和相关组件
      '.n-virtual-list',
      '.n-scrollbar',
      '.n-scrollbar-container',
      '.n-data-table-base-table-body',
      '.n-data-table',
      '.interface-table',
      '[data-prevent-passive="true"]'
    ];

    /**
     * 找到具有特定选择器的所有元素
     */
    function findElements() {
      const elements = [];
      
      nonPassiveSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          elements.push(el);
        });
      });
      
      return elements;
    }

    /**
     * 修复wheel事件
     */
    function fixWheelEvents() {
      // 初次修复
      applyFixToElements();
      
      // 创建观察器来监听DOM变化
      const observer = new MutationObserver(mutations => {
        let shouldReapply = false;
        
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldReapply = true;
          }
        });
        
        if (shouldReapply) {
          applyFixToElements();
        }
      });
      
      // 开始观察整个文档
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // 返回清理函数
      return () => {
        observer.disconnect();
      };
    }

    /**
     * 对所有匹配元素应用修复
     */
    function applyFixToElements() {
      const elements = findElements();
      
      elements.forEach(element => {
        // 如果元素没有被标记为已修复
        if (!element.hasAttribute('data-wheel-fixed')) {
          // 标记为已修复以避免重复处理
          element.setAttribute('data-wheel-fixed', 'true');
          
          // 移除原有的wheel事件监听器并替换为显式非passive的监听器
          // 这是一个通用方法，实际上我们无法获取现有的监听器
          // 但我们可以确保之后添加的监听器是非passive的
          const originalAddEventListener = element.addEventListener;
          
          element.addEventListener = function(type, listener, options) {
            if (type === 'wheel' || type === 'touchmove') {
              const newOptions = typeof options === 'object' 
                ? { ...options, passive: false } 
                : { passive: false, capture: !!options };
              
              return originalAddEventListener.call(this, type, listener, newOptions);
            }
            
            return originalAddEventListener.call(this, type, listener, options);
          };
          
          // 对于已经绑定的事件，我们不能直接访问或移除它们
          // 但我们可以尝试重新触发组件渲染或添加覆盖层事件监听器
          
          // 添加一个捕获阶段的wheel事件处理器，以确保在passive监听器之前触发
          element.addEventListener('wheel', function(e) {
            // 检查是否应该阻止默认行为
            if (element.classList.contains('n-virtual-list') || 
                element.closest('.n-virtual-list') ||
                element.classList.contains('n-data-table')) {
              if (needsPreventDefault(e, element)) {
                e.preventDefault();
              }
            }
          }, { passive: false, capture: true });
        }
      });
    }

    /**
     * 确定是否需要阻止默认行为
     * 这个函数基于Naive UI虚拟列表的滚动逻辑
     */
    function needsPreventDefault(e, element) {
      // 检查是否已经达到滚动边界
      const scrollable = element.classList.contains('n-scrollbar') ? 
                          element : 
                          element.querySelector('.n-scrollbar') || element;
      
      if (!scrollable) return false;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollable;
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;
      
      // 如果向上滚动且已在顶部，或向下滚动且已在底部，阻止默认行为
      return (e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom);
    }

    onMounted(() => {
      // 应用修复并获取清理函数
      const cleanup = fixWheelEvents();
      
      // 组件卸载时清理
      onBeforeUnmount(cleanup);
    });
  }
};
</script> 