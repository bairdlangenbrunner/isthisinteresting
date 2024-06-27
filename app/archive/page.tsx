import React from "react";
import { getPosts } from "@/lib/posts";
import Link from "next/link";

export default async function Archive() {
  const posts = await getPosts();
  const dateOptions = {
    timeZone: "America/New_York",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

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
                  {new Date(publishDate).toLocaleDateString(
                    "en-US",
                    dateOptions
                  )}
                </div>
                {/* <div className="font-serif">{standfirst}</div> */}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
