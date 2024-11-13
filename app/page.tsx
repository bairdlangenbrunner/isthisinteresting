// import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDates";

export default async function Home() {
  const posts = await getPosts();

  return (
    // h-full must be passed to main and to div
    <main className="h-full">
      <div className="flex flex-col navbar-footer-widths mx-auto h-full">
        <div className="flex flex-col flex-grow justify-center">
          <h1 className="sm:text-5xl text-4xl text-right font-[900]">
            <span className="text-stone-700">is this</span>
            <br />
            <span className="text-stone-600">interesting</span>
            <br />
            <span className="text-stone-500">though</span>
            <br />
            <span className="text-stone-400">seriously</span>
          </h1>
        </div>
        <div className="flex flex-col flex-1 justify-start">
          {/* <div className="text-lg text-left leading-[1.25rem] font-monospace w-[300px]"> */}
          {/* this site is deeply under construction, but you can see my inaugural */}
          {/* post <Link href="/first-post">here</Link> */}
          {/* </div> */}
          <div>
            <div className="text-sm sm:text-base text-stone-400 mb-[1rem]">
              latest post:
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
