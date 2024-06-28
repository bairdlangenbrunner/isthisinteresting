// // app/(posts)/[slug]/page.tsx
// import { getPostBySlug } from "@/lib/posts";
// import { PostMetadata } from "@/types";
// import PostContent from "../components/postlayout";
// import { MDXRemoteSerializeResult } from "next-mdx-remote";
// import { serialize } from "next-mdx-remote/serialize";
// import { notFound } from "next/navigation";
// import React from "react";

// export default async function PostLayout({params,}: {params: { slug: string };}) {
//   if (!params.slug) {
//     throw new Error("No slug provided in params.");
//   }

//   const post = await getPostBySlug(params.slug);

//   if (!post) {
//     notFound();
//     return null;
//   }

//   const mdxSource: MDXRemoteSerializeResult = await serialize(post.content);

//   return (
//     // <PostContent postMetadata={post} mdxSource={mdxSource}>
//       // {params.slug}
//     {/* </PostContent> */}
//   );
// }