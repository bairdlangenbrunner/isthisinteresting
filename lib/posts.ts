// created from https://github.com/alexchantastic/next-mdx-blog-example/blob/main/src/posts.ts

import { readdir } from "fs/promises";
import matter from "gray-matter";
import fs from 'fs'

// PostMetadata is defined in @/types.d.ts

export async function getPosts(): Promise<PostMetadata[]> {
  // retrieve slugs from post routes
  const slugs = (
    await readdir("./app/(posts)", { withFileTypes: true })
  ).filter((dirent) => dirent.isDirectory());

  // retrieve metadata from posts
  const posts = await Promise.all(
    slugs.map(async ({ name }) => {
      // const { metadata } = await import(`@/app/(posts)/${name}/page.mdx`);
      // trying to use gray matter instead
      // const fileContents = fs.readFileSync(`@/app/(posts)/${name}/page.mdx`, 'utf8')
      const fileContents = fs.readFileSync(`/Users/baird/Dropbox/_git_ALL/_github-repos-personal/isthisinteresting-nextjs/app/(posts)/${name}/page.mdx`, 'utf8')
      const matterResult = matter(fileContents)
      // add a random ID to each post so it can be referenced later
      matterResult.data.id = crypto.randomUUID()
      // console.log({ slug: name, ...matterResult.data, content: matterResult.content})
      console.log(matterResult.data)
      return { slug: name, ...matterResult.data, content: matterResult.content};
    })
  );

  // sort posts from newest to oldest
  posts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));
  // console.log(posts)
  return posts;
}

// export async function getPostById(id: string): Promise<PostMetadata[]> {

// }
