/**
 * Works 区块（对应原站 .home-selected-work）
 * - 项目卡片横向滚动轮播
 * - 3D 视差倾斜效果（mouse tilt）
 * - 数据来自 projects.json（仅展示 featured）
 */
import anime from 'animejs'
import { onIntersect, prefersReducedMotion } from '@scripts/utils'
import projects from '@data/projects.json'
import type { Project } from '@/types'

const featured = (projects as Project[]).filter(p => p.featured)

/** 生成卡片内部公共 HTML（图片 + shimmer + 文字叠层） */
function cardInner(p: Project): string {
  return `
    <div class="carousel-item-img">
      <div class="carousel-item-img-inner">
        <img src="/assets/${p.cover}" alt="${p.title}" loading="lazy"
          onerror="this.src='https://placehold.co/800x600/111/17f1d1?text=Project'">
      </div>
      <div class="card-shimmer" aria-hidden="true"></div>
      <div class="carousel-item-text">
        <span class="card-tags">${p.tags.join(' • ')}</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>
    </div>
  `
}

function projectCard(p: Project): string {
  // 有图片画廊时用 button 打开画廊模态框
  if (p.images && p.images.length) {
    return `
  <button type="button" class="carousel-item card-hidden"
    data-gallery="${encodeURIComponent(JSON.stringify(p.images))}"
    data-title="${p.title}" data-cursor="view" aria-label="${p.title}">
    ${cardInner(p)}
  </button>
  `
  }
  // 有 demo 时用 button 打开内嵌模态框，否则跳转 GitHub
  if (p.demo) {
    return `
  <button type="button" class="carousel-item card-hidden"
    data-demo="${p.demo}" data-cursor="view" aria-label="${p.title}">
    ${cardInner(p)}
  </button>
  `
  }
  return `
  <a href="${p.github ?? '#'}" class="carousel-item card-hidden"
    target="_blank" rel="noopener" data-cursor="view" aria-label="${p.title}">
    ${cardInner(p)}
  </a>
  `
}

export function worksHTML(): string {
  return `
  <!-- 作品 Demo 模态框 -->
  <div id="demo-modal" class="demo-modal" aria-modal="true" role="dialog" aria-label="Project demo" hidden>
    <div class="demo-modal-backdrop"></div>
    <div class="demo-modal-window">
      <button class="demo-modal-close" aria-label="Close demo" type="button">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <iframe id="demo-iframe" src="" title="Project Demo" allowfullscreen></iframe>
    </div>
  </div>

  <!-- 项目图片画廊模态框 -->
  <div id="gallery-modal" class="demo-modal" aria-modal="true" role="dialog" aria-label="Project gallery" hidden>
    <div class="demo-modal-backdrop"></div>
    <div class="demo-modal-window" style="background:var(--color-black,#0a0a0a);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;gap:1.5rem;max-width:900px;width:90vw;">
      <button class="demo-modal-close" aria-label="Close gallery" type="button">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <h4 id="gallery-title" style="color:#fff;margin:0;font-size:1rem;letter-spacing:0.05em;text-align:center;"></h4>
      <div id="gallery-track" style="display:flex;gap:1rem;width:100%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:thin;scrollbar-color:var(--color-turquoise,#17f1d1) transparent;padding-bottom:0.5rem;">
      </div>
      <div id="gallery-dots" style="display:flex;gap:0.5rem;"></div>
    </div>
  </div>

  <section class="home-selected-work" id="works" aria-label="Selected works">
    <div class="wrap-o z-10" style="position:relative;">
      <div class="wrap-i">
        <div class="home-selected-work-text">
          <div class="home-selected-work-label">
            <h3 class="label" data-animate>Selected work</h3>
          </div>
          <div class="home-selected-work-desc" data-animate>
            <p>
              Projects built with
              <span class="colored-text text-purple-dark">frontend</span>,
              <span class="colored-text text-turquoise">data analysis</span>
              &amp;
              <span class="colored-text" style="color:var(--color-yellow)">AI tooling</span>
            </p>
          </div>
        </div>

        <div class="works-grid" data-animate>
          ${featured.map(projectCard).join('')}
        </div>
      </div>
    </div>

    <div class="works-cta-row">
      <a href="https://github.com/SelfishMan-mm" target="_blank" rel="noopener" class="button button-outlined" data-cursor>
        <span class="button-inner">
          <span class="button-inner-static">More on GitHub ↗</span>
          <span class="button-inner-hover">More on GitHub ↗</span>
        </span>
      </a>
    </div>
  </section>
  `
}

