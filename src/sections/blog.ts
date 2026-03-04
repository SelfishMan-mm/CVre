/**
 * Blog 区块（对应原站 .home-insights）
 * - 4 篇文章卡片网格
 * - 数据来自 blog.json
 * - 有 content 字段的卡片点击后打开全文弹窗
 */
import anime from 'animejs'
import { onIntersect, prefersReducedMotion, formatDate } from '@scripts/utils'
import posts from '@data/blog.json'
import type { BlogPost } from '@/types'

/** 将 content 中的简单 Markdown 转为 HTML */
function renderContent(text: string): string {
  return text
    .split('\n\n')
    .map(para => {
      if (para.startsWith('**') && para.endsWith('**')) {
        return `<h3 class="blog-modal-h3">${para.slice(2, -2)}</h3>`
      }
      // 行内 **bold**
      const html = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      return `<p>${html}</p>`
    })
    .join('')
}

export function blogHTML(): string {
  const cards = (posts as BlogPost[]).map(post => {
    const hasContent = !!(post as BlogPost).content
    return `
  <li class="insight${hasContent ? ' insight-readable' : ''}" data-theme="${post.theme}" ${hasContent ? `data-post-id="${post.id}" role="button" tabindex="0" aria-label="${post.title} — 点击阅读全文"` : 'role="listitem"'}>
    <div class="gradient-overlay insight-img">
      <div class="insight-img-inner">
        <img
          src="${post.cover}"
          alt="${post.title}"
          loading="lazy"
          width="800" height="600"
        >
      </div>
    </div>
    <div class="insight-link">
      <span class="label">${post.tags.join(' • ')}</span>
      <h4>${post.title}</h4>
      <p class="insight-excerpt">${post.excerpt}</p>
      <div class="insight-meta">
        <span class="label" style="color:#ffffff55">${formatDate(post.date)}</span>
        <span class="label" style="color:#ffffff55">${post.readingTime} min read</span>
        ${hasContent ? '<span class="label blog-read-cta" style="color:var(--color-yellow)">阅读全文 →</span>' : ''}
      </div>
    </div>
  </li>
  `
  }).join('')

  return `
  <!-- 博客全文弹窗 -->
  <div id="blog-modal" class="demo-modal" aria-modal="true" role="dialog" aria-label="Blog post" hidden>
    <div class="demo-modal-backdrop"></div>
    <div class="demo-modal-window blog-modal-window">
      <button class="demo-modal-close" aria-label="Close" type="button">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <div id="blog-modal-content" class="blog-modal-body"></div>
    </div>
  </div>

  <section class="home-insights insights" id="blog" aria-label="Blog posts">
    <div class="insights-bg" aria-hidden="true"></div>
    <div class="wrap-o">
      <div class="wrap-i">
        <div class="text-center" style="margin-bottom:3rem;">
          <h3 class="label" data-animate-blog>Featured writing</h3>
        </div>
        <div>
          <ul class="insights-grid" role="list" aria-label="Blog posts">
            ${cards}
          </ul>
        </div>
        <div class="text-center" style="margin-top:3rem;">
          <span class="button button-outlined" style="opacity:.4;cursor:default;pointer-events:none;">
            <span class="button-inner">
              <span class="button-inner-static">More posts coming soon</span>
              <span class="button-inner-hover">More posts coming soon</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </section>
  `
}

export function initBlog(): void {
  const section = document.getElementById('blog')!
  const rm = prefersReducedMotion()

  onIntersect(section, () => {
    if (rm) return
    anime({
      targets: section.querySelectorAll('.insight'),
      translateY: ['30px', '0px'],
      opacity: [0, 1],
      delay: anime.stagger(80),
      duration: 700,
      easing: 'easeOutExpo',
    })
    anime({
      targets: section.querySelector('[data-animate-blog]'),
      translateY: ['15px', '0px'],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutExpo',
    })
  })

  // hover 主题色
  section.querySelectorAll<HTMLElement>('.insight').forEach(card => {
    const theme = card.dataset.theme
    const colorMap: Record<string, string> = {
      turquoise: 'var(--color-turquoise)',
      purple:    'var(--color-purple)',
      yellow:    'var(--color-yellow)',
    }
    const color = colorMap[theme ?? ''] ?? 'var(--color-turquoise)'
    card.addEventListener('mouseenter', () => {
      anime({ targets: card.querySelector('.insight-img'), scale: 1.04, duration: 400, easing: 'easeOutQuad' })
      const label = card.querySelector<HTMLElement>('.label')
      if (label) label.style.color = color
    })
    card.addEventListener('mouseleave', () => {
      anime({ targets: card.querySelector('.insight-img'), scale: 1, duration: 400, easing: 'easeOutQuad' })
    })
  })

  // 全文弹窗
  const modal    = document.getElementById('blog-modal') as HTMLElement
  const modalBody = document.getElementById('blog-modal-content') as HTMLElement
  const closeBtn = modal.querySelector<HTMLElement>('.demo-modal-close')!
  const backdrop = modal.querySelector<HTMLElement>('.demo-modal-backdrop')!
  const postMap  = new Map((posts as BlogPost[]).filter(p => p.content).map(p => [p.id, p]))

  function openModal(postId: string) {
    const post = postMap.get(postId)
    if (!post || !post.content) return
    modalBody.innerHTML = `
      <div class="blog-modal-header">
        <span class="label" style="color:var(--color-yellow)">${post.tags.join(' • ')}</span>
        <h2 class="blog-modal-title">${post.title}</h2>
        <div class="insight-meta" style="margin-top:.5rem;">
          <span class="label" style="color:#ffffff55">${formatDate(post.date)}</span>
          <span class="label" style="color:#ffffff55">${post.readingTime} min read</span>
        </div>
      </div>
      <div class="blog-modal-text">${renderContent(post.content)}</div>
    `
    modal.hidden = false
    document.body.style.overflow = 'hidden'
    anime({ targets: modal.querySelector('.blog-modal-window'), translateY: ['40px', '0px'], opacity: [0, 1], duration: 420, easing: 'easeOutExpo' })
  }

  function closeModal() {
    anime({
      targets: modal.querySelector('.blog-modal-window'),
      translateY: ['0px', '30px'], opacity: [1, 0], duration: 280, easing: 'easeInQuad',
      complete: () => { modal.hidden = true; document.body.style.overflow = '' }
    })
  }

  section.querySelectorAll<HTMLElement>('.insight-readable').forEach(card => {
    card.style.cursor = 'pointer'
    const open = () => openModal(card.dataset.postId!)
    card.addEventListener('click', open)
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open() })
  })

  closeBtn.addEventListener('click', closeModal)
  backdrop.addEventListener('click', closeModal)
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal() })
}

