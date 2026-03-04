/**
 * 导航栏
 * - 静态状态：Logo + CTA + 汉堡按钮
 * - 滚动向下隐藏，向上显示
 * - 汉堡按钮展开全屏菜单（clip-path 动画 + anime.js）
 */
import anime from 'animejs'
import { prefersReducedMotion } from '@scripts/utils'

const NAV_LINKS = [
  { label: 'Works',   href: '#works' },
  { label: 'Blog',    href: '#blog' },
  { label: 'About',   href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function navbarHTML(): string {
  const links = NAV_LINKS.map((l, i) =>
    `<a href="${l.href}" class="nav-menu-link" data-nav-index="${i}">${l.label.toLowerCase()}</a>`
  ).join('')

  return `
  <nav class="nav" id="main-nav" aria-label="Main navigation">
    <div class="nav-bar">
      <div class="wrap-o">
        <div class="wrap-i">
          <div class="flex w-full justify-between items-center">
            <!-- Logo -->
            <a href="/" class="logo" aria-label="MeLess — home">
              <span>M</span><span>e</span><span>L</span><span>e</span><span>s</span><span>s</span>
            </a>
            <div class="flex items-center gap-3">
              <!-- CTA —原版形状：options 圆角枝 pill -->
              <a href="#contact" class="nav-cta button button-outlined">
                <span class="button-inner">
                  <span class="button-inner-static">Get in touch</span>
                  <span class="button-inner-hover">Get in touch</span>
                </span>
              </a>
              <!-- 汉堡按鈕：三条线 inline SVG 确保渲染可靠 -->
              <button class="nav-menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-menu">
                <svg class="hamburger-svg" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <line class="hb-line hb-t" x1="0" y1="1"  x2="20" y2="1"  stroke="white" stroke-width="2" stroke-linecap="round"/>
                  <line class="hb-line hb-m" x1="0" y1="7"  x2="20" y2="7"  stroke="white" stroke-width="2" stroke-linecap="round"/>
                  <line class="hb-line hb-b" x1="0" y1="13" x2="20" y2="13" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- 全屏菜单：position:fixed 必须与 nav 平级，避免被 nav transform 截断 -->
  <div class="nav-menu" id="nav-menu" aria-hidden="true" role="dialog" aria-modal="true">
    <!-- 背景层：from 底部向上 clip-path 展开 -->
    <div class="nav-menu-bg"></div>
    <!-- 内容层 -->
    <div class="nav-menu-body">
      <!-- 左下角：联系信息 -->
      <div class="nav-menu-aside">
        <span class="label nm-label">Get in touch</span>
        <div class="nm-contacts">
          <a href="mailto:2779279397@qq.com" class="nm-contact-link">2779279397@qq.com</a>
          <a href="https://github.com/SelfishMan-mm" target="_blank" rel="noopener" class="nm-contact-link">GitHub ↗</a>
        </div>
      </div>
      <!-- 右侧：大字导航链接 -->
      <nav class="nm-links" aria-label="Site navigation">
        ${links}
      </nav>
    </div>
  </div>
  `
}

export function initNav(): void {
  const nav       = document.getElementById('main-nav')!
  const toggle    = nav.querySelector<HTMLButtonElement>('.nav-menu-toggle')!
  // 菜单与 nav 平级，用 document 查找
  const menu      = document.getElementById('nav-menu')!
  const menuLinks = menu.querySelectorAll<HTMLAnchorElement>('.nav-menu-link')
  const menuAside = menu.querySelector<HTMLElement>('.nav-menu-aside')!
  const bars      = toggle.querySelectorAll<SVGLineElement>('.hb-line')

  let menuOpen  = false
  let lastY     = 0
  let navHidden = false
  const rm = prefersReducedMotion()

  // ── 滚动显隐（用 top 而非 transform，避免子 fixed 元素被影响）──
  const navH = () => nav.getBoundingClientRect().height
  const onScroll = () => {
    const y = window.scrollY
    if (y > lastY && y > 80 && !menuOpen) {
      if (!navHidden) {
        navHidden = true
        nav.style.transition = 'top 0.35s cubic-bezier(0.76,0,0.24,1)'
        nav.style.top = `-${navH() + 4}px`
      }
    } else {
      if (navHidden) {
        navHidden = false
        nav.style.transition = 'top 0.35s cubic-bezier(0.76,0,0.24,1)'
        nav.style.top = '0px'
      }
    }
    lastY = y
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  // ── 菜单开关 ─────────────────────────────
  const openMenu = () => {
    menuOpen = true
    document.body.style.overflow = 'hidden'
    toggle.setAttribute('aria-expanded', 'true')
    toggle.setAttribute('aria-label', 'Close menu')
    menu.setAttribute('aria-hidden', 'false')
    menu.classList.add('is-open')

    // 汉堡 → ×
    if (!rm) {
      anime({ targets: bars[0], attr: { y1: 7, y2: 7 }, rotate: 45,  duration: 300, easing: 'easeOutQuad' })
      anime({ targets: bars[1], opacity: 0,                           duration: 150, easing: 'easeOutQuad' })
      anime({ targets: bars[2], attr: { y1: 7, y2: 7 }, rotate: -45, duration: 300, easing: 'easeOutQuad' })

      // 链接从右下滑入
      anime.set(menuLinks, { translateY: '60px', opacity: 0 })
      anime.set(menuAside,  { translateY: '30px', opacity: 0 })
      anime({
        targets: menuLinks,
        translateY: ['60px', '0px'],
        opacity: [0, 1],
        delay: anime.stagger(70, { start: 200 }),
        duration: 600,
        easing: 'easeOutExpo',
      })
      anime({
        targets: menuAside,
        translateY: ['30px', '0px'],
        opacity: [0, 1],
        delay: 300,
        duration: 500,
        easing: 'easeOutExpo',
      })
    } else {
      menuLinks.forEach(l => { l.style.opacity = '1'; l.style.transform = 'none' })
    }
  }

  const closeMenu = () => {
    menuOpen = false
    document.body.style.overflow = ''
    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('aria-label', 'Open menu')
    menu.setAttribute('aria-hidden', 'true')
    menu.classList.remove('is-open')

    // × → 汉堡
    if (!rm) {
      anime({ targets: bars[0], attr: { y1: 1,  y2: 1  }, rotate: 0, duration: 300, easing: 'easeOutQuad' })
      anime({ targets: bars[1], opacity: 1,                           duration: 200, easing: 'easeOutQuad' })
      anime({ targets: bars[2], attr: { y1: 13, y2: 13 }, rotate: 0, duration: 300, easing: 'easeOutQuad' })
    }
  }

  toggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu())
  menuLinks.forEach(l => l.addEventListener('click', () => closeMenu()))
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu() })

  // 导航栏入场（使用 top，不用 transform）
  if (!rm) {
    nav.style.top = `-${navH() + 4}px`
    nav.style.opacity = '0'
    setTimeout(() => {
      nav.style.transition = 'top 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease'
      nav.style.top = '0px'
      nav.style.opacity = '1'
    }, 200)
  }
}
