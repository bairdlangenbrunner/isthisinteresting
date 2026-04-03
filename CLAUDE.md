# CLAUDE.md — Consolidate personal site + blog into one Next.js app

## Goal

Merge two separate apps — a React/Vite personal site (`bairdlangenbrunner`) and a Next.js blog (`isthisinteresting`) — into a **single Next.js app**. The Next.js blog is the base; the Vite site's pages get migrated into it. The result is one repo, one deploy, one pm2 process on the VPS.

## Current state

### Personal site (Vite + React)
- **Repo**: `github.com/bairdlangenbrunner/bairdlangenbrunner`
- **Stack**: React 18, Vite, React Router v6, plain CSS (no Tailwind), d3-geo + topojson for the homepage globe
- **Routes**: `/` (Home — animated Homolosine globe), `/about`, `/projects`
- **Layout**: `Layout.jsx` wraps all routes with `Header` + `Footer`. Header has desktop icon nav (Heroicons) + mobile hamburger menu. Footer links to GitHub repo.
- **Styling**: Custom CSS in `src/index.css` using CSS custom properties from `src/tailwindcss-colors.css` (Tailwind color palette as CSS vars, NOT actual Tailwind). Distinctive look: lime-700 border around the app container, outlined display-font titles (`-webkit-text-stroke`), icon-only nav with tooltips on desktop, pill-style mobile menu.
- **Key deps**: `@heroicons/react`, `react-icons`, `d3-geo`, `d3-geo-projection`, `d3-selection`, `d3-drag`, `topojson-client`, `react-router-dom`
- **Fonts**: Open Sans (loaded via Google Fonts in `index.html`)
- **Deploy**: `npm run build` → `dist/` static files → served via pm2 `serve` on port 8080

### Blog (Next.js)
- **Repo**: `github.com/bairdlangenbrunner/isthisinteresting`
- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS 3, MDX via `@next/mdx` + `next-mdx-remote`
- **`basePath`**: `/isthisinteresting` in `next.config.mjs`
- **Routes**: `/isthisinteresting` (home — latest post), `/isthisinteresting/archive`, `/isthisinteresting/about` (hidden), plus dynamic post routes via `app/(posts)/[slug]/page.mdx`
- **Posts**: MDX files in `app/(posts)/NNN-slug/page.mdx`, each exports a `postDetails` object with title, standfirst, author, publishDate, tags, published. `lib/posts.ts` discovers and validates them. Images colocated in post folders.
- **Layout**: Root `layout.tsx` with Domine (serif), Roboto Mono, Open Sans fonts. Dark stone-800 top navbar, stone-100 footer. Content constrained to `paragraph-widths` (90%/40rem).
- **Styling**: Tailwind + `globals.css` with `@layer base` overrides. Accent color: magenta.
- **Key deps**: `@mdx-js/loader`, `@mdx-js/react`, `@next/mdx`, `next-mdx-remote`, `gray-matter`, `lucide-react`, `react-tweet`, `sharp`, `clsx`
- **Deploy**: `npm run build` → `next start --port 8000` via pm2

### Current Nginx setup
Both live on the same VPS (Hostinger). Nginx proxies:
- `/` → pm2 serving Vite `dist/` on port 8080
- `/isthisinteresting/` → pm2 running `next start` on port 8000

After this migration, there will be only one pm2 process (Next.js) and Nginx proxies everything to it.

---

## Migration plan

### Phase 1: Set up the new unified project structure

Start from a clone of the `isthisinteresting` repo as the base. The new repo will be called `bairdlangenbrunner.com` (or keep `bairdlangenbrunner`).

**Remove `basePath`**: Delete `basePath: '/isthisinteresting'` from `next.config.mjs`. The blog will now live at `/blog/*` instead of `/isthisinteresting/*`.

**New file structure:**

```
app/
├── layout.tsx              ← NEW unified root layout (shared nav + footer)
├── globals.css             ← merged styles
├── page.tsx                ← NEW: the homepage (animated globe)
├── about/
│   └── page.tsx            ← migrated from Vite About.jsx
├── projects/
│   └── page.tsx            ← migrated from Vite Projects.jsx
├── blog/
│   ├── page.tsx            ← MOVED from current app/page.tsx (blog home)
│   ├── archive/
│   │   └── page.tsx        ← MOVED from current app/archive/page.tsx
│   └── (posts)/
│       ├── 001-first-post/
│       │   └── page.mdx
│       ├── 002-scrolling-up/
│       │   └── page.mdx
│       └── ... (all existing post folders)
├── components/
│   ├── navbar.tsx          ← NEW unified nav (replaces both headers)
│   ├── navlinks.tsx        ← updated
│   ├── footer.tsx          ← updated
│   ├── Homolosines.tsx     ← migrated from Vite (client component)
│   ├── postheading.tsx     ← kept as-is
│   └── triangles.tsx       ← kept as-is
lib/
├── posts.ts                ← update POSTS_DIR path to "./app/blog/(posts)"
├── formatDates.ts          ← kept as-is
├── projections.ts          ← migrated from Vite src/lib/projections.js
graphics/
├── globe-alt.svg           ← copied from Vite repo
mdx-components.tsx          ← kept as-is
types.d.ts                  ← kept as-is
```

