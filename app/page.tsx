// import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDates";

export default async function Home() {
  const posts = await getPosts();
  // const firstPost = array(posts[0]);

  return (
    // h-full must be passed to main and to div
    <main className="h-full">
      <div className="flex flex-col navbar-footer-widths mx-auto h-full">
        <div className="flex flex-col flex-grow justify-center">
          <h1 className="sm:text-6xl text-5xl text-right font-[900] font-monospace">
            is this
            <br />
            interesting
            <br />
            though
            <br />
            seriously
          </h1>
        </div>
        <div className="flex flex-col flex-1 justify-start">
          {/* <div className="text-lg text-left leading-[1.25rem] font-monospace w-[300px]"> */}
          {/* this site is deeply under construction, but you can see my inaugural */}
          {/* post <Link href="/first-post">here</Link> */}
          {/* </div> */}
          <div>
            <div className="text-base sm:text-xl font-monospace text-stone-500">
              latest post:
            </div>
            <ol>
              {posts[0] && (
                <li
                  key={posts[0].slug}
                  className="my-[15px] sm:my-[30px] text-base sm:text-xl"
                >
                  <Link href={`/${posts[0].slug}`} className="font-bold">
                    {posts[0].title}
                  </Link>
                  <div className="text-sm sm:text-base">
                    {formatDate(posts[0].publishDate)}
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
