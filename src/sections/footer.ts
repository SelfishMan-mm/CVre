/**
 * Footer 区块（对应原站 .footer）
 * - 超大字体排版：个性化 slogan
 * - 联系方式（邮箱 + GitHub）
 * - 返回顶部按钮
 * - "Design inspired by Poppr" 致敬声明
 */
import anime from 'animejs'
import { onIntersect, prefersReducedMotion } from '@scripts/utils'

export function footerHTML(): string {
  const email  = import.meta.env.VITE_EMAIL
  const github = import.meta.env.VITE_GITHUB
  const year   = new Date().getFullYear()

  return `
  <footer class="footer" id="footer" aria-label="Footer">
    <div class="wrap-o">
      <div class="wrap-i">
        <!-- CTA 联系区块 -->
        <div class="footer-cta" id="contact" data-contact-animate aria-label="Let's make great work together">
          <span class="footer-cta-word" data-cta-word>let's make</span>
          <span class="footer-cta-word" data-cta-word>great</span>
          <div class="footer-cta-row">
            <span class="footer-cta-word" data-cta-word>work</span>
            <a
              href="mailto:${email}"
              class="button button-yellow footer-cta-btn"
              data-cursor="email"
            >
              <span class="button-inner">
                <span class="button-inner-static">Get in touch</span>
                <span class="button-inner-hover">Get in touch</span>
              </span>
            </a>
          </div>
          <span class="footer-cta-word" data-cta-word>together</span>
        </div>

        <!-- 返回顶部 -->
        <div class="footer-back-top">
          <button
            class="back-top-btn"
            onclick="window.scrollTo({top:0,behavior:'smooth'})"
            aria-label="Back to top"
            data-cursor="top"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 14V2M2 8l6-6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- 底部信息 -->
        <div class="footer-bottom">
          <div class="footer-info">
            <address class="footer-contact" style="font-style:normal;">
              <a href="mailto:${email}" class="footer-link">${email}</a>
              <a href="${github}" target="_blank" rel="noopener" class="footer-link">GitHub ↗</a>
            </address>
          </div>

          <div class="footer-copy">
            <span class="label" style="color:#ffffff33">© ${year} MeLess</span>
            <span class="label footer-credit" style="color:#ffffff22">Design inspired by <a href="https://poppr.be" target="_blank" rel="noopener" style="color:#ffffff33;text-decoration:underline">Poppr</a></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="footer-bg-deco" aria-hidden="true"></div>
  </footer>
  `
}

export function initFooter(): void {
  const footer = document.getElementById('footer')!
  const rm = prefersReducedMotion()

  onIntersect(footer, () => {
    if (rm) return
    anime({
      targets: footer.querySelectorAll('[data-footer-word]'),
      translateY: ['60px', '0px'],
      opacity: [0, 1],
      delay: anime.stagger(80),
      duration: 800,
      easing: 'easeOutExpo',
    })
  })

  // 返回顶部按钮磁吸
  const btn = footer.querySelector<HTMLElement>('.back-top-btn')!
  if (btn && !rm) {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.3
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.3
      anime({ targets: btn, translateX: x, translateY: y, duration: 150, easing: 'easeOutQuad' })
    })
    btn.addEventListener('mouseleave', () => {
      anime({ targets: btn, translateX: 0, translateY: 0, duration: 400, easing: 'spring(1,80,10,0)' })
    })
  }
}