### Phase 2: Update `next.config.mjs`

```js
import nextMDX from '@next/mdx'
import path from 'path'
import { fileURLToPath } from 'url'

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: []
  }
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath REMOVED — site now serves from root
  pageExtensions: ['ts','tsx','js','jsx','md','mdx'],
  turbopack: {
    root: __dirname
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
    ],
    unoptimized: true
  }
}

export default withMDX(nextConfig)
```

### Phase 3: Migrate the personal site pages

#### Homepage (`app/page.tsx`)
- Create as a **client component** (or a thin server wrapper around a client component) that renders the `Homolosines` component
- The Homolosines component uses d3-geo, d3-selection, d3-geo-projection, topojson-client — these are all client-side, so the component **must** have `"use client"` at the top
- Port `Homolosines.jsx` → `app/components/Homolosines.tsx`. The code is pure React + D3 with refs and useEffect — it ports directly. Just add `"use client"` and TypeScript types.
- Port `lib/projections.js` → `lib/projections.ts`
- The homepage should also set the document title to "Baird Langenbrunner" — use Next.js `metadata` export for this instead of the Vite `useEffect` pattern

#### About page (`app/about/page.tsx`)
- Port from `About.jsx`. Simple static content — make it a **server component** (no `"use client"` needed)
- Use Next.js `metadata` export for the page title
- Preserve all the links and content text exactly

#### Projects page (`app/projects/page.tsx`)
- Port from `Projects.jsx`. Simple static content — server component
- Update the blog link from `/isthisinteresting` to `/blog`
- Use Next.js `metadata` export for the page title

### Phase 4: Move blog routes under `/blog`

- Move `app/page.tsx` (current blog home) → `app/blog/page.tsx`
- Move `app/archive/` → `app/blog/archive/`
- Move `app/about/` (blog about, currently hidden) → either delete or move to `app/blog/about/`
- Move `app/(posts)/` → `app/blog/(posts)/`
- Update `lib/posts.ts`: change `POSTS_DIR` from `"./app/(posts)"` to `"./app/blog/(posts)"`
- Update all internal `<Link href=` in blog pages:
  - In `app/blog/page.tsx`: `href={/${posts[0].slug}}` → `href={/blog/${posts[0].slug}}`
  - In `app/blog/archive/page.tsx`: same pattern
  - In each MDX post's `PostHeading` import path: update `@/app/components/postheading.tsx` (this should still work since components stay at `app/components/`)
- In `mdx-components.tsx`, the internal link detection (`startsWith("/")`) will still work fine — no changes needed

### Phase 5: Create the unified navigation

Replace both the Vite Header (icon-based) and the blog NavBar (text-based) with a single unified nav. **Keep the personal site's visual style** (the icon-based header with Heroicons, lime accents, mobile hamburger) as the primary design, but now it navigates to all sections including blog.

The new navbar should be a **client component** (it needs `usePathname` and `useState` for the mobile menu).

Nav items:
- Home (`/`) — HomeIcon
- About (`/about`) — UserCircleIcon  
- Projects (`/projects`) — FolderIcon
- Blog (`/blog`) — PencilSquareIcon (this is now an internal `<Link>`, NOT an external `<a>` with `target="_blank"`)

Use `next/link` instead of React Router's `NavLink`. For active-link detection, use `usePathname()` from `next/navigation`.

### Phase 6: Merge styles

This is the trickiest part. The two apps have different styling approaches:

- **Blog**: Tailwind CSS + globals.css with `@layer base` overrides
- **Personal site**: Plain CSS with Tailwind color palette as CSS custom properties

