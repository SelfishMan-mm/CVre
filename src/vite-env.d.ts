/// <reference types="vite/client" />

// 自定义环境变量类型提示
interface ImportMetaEnv {
  readonly VITE_EMAIL: string
  readonly VITE_GITHUB: string
  readonly VITE_SITE_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
