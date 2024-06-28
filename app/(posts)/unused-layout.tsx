import React from "react";
import { PostMetadata } from "@/types";
import { formatDate } from "@/lib/formatDate";
import { MDXRemote } from "next-mdx-remote";

const PostPage = ({
  post,
  children,
}: {
  post: PostMetadata;
  children: React.ReactNode;
}) => {
  // let router = useRouter();
  // let {previousPathname} = useContext(AppContext);
  return (
    <>
      <div className="flex flex-col p-[15px] gap-[15px] my-[1.25rem] sm:my-[1.75rem] bg-[rgb(255,0,255,0.05)] rounded-lg paragraph-widths mx-auto">
        <div>
          <h1 className="font-[900] text-3xl sm:text-4xl">{post.title}</h1>
        </div>
        <div>
          <h2 className="font-[700] sm:text-[1.125rem] text-base font-serif leading-[1.25rem] sm:leading-[1.5rem]">
            {post.standfirst}
          </h2>
        </div>
        <div className="flex justify-between">
          <div className="text-xs">{formatDate(post.publishDate)}</div>
          <div className="text-xs">by {post.author}</div>
        </div>
      </div>

      {/* <MDXRemote {...mdxSource} /> */}
      {children}
    </>
  );
};

export default PostPage;