**Strategy**: Use Tailwind as the base (it's already set up in the blog). Migrate the personal site's CSS into Tailwind utilities + a section in `globals.css`.

Specific things to preserve:
1. **The lime-700 bordered container** on the homepage/about/projects (`.app-container-div`): This is the personal site's signature look. Add these styles to `globals.css`. The blog pages should NOT have this border — they use the full-width stone-800 navbar style.
2. **The outlined display font** (`.title-home`, `.title-away`): Keep these CSS classes in `globals.css`
3. **Color scheme**: Personal site uses lime-700/lime-800 accents, blog uses magenta. Keep both — lime for nav/portfolio sections, magenta for blog text links and highlights.
4. **Typography**: Blog uses Domine (serif) for body text, Roboto Mono as base. Personal site uses Open Sans. All three fonts are already loaded in the blog's layout.tsx — keep them all. Portfolio pages should use Open Sans; blog pages use the serif/mono setup.

**Approach**: Use a **route group layout** to apply different styling contexts:

```
app/
├── layout.tsx              ← root layout: fonts, <html>, <body>, unified nav
├── (portfolio)/
│   ├── layout.tsx          ← portfolio wrapper: lime border container
│   ├── page.tsx            ← homepage
│   ├── about/page.tsx
│   └── projects/page.tsx
├── blog/
│   ├── layout.tsx          ← blog wrapper: full-width, no border
│   ├── page.tsx
│   ├── archive/page.tsx
│   └── (posts)/...
```

The `(portfolio)` route group adds the `.app-container-div` border wrapper. The `blog/layout.tsx` adds the blog-specific width constraints and typography context. The root layout handles the shared navbar and footer.

**Important**: The root layout currently has the blog's NavBar hardcoded. Replace it with the new unified nav. The `(portfolio)/layout.tsx` should add the lime-bordered container div. The `blog/layout.tsx` should keep the existing blog content wrapper (the `min-h-dvh flex flex-col` structure), but **without** its own navbar/footer (those are now in the root layout).

### Phase 7: Install new dependencies

Add to `package.json`:
```
"@heroicons/react": "^2.2.0"
"d3-geo": "^3.1.1"
"d3-geo-projection": "^4.0.0"
"d3-selection": "^3.0.0"
"d3-drag": "^3.0.0"
"topojson-client": "^3.1.0"
"react-icons": "^5.5.0"
```

Add type packages if needed:
```
"@types/d3-geo": "^3.x"
"@types/d3-selection": "^3.x"
"@types/topojson-client": "^3.x"
```

Remove `react-router-dom` — it's not needed in Next.js.

### Phase 8: Handle redirects

People may have bookmarked `/isthisinteresting` or `/isthisinteresting/archive`. Add redirects in `next.config.mjs`:

```js
async redirects() {
  return [
    {
      source: '/isthisinteresting',
      destination: '/blog',
      permanent: true,
    },
    {
      source: '/isthisinteresting/:path*',
      destination: '/blog/:path*',
      permanent: true,
    },
  ]
},
```

### Phase 9: Update deployment

After the migration, the VPS deployment simplifies:

1. One repo to clone/pull on the VPS
2. `npm install && npm run build`
3. `pm2 start npm --name "bairdlangenbrunner" -- start -- --port 8000` (single process)
4. Nginx config simplifies — everything proxies to port 8000:

```nginx
server {
    server_name bairdlangenbrunner.com www.bairdlangenbrunner.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SSL managed by Certbot
}
```

Remove the old pm2 process for the Vite site (port 8080). Remove the old `/isthisinteresting/` location block from nginx.

---

## Key decisions and constraints

1. **Blog posts keep their slug-based URLs** but under `/blog/` — e.g., `/blog/001-first-post` instead of `/isthisinteresting/001-first-post`
2. **Don't rename or restructure the MDX post files** — they work well as-is
3. **The homepage globe animation must work** — it's all client-side D3, so wrap in `"use client"`. It fetches world-atlas TopoJSON from a CDN at runtime — that's fine.
4. **Keep both visual identities** — the portfolio's lime-bordered minimalism and the blog's stone/magenta editorial style. They should feel like sections of the same site connected by a shared nav, not forced into one look.
5. **TypeScript**: The blog is already TS. Port the Vite JSX files to TSX during migration. Don't need to be exhaustive with types — `any` is fine for d3 types where needed to keep moving.
6. **The `mdx-components.tsx` file** must stay at the project root (Next.js requirement for `@next/mdx`).

## Verification checklist

After migration, verify:
- [ ] `npm run dev` starts without errors
- [ ] `/` shows the animated globe homepage
- [ ] `/about` shows the about page with correct content
- [ ] `/projects` shows the projects page with working links
- [ ] `/blog` shows the blog home with latest post
- [ ] `/blog/archive` lists all published posts
- [ ] `/blog/001-first-post` renders the MDX post correctly with images
- [ ] `/blog/002-scrolling-up` renders correctly
- [ ] Nav highlights the correct active section
- [ ] Mobile hamburger menu works
- [ ] `/isthisinteresting` redirects to `/blog`
- [ ] `npm run build` succeeds (no build errors)
