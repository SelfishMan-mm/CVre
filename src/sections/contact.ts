/**
 * Contact CTA 区块（对应原站 .cta）
 * - 豁免表单，仅展示邮箱 + GitHub 链接
 * - 大标题 + hover 动画按钮
 */
import anime from 'animejs'
import { onIntersect, prefersReducedMotion } from '@scripts/utils'

/** contact 区块已并入 footer，此函数返回空字符串保持接口兼容 */
export function contactHTML(): string {
  return ''
}

export function initContact(): void {
  const section = document.getElementById('contact')
  if (!section) return
  const rm = prefersReducedMotion()

  // 初始隐藏（等待 IntersectionObserver 触发入场）
  if (!rm) {
    const btn = section.querySelector<HTMLElement>('.footer-cta-btn')
    if (btn) btn.style.opacity = '0'
  }

  onIntersect(section, () => {
    if (rm) return
    anime({
      targets: section.querySelectorAll('[data-cta-word]'),
      translateY: ['40px', '0px'],
      opacity: [0, 1],
      delay: anime.stagger(80),
      duration: 800,
      easing: 'easeOutExpo',
    })
    anime({
      targets: section.querySelector('.footer-cta-btn'),
      scale: [0.85, 1],
      opacity: [0, 1],
      duration: 600,
      delay: 400,
      easing: 'easeOutExpo',
    })
  })
}
