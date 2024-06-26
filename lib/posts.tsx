import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "./app/(posts)");
// const postsDirectory = "(posts)"

export function getSortedPostsData() {
  // get filenames under (posts) directory
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // remove .mdx from file name to get id
    const id = fileName.replace(/\.mdx$/, "");

    // read mdx file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // use graymatter to parse post metadata section
    const matterResult = matter(fileContents);

    const blogPost: BlogPost = {
      id,
      title: matterResult.data.title,
      standfirst: matterResult.data.standFirst,
      publishDate: matterResult.data.publishDate,
      publish: matterResult.data.publish,
    };

    return blogPost;
  });

  // sort posts by date
  return allPostsData.sort((a, b) => (a.publishDate < b.publishDate ? -1 : 1));
}