/**
 * 自定义光标
 * - .cursor-inner：圆形跟随光标（mix-blend-mode: difference）
 * - anime.js spring 缓动跟随
 * - hover 时放大 + 显示文字
 */
import anime from 'animejs'
import { lerp } from '@scripts/utils'

export function initCursor(): void {
  // 不在触摸设备上初始化
  if (window.matchMedia('(pointer: coarse)').matches) return

  const inner = document.querySelector<HTMLElement>('.cursor-inner')!
  const text  = document.querySelector<HTMLElement>('.cursor-text')!
  if (!inner || !text) return

  let mx = window.innerWidth / 2, my = window.innerHeight / 2
  let cx = mx, cy = my
  let scale = 1

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX
    my = e.clientY
  }, { passive: true })

  // 磁吸 hover 检测
  document.addEventListener('mouseover', (e) => {
    const target = (e.target as HTMLElement).closest('a, button, [data-cursor]')
    if (target) {
      const label = (target as HTMLElement).dataset.cursor ?? ''
      text.textContent = label
      text.style.opacity = label ? '1' : '0'
      scale = 2.5
    }
  })

  document.addEventListener('mouseout', (e) => {
    const target = (e.target as HTMLElement).closest('a, button, [data-cursor]')
    if (target) {
      text.style.opacity = '0'
      scale = 1
    }
  })

  // 点击脉冲
  document.addEventListener('mousedown', () => {
    anime({ targets: inner, scale: 0.7, duration: 80, easing: 'easeOutQuad' })
  })
  document.addEventListener('mouseup', () => {
    anime({ targets: inner, scale, duration: 200, easing: 'spring(1, 90, 10, 0)' })
  })

  const tick = () => {
    // lerp 平滑跟随
    cx = lerp(cx, mx, 0.12)
    cy = lerp(cy, my, 0.12)
    inner.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) scale(${scale})`
    text.style.transform  = `translate(${mx + 20}px, ${my - 10}px)`
    void requestAnimationFrame(tick)
  }

  // 进入页面时淡入
  document.addEventListener('mousemove', () => {
    inner.style.opacity = '1'
    text.style.display = 'block'
  }, { once: true })

  void requestAnimationFrame(tick)
}

export function cursorHTML(): string {
  return `
    <div class="cursor-inner" aria-hidden="true"></div>
    <div class="cursor-text"  aria-hidden="true"></div>
  `
}
