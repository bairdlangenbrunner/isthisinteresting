import { getPosts } from "@/posts";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/formatDates";

export default function Home() {

  const posts = getPosts()
  console.log(posts)

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
          <div className="text-lg text-left leading-[1.25rem] font-monospace w-[300px]">
            {/* this site is deeply under construction, but you can see my inaugural
            post <Link href="/first-post">here</Link> */}
            <div>
              <ol>
                {posts.map(
                  ({ slug, title, publishDate, author, standfirst }) => (
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
                  )
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
