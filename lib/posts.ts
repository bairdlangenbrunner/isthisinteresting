import { access, readdir } from "fs/promises";
import path from "path";
import { PostMetadata } from "@/types";

type PostModule = {
  postDetails: Record<string, unknown>;
};

const POSTS_DIR = "./app/notes/(posts)";
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidPublishDate(value: string) {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime());
}

function readStringField(
  metadata: Record<string, unknown>,
  field: "title" | "standfirst" | "author" | "publishDate",
  sourcePath: string
) {
  const value = metadata[field];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${sourcePath}: "${field}" must be a non-empty string.`);
  }

  return value;
}

function validatePostDetails(
  postDetails: Record<string, unknown>,
  slug: string,
  sourcePath: string
): PostMetadata {
  const title = readStringField(postDetails, "title", sourcePath);
  const standfirst = readStringField(postDetails, "standfirst", sourcePath);
  const author = readStringField(postDetails, "author", sourcePath);
  const publishDate = readStringField(postDetails, "publishDate", sourcePath);

  if (!isValidPublishDate(publishDate)) {
    throw new Error(
      `${sourcePath}: "publishDate" must use YYYY-MM-DD and be a valid date.`
    );
  }

  if (!Array.isArray(postDetails.tags) || !postDetails.tags.every((tag) => typeof tag === "string")) {
    throw new Error(`${sourcePath}: "tags" must be an array of strings.`);
  }

  if (typeof postDetails.published !== "boolean") {
    throw new Error(`${sourcePath}: "published" must be a boolean.`);
  }

  return {
    slug,
    title,
    standfirst,
    author,
    publishDate,
    tags: postDetails.tags,
    published: postDetails.published,
  };
}

async function getPostSlugs() {
  const dirents = await readdir(POSTS_DIR, { withFileTypes: true });

  const slugs = await Promise.all(
    dirents
      .filter((dirent) => dirent.isDirectory())
      .map(async ({ name }) => {
        const mdxPath = path.join(POSTS_DIR, name, "page.mdx");

        try {
          await access(mdxPath);
          return name;
        } catch {
          return null;
        }
      })
  );

  return slugs.filter((slug): slug is string => slug !== null);
}

export async function getPosts(): Promise<PostMetadata[]> {
  const slugs = await getPostSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const sourcePath = path.join(POSTS_DIR, slug, "page.mdx");
      const postModule = (await import(`@/app/notes/(posts)/${slug}/page.mdx`)) as PostModule;

      if (!("postDetails" in postModule) || typeof postModule.postDetails !== "object" || postModule.postDetails === null) {
        throw new Error(`${sourcePath}: missing exported "postDetails" object.`);
      }

      return validatePostDetails(postModule.postDetails, slug, sourcePath);
    })
  );

  const publishedPosts = posts.filter((post) => post.published);
  publishedPosts.sort((a, b) => +new Date(`${b.publishDate}T00:00:00Z`) - +new Date(`${a.publishDate}T00:00:00Z`));

  return publishedPosts;
}
