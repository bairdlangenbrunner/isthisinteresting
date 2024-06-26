import React from "react";
import { getPosts } from "@/posts";
import Link from "next/link";

export default async function Archive() {
  
  const posts = await getPosts();

  return (
    <>
      <h1 className="text-7xl">archive</h1>
      {/* <PostsList posts={posts}  /> */}
      <ol>
        {posts.map(({ slug, title, publishDate }) => (
          <li key={slug}>
            <h2>
              <Link href={`/${slug}`}>{title}</Link>
            </h2>
            <p>
              <strong>Published:</strong>{" "}
              {new Date(publishDate).toLocaleDateString()}{" "}
            </p>
          </li>
        ))}
      </ol>
    </>
  );
}
