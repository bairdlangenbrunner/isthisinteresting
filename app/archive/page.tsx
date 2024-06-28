import React from "react";
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDates";

export default async function ArchivePage() {

  const posts = await getPosts();
  // console.log(posts)

  return (
    <>
      <div className="paragraph-widths mx-auto">
        <div className="my-[2em] sm:my-[3em]">
          <h1 className="text-7xl">archive</h1>
          <div>most recent up top</div>
        </div>

        {/* <PostsList posts={posts}  /> */}
        <div>
          <ol>
            {posts.map(({ slug, title, publishDate, author, standfirst }) => (
              <li
                key={slug}
                className="my-[15px] sm:my-[30px] text-base sm:text-xl"
              >
                <Link href={`/${slug}`} className="font-bold">
                  {title}
                </Link>
                <div className="text-sm sm:text-base">
                  {formatDate(publishDate)}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
