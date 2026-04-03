# bairdlangenbrunner.com

Personal website and notes for Baird Langenbrunner, built with Next.js.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 3 + custom CSS
- **Content**: MDX via `@next/mdx`
- **Homepage**: Animated Interrupted Goode Homolosine projection using D3
- **Icons**: Heroicons

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage with animated globe |
| `/about` | About page |
| `/projects` | Projects and links |
| `/notes` | Notes home (latest post) |
| `/notes/archive` | All published notes |
| `/notes/{slug}` | Individual note/post |

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
npm start -- --port 8000
```

Runs as a single pm2 process on the VPS with Nginx proxying all traffic to port 8000.

## Notes (posts)

Notes are MDX files in `app/notes/(posts)/NNN-slug/page.mdx`. Each exports a `postDetails` object:

```js
export const postDetails = {
  title: "Post title",
  standfirst: "Short description",
  author: "Baird Langenbrunner",
  publishDate: "2024-06-12",
  tags: ["tag1", "tag2"],
  published: true,
};
```

Set `published: false` to hide a note from the site.
