import React from 'react'
// import ArticleHeading from '../components/articleheading';
// import PostContent from '../app/components/postcontent';
// import Methodology from '../app/components/methodology';
import Page from './first-post/page.mdx'

const frontMatter = {
  title: "Baby's first post",
  standfirst:
    "I've put off teaching myself web development and getting smarter about data visualization for years, and for no good reason. I'm trying to change that now.",
  publishDate: "2024-06-12T10:00:00EDT",
  publish: true,
  author: "Baird Langenbrunner",
};

const ArticleHeading = () => {
  return (
    <div className="flex flex-col p-[15px] gap-[15px] my-[1.25rem] sm:my-[1.75rem] bg-[rgb(255,0,255,0.05)] rounded-lg paragraph-widths mx-auto">
      <div className="">
        <h1 className="font-[900] text-3xl sm:text-4xl">
          {frontMatter.title}
        </h1>
      </div>

      <div className="">
        <h2 className="font-[700] sm:text-[1.125rem] text-base font-serif leading-[1.25rem] sm:leading-[1.5rem]">
          {frontMatter.standfirst}
        </h2>
      </div>

      <div className="flex justify-between">
        <div className="text-xs">{frontMatter.publishDate}</div>
        <div className="text-xs">by {frontMatter.author}</div>
      </div>
    </div>
  );
};

export default function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ArticleHeading />
      {children}
      {/* <Page /> */}
      {/* <Methodology /> */}
    </>
  )
}

