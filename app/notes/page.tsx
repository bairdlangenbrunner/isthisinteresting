// import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { formatDateISO } from "@/lib/formatDates";

// this is the homepage

export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <div className="div-title">
        <h1 className="title-away">notes</h1>
      </div>
      <section>
            <ul>
              {posts.map(({ slug, title, publishDate }) => (
                <li key={slug}>
                  <Link href={`/notes/${slug}`}>
                    {title}
                  </Link>
                  {" – "}
                  {formatDateISO(publishDate)}
                </li>
              ))}
            </ul>
      </section>
    </>
  );
}
