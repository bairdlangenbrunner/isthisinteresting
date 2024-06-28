import { readdir } from "fs/promises";
import { PostMetadata } from "@/types";

export async function getPosts(): Promise<PostMetadata[]> {
  // get all the slugs from the (posts) folder
  // slug is the folder name containing the page.mdx file
  const slugs = (
    await readdir("./app/(posts)", { withFileTypes: true })
  ).filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('_'));

  // retrieve post metadata fom mdx files
  let posts = await Promise.all(
    slugs.map(async ({ name }) => {
      const { postDetails } = await import(`@/app/(posts)/${name}/page.mdx`);
      return { slug: name, ...postDetails };
    })
  );
  // console.log(posts);

  // sort object of posts from newest up top down to oldest
  posts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));
  // only keep the ones that will be published
  posts.filter(post => post.publish===true)
  return posts;
}