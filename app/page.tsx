// import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/formatDates";
import './page.css'

// this is the homepage

export default async function Home() {
  const posts = await getPosts();

  return (
    // h-full must be passed to main and to div
    <main style={{ height: "100vh" }}>
      <div className="blog-home-div">
        <div className="blog-title-div">
          <h1 className="blog-title-h1">
            <span className="stone700">is this</span>
            <br />
            <span className="stone600">interesting</span>
            <br />
            <span className="stone500">though</span>
            <br />
            <span className="stone400">seriously</span>
          </h1>
        </div>
        <div className="latest-post-div">
          {/* <div className="text-lg text-left leading-[1.25rem] font-monospace w-[300px]"> */}
          {/* this site is deeply under construction, but you can see my inaugural */}
          {/* post <Link href="/first-post">here</Link> */}
          {/* </div> */}
          <div>
            <div className="latest-post-text">latest post:</div>
            <ol>
              {posts[0] && (
                <li key={posts[0].slug} className='latest-post-text-link'>
                  <Link
                    href={`/${posts[0].slug}`}
                    
                  >
                    {posts[0].title}
                  </Link>
                  <div className="latest-post-text-date">
                    {formatDate(posts[0].publishDate)}
                  </div>
                  <div className="latest-post-text-author">
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
