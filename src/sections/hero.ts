/**
 * Hero 区块（对应原站 .home-cta）
 * - WebGL2 Canvas 替代视频背景
 * - 大标题逐字揭示（anime.js）
 * - 个人 slogan："crash / through / walls"（来自 materials.md 精神）
 */
import anime from 'animejs'
import { initWebGL } from '@scripts/webgl'
import { splitChars, prefersReducedMotion } from '@scripts/utils'

export function heroHTML(): string {
  return `
  <section class="home-cta" id="hero" aria-label="Hero">
    <!-- WebGL Canvas 背景 -->
    <canvas class="hero-canvas" aria-hidden="true"></canvas>

    <div class="wrap-o" style="position:relative;z-index:2;">
      <div class="wrap-i">
        <div class="home-cta-text">
          <h2 class="title-lg" aria-label="From small Beginning">
            <span data-split-chars>From</span>
            <span data-split-chars>small</span>
            <span data-split-chars>Beginning</span>
          </h2>
          <p class="hero-sub">Data Analysis &amp; Frontend Dev &amp; Vibe Coding</p>
          <a href="#works" class="button button-yellow hero-cta" data-cursor="view">
            <span class="button-inner">
              <span class="button-inner-static">View my work</span>
              <span class="button-inner-hover">View my work</span>
            </span>
          </a>
        </div>
      </div>
    </div>

    <!-- 向下滚动提示 -->
    <button class="home-cta-scroll-cta" aria-label="Scroll to works" onclick="document.getElementById('works')?.scrollIntoView({behavior:'smooth'})">
      <span class="scroll-cta-arrow">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 1v12M1 7l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </button>
  </section>
  `
}

export function initHero(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('.hero-canvas')!
  if (canvas) initWebGL(canvas)

  const rm = prefersReducedMotion()
  if (rm) return

  const lines = document.querySelectorAll<HTMLElement>('[data-split-chars]')
  const allChars: HTMLElement[] = []
  lines.forEach(line => {
    const chars = splitChars(line)
    allChars.push(...chars)
  })

  const sub = document.querySelector<HTMLElement>('.hero-sub')!
  const cta = document.querySelector<HTMLElement>('.hero-cta')!
  const scrollBtn = document.querySelector<HTMLElement>('.home-cta-scroll-cta')!

  anime.set(allChars, { translateY: '110%', opacity: 0 })
  anime.set([sub, cta, scrollBtn], { opacity: 0, translateY: '15px' })

  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: allChars,
      translateY: ['110%', '0%'],
      opacity: [0, 1],
      duration: 900,
      delay: anime.stagger(30, { start: 400 }),
    })
    .add({
      targets: sub,
      opacity: [0, 1],
      translateY: ['15px', '0px'],
      duration: 600,
    }, '-=400')
    .add({
      targets: cta,
      opacity: [0, 1],
      translateY: ['15px', '0px'],
      duration: 600,
    }, '-=450')
    .add({
      targets: scrollBtn,
      opacity: [0, 1],
      translateY: ['15px', '0px'],
      duration: 600,
    }, '-=500')
}
