// monaco-config.ts - Monaco编辑器配置
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

// 全局注册worker
// @ts-ignore - Monaco编辑器运行时扩展window对象
window.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker();
    }
    return new editorWorker();
  }
};

// 导出编辑器配置
export const getEditorOptions = (language: string = 'json') => {
  return {
    theme: 'vs',
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    tabSize: 2,
    fontSize: 14,
    renderLineHighlight: 'all',
    formatOnPaste: true,
    wordWrap: 'on',
    folding: true,
    autoIndent: 'advanced',
    fixedOverflowWidgets: true,
    contextmenu: false,
    language
  };
}; 