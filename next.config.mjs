// const withMDX = require('@next/mdx')()
 
// // /* @type {import('next').NextConfig} */
// const nextConfig = {
//   // Configure `pageExtensions` to include MDX files
//   pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
//   // Optionally, add any other Next.js config below
// }
 
// module.exports = withMDX(nextConfig)

import nextMDX from '@next/mdx'

const withMDX = nextMDX({
  estension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: []
  }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,
 
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,
 
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
  
  pageExtensions: ['ts','tsx','js','jsx','md','mdx'],
  experimental: {
  },
  images: {
    domains: ['github.com', 'lh3googleusercontent.com'],
    unoptimized: true
  }
}

export default withMDX(nextConfig)