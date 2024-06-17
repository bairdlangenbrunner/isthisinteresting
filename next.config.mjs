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
  pageExtensions: ['ts','tsx','js','jsx','md','mdx'],
  experimental: {
  },
  images: {
    domains: ['github.com', 'lh3googleusercontent.com']
  }
}

export default withMDX(nextConfig)