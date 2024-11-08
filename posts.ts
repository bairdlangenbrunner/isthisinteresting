// created from https://github.com/alexchantastic/next-mdx-blog-example/blob/main/src/posts.ts

import { readdir } from "fs/promises";

// export interface Post {
//   slug: string;
//   title: string;
//   standfirst: string;
//   author: string;
//   publishDate: string;
//   publish: boolean;
// }

import { PostMetadata } from "./types";

export async function getPosts(): Promise<PostMetadata[]> {
  // retreive slugs from post routes
  const slugs = (
    await readdir("./app/(posts)", { withFileTypes: true })
  ).filter((dirent) => dirent.isDirectory());

  // retrieve metadata from posts
  const posts = await Promise.all(
    slugs.map(async ({ name }) => {
      const { metadata } = await import(`./app/(posts)/${name}/page.mdx`);
      // console.log(metadata);
      console.log({ slug: name, ...metadata })
      return { slug: name, ...metadata };
    })
  );

  // sort posts from newest to oldest
  posts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));
  // console.log(posts)
  console.log(typeof(posts))
  return posts;
}
