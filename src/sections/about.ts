/**
 * About Me 区块 — 仿 poppr.be/about-us 风格
 * 1. Hero：大标题 + 个人简介 + 照片
 * 2. My Core Values：4 个价值观卡片
 * 3. My Journey：成长时间轴
 * 4. Tech Stack：技术图标
 */
import anime from 'animejs'
import { onIntersect, prefersReducedMotion } from '@scripts/utils'

const CORE_VALUES = [
  {
    num: '01',
    title: 'Curiosity',
    desc: '我构建，是因为我必须弄清楚事物的运作原理。每一个新框架、每一个新的技术——我都会一头扎进去。好奇心不是我刻意培养的品质，它是推着我不断前行的引擎。',
  },
  {
    num: '02',
    title: 'Persistence',
    desc: '坚持、从零开始——这些都不是障碍，而是过程本身。我会顶着阻力推进，直到作品真正正确，而不只是「完成了」。',
  },
  {
    num: '03',
    title: 'Craftsmanship',
    desc: '细节就是一切。整洁的 API、可读的代码、像素级精准的界面——我在乎那些肉眼看不见的打磨，正是这些把「还不错」和「真的好」区分开来。品质是一种习惯，不是某次决定。',
  },
  {
    num: '04',
    title: 'Impact',
    desc: '我构建有意义的东西。无论是自动化繁琐的数据管道、交付一个会反思你思维的 AI 伴侣，还是打磨一款让人真正享受的界面——目标始终是真实的、可感知的价值。',
  },
]

const JOURNEY = [
  { year: '2023', title: 'High school graduation', desc: '一个章节结束了。我决定，下一个章节用代码来书写。' },
  { year: '2024', title: 'C++ & Python', desc: '学会用程序员的方式思考——算法、数据结构，这些永不过时的基础。' },
  { year: '2025 4', title: 'Frontend & Web', desc: '学习了 HTML、CSS、JavaScript ，然后是 Three.js 和 GSAP。我意识到，把东西做美，本身就是一种工程挑战。' },
  { year: '2025 10', title: 'Data Engineering', desc: '独立搭建完整数据管道——爬取、清洗、ETL、PowerBI 可视化报表。我学到：没有故事的数据，只是噪声。' },
  { year: '2026 1', title: 'AI Tooling & LLMs', desc: '将 Kimi、MiniMax 和 RAG 集成进真实产品，开始把大模型当作基础设施来使用，而不是魔法。' },
]

const ICONS = [
  { file: 'python.svg',      label: 'Python' },
  { file: 'vuedotjs.svg',    label: 'Vue 3' },
  { file: 'react.svg',       label: 'React' },
  { file: 'typescript.svg',  label: 'TypeScript' },
  { file: 'nodedotjs.svg',   label: 'Node.js' },
  { file: 'cplusplus.svg',   label: 'C++' },
  { file: 'github.svg',      label: 'GitHub' },
]

const valuesHTML = CORE_VALUES.map(v => `
  <div class="cv-card" data-cv-animate>
    <span class="cv-num">${v.num}</span>
    <h3 class="cv-title">${v.title}</h3>
    <p class="cv-desc">${v.desc}</p>
  </div>
`).join('')

const journeyHTML = JOURNEY.map((item, i) => `
  <div class="journey-item" data-journey="${i}">
    <div class="journey-year">${item.year}</div>
    <div class="journey-line" aria-hidden="true"><div class="journey-dot"></div></div>
    <div class="journey-body">
      <h4 class="journey-title">${item.title}</h4>
      <p class="journey-desc">${item.desc}</p>
    </div>
  </div>
`).join('')

const iconsHTML = ICONS.map((icon, i) => `
  <div class="tech-icon" data-icon="${i}" title="${icon.label}" aria-label="${icon.label}">
    <img src="/assets/personal/${icon.file}" alt="${icon.label}" width="48" height="48">
  </div>
`).join('')

