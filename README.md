# MeLess — Personal Portfolio

Personal portfolio site inspired by [Poppr](https://poppr.be), built with Vite + TypeScript + Tailwind CSS + anime.js.

## Tech Stack

| Layer | Library / Tool |
|---|---|
| Build | Vite 5 + TypeScript (strict) |
| Styling | Tailwind CSS 3 + custom CSS |
| Animation | anime.js 3.2.1 |
| 3D timeline | Theatre.js 0.6 (studio in DEV only) |
| WebGL | WebGL2 (custom FBM domain-warping shader) |
| Fonts | Plus Jakarta Sans · Barlow Condensed (Google Fonts) |
| Deploy | Vercel |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env example and fill in values
cp .env.example .env

# 3. Start dev server
npm run dev

# 4. Production build
npm run build
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_EMAIL` | Contact email shown in Contact section & Footer |
| `VITE_GITHUB` | GitHub profile URL |
| `VITE_SITE_NAME` | Site name used in debug logs |

See `.env.example` for the template.

## Project Structure

```
src/
├── components/        # cursor / navbar / preloader
├── sections/          # hero / works / blog / about / contact / footer
├── scripts/           # utils / webgl
├── styles/            # base.css / components.css
├── assets/            # (source images — dev only, copied to public/ for prod)
├── data/
│   ├── projects.json  # Personal project data
│   └── blog.json      # Blog post data
└── types/             # TypeScript interfaces

public/
├── assets/personal/   # Project screenshots & tech icons (served as static)
├── favicon.svg
├── sitemap.xml
└── robots.txt
```

## Personalizing Content

- **Projects** → edit `src/data/projects.json`, add cover images to `public/assets/personal/`
- **Blog posts** → edit `src/data/blog.json`
- **About timeline** → edit the `TIMELINE` array in `src/sections/about.ts`
- **Tech icons** → edit the `ICONS` array in `src/sections/about.ts`
- **Contact links** → set `VITE_EMAIL` and `VITE_GITHUB` in `.env`

## Design Credit

> Design inspired by [Poppr](https://poppr.be). All code written from scratch.
