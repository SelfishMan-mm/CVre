// ===== Project 类型 =====
export interface Project {
  id: string
  title: string
  description: string          // 一句话描述
  detail: string               // STAR 法则详细描述
  tags: string[]               // 技术标签（Web / Python / etc.）
  cover: string                // 封面图路径（相对 src/assets/personal/）
  images?: string[]            // 项目截图（用于画廊预览）
  github?: string              // GitHub 链接
  demo?: string                // Demo 链接
  featured: boolean            // 是否在首页 Works 展示
}

// ===== Blog 文章类型 =====
export interface BlogPost {
  id: string
  title: string
  excerpt: string              // 摘要（用于卡片展示）
  cover: string                // 封面图路径或占位符 URL
  tags: string[]               // 技术标签
  date: string                 // 发布日期 ISO 字符串
  readingTime: number          // 预计阅读时间（分钟）
  theme: 'turquoise' | 'purple' | 'yellow'  // 卡片主题色，对应原站 data-theme
  url?: string                 // 外链（可选）
  content?: string             // 完整文章正文（Markdown-like，用 \n\n 分段）
}

// ===== 主题色类型 =====
export type ThemeColor = 'turquoise' | 'purple' | 'yellow' | 'black'

// ===== 动画状态 =====
export interface AnimateOptions {
  y?: number
  delay?: number
  duration?: number
}

// ===== 光标状态 =====
export interface CursorState {
  x: number
  y: number
  isHovering: boolean
  text: string
}
