// import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDates";

// this is the homepage

export default async function Home() {
  const posts = await getPosts();

  return (
    // h-full must be passed to main and to div
    <main className="h-full">
      <div className="flex flex-col justify-center navbar-footer-widths mx-auto h-full">
        <div className="flex flex-col gap-[2rem]">
          <div>
            <div className="text-sm sm:text-base mb-[1.5rem] sm:mb-[2rem] mt-[1.5rem] sm:mt-[3rem]">
              <div>welcome to my personal and very inconsistently updated blog :)</div>
              <div className="mt-[1.5rem] sm:mt-[3rem]">most recent post here:</div>
            </div>
            <ol>
              {posts[0] && (
                <li key={posts[0].slug} className="text-base sm:text-xl">
                  <Link href={`/${posts[0].slug}`} className="font-bold">
                    {posts[0].title}
                  </Link>
                  <div className="text-sm sm:text-base">
                    {formatDate(posts[0].publishDate)}
                  </div>
                  <div className="text-sm sm:text-base text-stone-400">
                    by {posts[0].author}
                  </div>
                </li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
