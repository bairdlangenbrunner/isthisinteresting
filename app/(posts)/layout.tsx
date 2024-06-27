import React from "react";
// import { Post } from "@/lib/posts";
import { getPosts } from "@/lib/posts";

const frontMatter = {
  title: "Baby's first post",
  standfirst:
    "I've put off teaching myself web development and getting smarter about data visualization for years, and for no good reason. I'm trying to change that now.",
  publishDate: "2024-06-12T10:00:00EDT",
  publish: true,
  author: "Baird Langenbrunner",
};

// export default async function ArticleHeading({ posts }: { posts: Post[] }) {
//   const posts = await getPosts();
//   const dateOptions = {
//     timeZone: "America/New_York",
//     // weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   };

//   return (
//     <div className="flex flex-col p-[15px] gap-[15px] my-[1.25rem] sm:my-[1.75rem] bg-[rgb(255,0,255,0.05)] rounded-lg paragraph-widths mx-auto">
//       <div className="">
//         <h1 className="font-[900] text-3xl sm:text-4xl">{frontMatter.title}</h1>
//       </div>

//       <div className="">
//         <h2 className="font-[700] sm:text-[1.125rem] text-base font-serif leading-[1.25rem] sm:leading-[1.5rem]">
//           {frontMatter.standfirst}
//         </h2>
//       </div>

//       <div className="flex justify-between">
//         <div className="text-xs">{frontMatter.publishDate}</div>
//         <div className="text-xs">by {frontMatter.author}</div>
//       </div>
//     </div>
//   );
// }

export default async function PostsLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  
  const posts = await getPosts();
  console.log(posts)
  // console.log(children)
  const dateOptions = {
    timeZone: "America/New_York",
    // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <>
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

      {children}
      {/* <Page /> */}
      {/* <Methodology /> */}
    </>
  );
}
