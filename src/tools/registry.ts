export interface ToolMeta {
  path: string
  name: string
  icon: string
  component: () => Promise<any>
}

export const tools: ToolMeta[] = [] 