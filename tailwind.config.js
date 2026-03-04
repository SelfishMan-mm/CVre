/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,html}',
  ],
  theme: {
    extend: {
      colors: {
        // 原站品牌色（从 main.css 提取）
        turquoise: {
          light: '#17f1d1',
          DEFAULT: '#0dd4b8',
          dark: '#0ab89e',
        },
        purple: {
          light: '#c084fc',
          DEFAULT: '#a855f7',
          dark: '#7c3aed',
        },
        yellow: {
          light: '#fde68a',
          DEFAULT: '#fbbf24',
          dark: '#d97706',
        },
        // 背景黑
        ink: '#0a0a0a',
      },
      fontFamily: {
        // 替代 Matter（原站主字体）
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        // 替代 antique-olive（原站标题粗体）
        condensed: ['Barlow Condensed', 'sans-serif'],
      },
      screens: {
        // 桌面端限定，最小 1024px
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

