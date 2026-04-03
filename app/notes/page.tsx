// import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDates";

// this is the homepage

export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <div className="div-title">
        <h1 className="title-away">notes</h1>
      </div>
      <section>
        <div className="text-sm sm:text-base mb-[1.5rem] sm:mb-[2rem]">
          <div>Most recent post up top:</div>
        </div>
            <ol>
              {posts[0] && (
                <li key={posts[0].slug} className="text-base sm:text-xl">
                  <Link href={`/notes/${posts[0].slug}`} className="font-bold">
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
      </section>
    </>
  );
}
