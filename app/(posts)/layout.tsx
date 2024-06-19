import React from 'react'
import ArticleHeading from '../components/articleheading';
import PostContent from '../components/postcontent';
import Methodology from '../components/methodology';
import Page from './first-post/page.mdx'
import Page2 from './second-post/page.mdx'


export default function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ArticleHeading />
      {/* <PostContent /> */}
      {/* <Page /> */}
      {/* <Methodology /> */}
    </>
  )
}
