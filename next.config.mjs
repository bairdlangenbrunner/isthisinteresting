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
  },
  async redirects() {
    return [
      {
        source: '/isthisinteresting',
        destination: '/notes',
        permanent: true,
      },
      {
        source: '/isthisinteresting/:path*',
        destination: '/notes/:path*',
        permanent: true,
      },
    ]
  },
}

export default withMDX(nextConfig)
