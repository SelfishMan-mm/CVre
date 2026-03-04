import './styles/base.css'
import './styles/components.css'

// Theatre.js Studio 僅在開發環境加載（生產包中完全排除）
if (import.meta.env.DEV) {
  import('@theatre/studio').then(({ default: studio }) => {
    studio.initialize()
  }).catch(() => { /* Theatre.js studio 非必要，靜默失敗 */ })
}

import { cursorHTML,    initCursor }    from '@components/cursor'
import { preloaderHTML, initPreloader } from '@components/preloader'
import { navbarHTML,    initNav }       from '@components/navbar'
import { heroHTML,      initHero }      from '@sections/hero'
import { worksHTML,     initWorks }     from '@sections/works'
import { blogHTML,      initBlog }      from '@sections/blog'
import { aboutHTML,     initAbout }     from '@sections/about'
import { contactHTML,   initContact }   from '@sections/contact'
import { footerHTML,    initFooter }    from '@sections/footer'

/* ── 构建页面结构 ─────────────────────────────────── */
const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  ${cursorHTML()}
  ${preloaderHTML()}
  ${navbarHTML()}
  <main id="main-content">
    ${heroHTML()}
    ${worksHTML()}
    ${blogHTML()}
    ${aboutHTML()}
    ${contactHTML()}
  </main>
  ${footerHTML()}
`

/* ── 初始化序列 ───────────────────────────────────── */
async function init(): Promise<void> {
  // 1. 预加载动画（等待 Promise resolve 后继续）
  await initPreloader()

  // 2. 即时初始化（不依赖 IntersectionObserver 的模块）
  initNav()
  initHero()

  // 3. 懒初始化（IntersectionObserver 驱动，顺序无强依赖）
  initWorks()
  initBlog()
  initAbout()
  initContact()
  initFooter()

  // 4. 自定义光标最后加载（需 DOM 完整才能追踪元素）
  initCursor()

  if (import.meta.env.DEV) {
    console.log(`[${import.meta.env.VITE_SITE_NAME ?? 'MeLess'}] Portfolio init complete ✓`)
  }
}

init().catch(console.error)


