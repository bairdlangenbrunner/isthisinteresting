// created from https://github.com/alexchantastic/next-mdx-blog-example/blob/main/src/posts.ts

import { readdir } from "fs/promises";
import matter from "gray-matter";
import fs from "fs";
import crypto from "crypto";
import path from "path";

// PostMetadata is defined in @/types.d.ts

export async function getPosts(): Promise<PostMetadata[]> {
  const postsDir = path.join(process.cwd(), "app/(posts)");

  // retrieve slugs from post routes
  const slugs = (await readdir(postsDir, { withFileTypes: true })).filter(
    (dirent) => dirent.isDirectory()
  );

  // retrieve metadata from posts
  const posts = await Promise.all(
    slugs.map(async ({ name }) => {

      const filePath = path.join(postsDir, name, "page.mdx");
      const fileContents = fs.readFileSync(filePath, "utf8");
      const matterResult = matter(fileContents);

      const postMetadata: PostMetadata = {
        slug: name,
        id: crypto.randomUUID(),
        title: matterResult.data.title,
        publishDate: matterResult.data.publishDate,
        tags: matterResult.data.tags,
        author: matterResult.data.author,
        publish: matterResult.data.publish,
        standfirst: matterResult.data.standfirst,
        content: matterResult.content
      };
      return postMetadata;
    })
  );

  // sort posts from newest to oldest
  posts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));
  // console.log(posts);
  return posts;
}

// export async function getPostById(id: string): Promise<PostMetadata[]> {

// }