export function aboutHTML(): string {
  return `
  <section class="about-section" id="about" aria-label="About me">

    <!-- ① Hero：标题 + 照片 -->
    <div class="about-hero">
      <div class="wrap-o">
        <div class="wrap-i">
          <div class="about-hero-grid">
            <div class="about-hero-text">
              <h3 class="label about-label" data-about-animate>About me</h3>
              <h2 class="about-heading" data-about-animate>
                INTJ · 04<br/>Frontend &amp;<br/>Data Engineer
              </h2>
              <p class="about-bio" data-about-animate>
                我是一名热爱编程和Ai的大学生，从爬虫与数据管道，到 AI 驱动的数据看板与交互式 Web 体验，都独立完成交付。
                2024 年底开始写代码，从未停下来。我工作在<em>数据分析</em>、<em>前端开发</em>与<em>AI 工具</em>的交汇地带，
                笃信一件事：理解一样东西最好的方式，就是把它做出来。
              </p>
              <p class="about-bio" data-about-animate>
                目前正在寻找技术深度与创意野心并存的机会。
                在下方了解我的核心价值观与成长故事。
              </p>
            </div>
            <div class="about-photo-wrap" data-about-photo>
              <img
                src="/assets/personal/aboutme.png"
                alt="MeLess — personal photo"
                class="about-photo-img"
                onerror="this.style.display='none'"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ② My Core Values -->
    <div class="about-values">
      <div class="wrap-o">
        <div class="wrap-i">
          <h3 class="label about-values-label" data-about-animate>My Core Values</h3>
          <div class="cv-grid">
            ${valuesHTML}
          </div>
        </div>
      </div>
    </div>

    <!-- ③ My Journey -->
    <div class="about-journey">
      <div class="wrap-o">
        <div class="wrap-i">
          <h3 class="label about-values-label" data-about-animate>How it all began</h3>
          <div class="journey-track">
            ${journeyHTML}
          </div>
        </div>
      </div>
    </div>

    <!-- ④ Tech Stack -->
    <div class="about-stack">
      <div class="wrap-o">
        <div class="wrap-i">
          <h3 class="label about-values-label" data-about-animate>Tech Stack</h3>
          <div class="tech-icons-wrap" aria-label="Tech stack">
            ${iconsHTML}
          </div>
        </div>
      </div>
    </div>

  </section>
  `
}

export function initAbout(): void {
  const section = document.getElementById('about')!
  const rm = prefersReducedMotion()

  // Hero 文字 + 照片入场
  const heroText = section.querySelector<HTMLElement>('.about-hero-text')
  const photoWrap = section.querySelector<HTMLElement>('.about-photo-wrap')
  if (heroText) {
    onIntersect(heroText, () => {
      if (rm) return
      anime({
        targets: heroText.querySelectorAll('[data-about-animate]'),
        translateY: ['30px', '0px'],
        opacity: [0, 1],
        delay: anime.stagger(130),
        duration: 750,
        easing: 'easeOutExpo',
      })
    })
  }
  if (photoWrap) {
    onIntersect(photoWrap, () => {
      if (rm) return
      anime({
        targets: photoWrap,
        clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'],
        opacity: [0, 1],
        duration: 1100,
        delay: 200,
        easing: 'easeOutQuart',
      })
    })
  }

  // Core Values 卡片入场
  const valuesSection = section.querySelector<HTMLElement>('.about-values')
  if (valuesSection) {
    onIntersect(valuesSection, () => {
      if (rm) return
      anime({
        targets: valuesSection.querySelectorAll('[data-about-animate]'),
        translateY: ['20px', '0px'],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
      })
      anime({
        targets: valuesSection.querySelectorAll('.cv-card'),
        translateY: ['40px', '0px'],
        opacity: [0, 1],
        delay: anime.stagger(100, { start: 200 }),
        duration: 700,
        easing: 'easeOutExpo',
      })
    })
  }

  // Journey 时间轴入场
  const journeySection = section.querySelector<HTMLElement>('.about-journey')
  if (journeySection) {
    onIntersect(journeySection, () => {
      if (rm) return
      anime({
        targets: journeySection.querySelectorAll('[data-about-animate]'),
        translateY: ['20px', '0px'],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
      })
      anime({
        targets: journeySection.querySelectorAll('.journey-item'),
        translateX: ['-30px', '0px'],
        opacity: [0, 1],
        delay: anime.stagger(90, { start: 200 }),
        duration: 650,
        easing: 'easeOutExpo',
      })
      // 时间轴连线生长动画
      anime({
        targets: journeySection.querySelectorAll('.journey-dot'),
        scale: [0, 1],
        delay: anime.stagger(90, { start: 250 }),
        duration: 400,
        easing: 'spring(1, 80, 10, 0)',
      })
    })
  }

  // Tech Stack 入场 + 浮动
  const stackSection = section.querySelector<HTMLElement>('.about-stack')
  if (stackSection) {
    onIntersect(stackSection, () => {
      if (rm) return
      anime({
        targets: stackSection.querySelectorAll('[data-about-animate]'),
        translateY: ['20px', '0px'],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
      })
      anime({
        targets: section.querySelectorAll('.tech-icon'),
        scale: [0.3, 1],
        opacity: [0, 1],
        delay: anime.stagger(55, { start: 200 }),
        duration: 600,
        easing: 'spring(1, 80, 10, 0)',
      })
      if (!rm) {
        section.querySelectorAll<HTMLElement>('.tech-icon').forEach((icon, i) => {
          const amp = 6 + (i % 3) * 3
          anime({
            targets: icon,
            translateY: [`-${amp}px`, `${amp}px`],
            duration: 2000 + i * 300,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
            delay: i * 150,
          })
        })
      }
    })
  }
}