export function initWorks(): void {
  const section  = document.getElementById('works')!
  const label    = section.querySelector<HTMLElement>('[data-animate]')!
  const rm       = prefersReducedMotion()

  // 标题区块入场动画
  onIntersect(label, () => {
    if (rm) return
    anime({
      targets: section.querySelectorAll('[data-animate]'),
      translateY: ['20px', '0px'],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 600,
      easing: 'easeOutExpo',
    })
  })

  // 卡片滚动进入：从下方淡入并旋转归位，stagger 0.1s
  const cards = Array.from(section.querySelectorAll<HTMLElement>('.carousel-item'))
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const card = entry.target as HTMLElement
        const idx  = cards.indexOf(card)
        const delay = rm ? 0 : idx * 100
        card.style.transitionDelay = `${delay}ms`
        card.classList.remove('card-hidden')
        card.classList.add('card-visible')
        // 进入动画完成后，移除慢速 transition，换成快速响应
        setTimeout(() => {
          card.style.transitionDelay = ''
          card.style.transition = 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.45s cubic-bezier(0.23, 1, 0.32, 1)'
        }, delay + 700) // 700ms 是 .card-hidden 的 transition 时长
        scrollObserver.unobserve(card)
      })
    },
    { threshold: 0.15 }
  )
  cards.forEach(c => scrollObserver.observe(c))

  // Demo 模态框逻辑
  const modal   = document.getElementById('demo-modal') as HTMLElement
  const iframe  = document.getElementById('demo-iframe') as HTMLIFrameElement
  const closeBtn = modal?.querySelector<HTMLButtonElement>('.demo-modal-close')
  const backdrop = modal?.querySelector<HTMLElement>('.demo-modal-backdrop')

  function openDemo(url: string) {
    iframe.src = url
    modal.hidden = false
    document.body.style.overflow = 'hidden'
    anime({ targets: modal.querySelector('.demo-modal-window'), scale: [0.94, 1], opacity: [0, 1], duration: 320, easing: 'easeOutExpo' })
  }

  function closeDemo() {
    anime({
      targets: modal.querySelector('.demo-modal-window'),
      scale: [1, 0.94], opacity: [1, 0], duration: 240, easing: 'easeInExpo',
      complete: () => { modal.hidden = true; iframe.src = ''; document.body.style.overflow = '' }
    })
  }

  section.querySelectorAll<HTMLElement>('[data-demo]').forEach(btn => {
    btn.addEventListener('click', () => openDemo(btn.dataset.demo!))
  })
  closeBtn?.addEventListener('click', closeDemo)
  backdrop?.addEventListener('click', closeDemo)
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeDemo() })

  // 画廊模态框逻辑
  const galleryModal   = document.getElementById('gallery-modal') as HTMLElement
  const galleryTrack   = document.getElementById('gallery-track') as HTMLElement
  const galleryDots    = document.getElementById('gallery-dots') as HTMLElement
  const galleryTitle   = document.getElementById('gallery-title') as HTMLElement
  const galleryClose   = galleryModal?.querySelector<HTMLButtonElement>('.demo-modal-close')
  const galleryBackdrop = galleryModal?.querySelector<HTMLElement>('.demo-modal-backdrop')

  function openGallery(images: string[], title: string) {
    galleryTitle.textContent = title
    galleryTrack.innerHTML = images.map((src, i) => `
      <div style="flex:0 0 100%;scroll-snap-align:start;display:flex;justify-content:center;">
        <img src="/assets/${src}" alt="${title} screenshot ${i + 1}"
          style="max-width:100%;max-height:70vh;object-fit:contain;border-radius:8px;"
          onerror="this.src='https://placehold.co/800x500/111/17f1d1?text=Image'">
      </div>
    `).join('')
    galleryDots.innerHTML = images.map((_, i) => `
      <button data-dot="${i}" style="width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;background:${i === 0 ? 'var(--color-turquoise,#17f1d1)' : 'rgba(255,255,255,0.3)'};transition:background 0.2s;"></button>
    `).join('')
    // 点点导航
    galleryDots.querySelectorAll<HTMLButtonElement>('[data-dot]').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = Number(dot.dataset.dot)
        const itemW = galleryTrack.clientWidth
        galleryTrack.scrollTo({ left: idx * itemW, behavior: 'smooth' })
      })
    })
    // 滚动时更新点点高亮
    galleryTrack.addEventListener('scroll', () => {
      const idx = Math.round(galleryTrack.scrollLeft / (galleryTrack.clientWidth || 1))
      galleryDots.querySelectorAll<HTMLButtonElement>('[data-dot]').forEach((d, i) => {
        d.style.background = i === idx ? 'var(--color-turquoise,#17f1d1)' : 'rgba(255,255,255,0.3)'
      })
    }, { passive: true })
    galleryModal.hidden = false
    document.body.style.overflow = 'hidden'
    anime({ targets: galleryModal.querySelector('.demo-modal-window'), scale: [0.94, 1], opacity: [0, 1], duration: 320, easing: 'easeOutExpo' })
  }

  function closeGallery() {
    anime({
      targets: galleryModal.querySelector('.demo-modal-window'),
      scale: [1, 0.94], opacity: [1, 0], duration: 240, easing: 'easeInExpo',
      complete: () => { galleryModal.hidden = true; galleryTrack.innerHTML = ''; document.body.style.overflow = '' }
    })
  }

  section.querySelectorAll<HTMLElement>('[data-gallery]').forEach(btn => {
    btn.addEventListener('click', () => {
      const images: string[] = JSON.parse(decodeURIComponent(btn.dataset.gallery!))
      const title = btn.dataset.title ?? ''
      openGallery(images, title)
    })
  })
  galleryClose?.addEventListener('click', closeGallery)
  galleryBackdrop?.addEventListener('click', closeGallery)
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !galleryModal.hidden) closeGallery() })

  // ── 3D 倾斜效果（鼠标 + 触摸双支持，CSS 自定义属性驱动）──
  if (!rm) {
    section.querySelectorAll<HTMLElement>('.carousel-item').forEach(card => {

      function applyTilt(nx: number, ny: number) {
        // nx / ny 均在 [-0.5, 0.5]
        card.style.setProperty('--ry',  `${nx * 14}deg`)
        card.style.setProperty('--rx',  `${-ny * 10}deg`)
        card.style.setProperty('--tz',  '32px')
      }

      function resetTilt() {
        card.style.setProperty('--ry',  '4deg')
        card.style.setProperty('--rx',  '0deg')
        card.style.setProperty('--tz',  '0px')
      }

      // == 鼠标 ==
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const nx = (e.clientX - rect.left) / rect.width  - 0.5
        const ny = (e.clientY - rect.top)  / rect.height - 0.5
        applyTilt(nx, ny)
      })
      card.addEventListener('mouseleave', resetTilt)

      // == 触摸 ==
      card.addEventListener('touchmove', (e: TouchEvent) => {
        if (e.touches.length !== 1) return
        const t = e.touches[0]
        const rect = card.getBoundingClientRect()
        const nx = (t.clientX - rect.left) / rect.width  - 0.5
        const ny = (t.clientY - rect.top)  / rect.height - 0.5
        applyTilt(nx, ny)
      }, { passive: true })
      card.addEventListener('touchend',   resetTilt, { passive: true })
      card.addEventListener('touchcancel', resetTilt, { passive: true })
    })
  }
}
