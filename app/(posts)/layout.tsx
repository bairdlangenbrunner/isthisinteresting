import React from 'react'
import ArticleHeading from '../components/articleheading';
import PostContent from '../components/postcontent';
import Methodology from '../components/methodology';

export default function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ArticleHeading />
      <PostContent />
      <Methodology />
    </>
  )
}
