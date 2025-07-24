/**
 * 通用的复制文本工具，提供多种复制方式的兼容
 * @param text 要复制的文本
 * @returns Promise<boolean> 是否复制成功
 */
export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    // 方法1：使用现代Clipboard API（如果可用）
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch(() => {
          // 如果Clipboard API失败，尝试方法2
          fallbackCopyToClipboard(text) ? resolve(true) : resolve(false);
        });
    } else {
      // 如果Clipboard API不可用，直接尝试方法2
      fallbackCopyToClipboard(text) ? resolve(true) : resolve(false);
    }
  });
}

/**
 * 后备的复制文本方法，使用DOM操作
 * @param text 要复制的文本
 * @returns boolean 是否复制成功
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    // 创建临时DOM元素
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 确保元素不可见
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    // 保存当前选择区域
    const selected = document.getSelection()?.rangeCount || 0 > 0 
      ? document.getSelection()?.getRangeAt(0) 
      : null;
    
    // 选择文本并复制
    textArea.select();
    const success = document.execCommand('copy');
    
    // 清理DOM
    document.body.removeChild(textArea);
    
    // 恢复原来的选择区域
    if (selected && document.getSelection()) {
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(selected);
    }
    
    return success;
  } catch (err) {
    console.error('复制失败:', err);
    return false;
  }
} 