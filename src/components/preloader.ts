/**
 * Preloader — 全屏遮罩进场动画
 * 顺序：背景 → 字母逐个揭示 → 副标题 → 整体上移消失
 * 返回 Promise，resolve 后触发首页入场
 */
import anime from 'animejs'
import { prefersReducedMotion } from '@scripts/utils'

export function preloaderHTML(): string {
  return `
    <div class="preloader" id="preloader" aria-label="Loading" role="status">
      <div class="preloader-bg"></div>
      <div class="preloader-content">
        <div class="preloader-name" aria-hidden="true">
          <span class="pl">M</span><span class="pl">e</span><span class="pl">L</span><span class="pl">e</span><span class="pl">s</span><span class="pl">s</span>
        </div>
        <div class="preloader-sub" aria-hidden="true">Frontend &amp; Data Engineer</div>
        <div class="preloader-bar-wrap" aria-hidden="true">
          <div class="preloader-bar"></div>
        </div>
      </div>
    </div>
  `
}

export function initPreloader(): Promise<void> {
  return new Promise(resolve => {
    const preloader = document.getElementById('preloader')!
    const letters = preloader.querySelectorAll<HTMLElement>('.pl')
    const sub  = preloader.querySelector<HTMLElement>('.preloader-sub')!
    const bar  = preloader.querySelector<HTMLElement>('.preloader-bar')!

    if (prefersReducedMotion()) {
      preloader.style.display = 'none'
      resolve()
      return
    }

    const tl = anime.timeline({ easing: 'easeOutExpo' })

    tl
      // 进度条填充
      .add({
        targets: bar,
        scaleX: [0, 1],
        duration: 900,
        easing: 'easeInOutQuart',
      })
      // 字母从下方揭示
      .add({
        targets: letters,
        translateY: ['110%', '0%'],
        opacity: [0, 1],
        duration: 700,
        delay: anime.stagger(60),
        easing: 'spring(1, 80, 10, 0)',
      }, '-=200')
      // 副标题淡入
      .add({
        targets: sub,
        opacity: [0, 1],
        translateY: ['10px', '0px'],
        duration: 500,
      }, '-=300')
      // 停留 → 整体向上消失
      .add({
        targets: preloader,
        translateY: '-100%',
        duration: 900,
        delay: 400,
        easing: 'easeInOutQuart',
        complete: () => {
          preloader.style.display = 'none'
          resolve()
        },
      })
  })
}
