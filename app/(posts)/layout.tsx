import React from "react";
import { PostMetadata } from "@/types";
import { formatDate } from "@/lib/formatDates";
import { MDXRemote } from "next-mdx-remote";

interface PostPageProps {
  post: PostMetadata;
  children: React.ReactNode;
}

const PostPage: React.FC<PostPageProps> = ({ post, children }) => {
  return (
    <>
      <div className="image-widths mx-auto">{children}</div>
    </>
  );
}

export default PostPage;