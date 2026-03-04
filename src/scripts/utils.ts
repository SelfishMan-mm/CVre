/** 检测用户是否偏好减弱动效 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * 将元素内文本拆分为逐字 <span>，并为每个 span 加 overflow:hidden 父容器
 * 用于「从底部揭示」动画
 */
export function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? ''
  el.textContent = ''
  el.setAttribute('aria-label', text)
  return text.split('').map(char => {
    const span = document.createElement('span')
    span.textContent = char === ' ' ? '\u00A0' : char
    span.style.display = 'inline-block'
    span.setAttribute('aria-hidden', 'true')
    el.appendChild(span)
    return span
  })
}

/**
 * 将元素内文本拆分为逐行 <span>（用 data-split-line 标记每行）
 * 此处实现为逐 span 换行组，适配 title-lg 多行标题
 */
export function splitLines(container: HTMLElement): HTMLElement[][] {
  const lines = container.querySelectorAll<HTMLElement>('[data-split-chars]')
  return Array.from(lines).map(line => splitChars(line))
}

/**
 * IntersectionObserver 封装：进入视口后触发一次 callback
 */
export function onIntersect(
  el: Element,
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = { threshold: 0.12 }
): () => void {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry)
        observer.unobserve(el)
      }
    })
  }, options)
  observer.observe(el)
  return () => observer.disconnect()
}

export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** 格式化日期 "2025-08-15" → "Aug 2025" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
