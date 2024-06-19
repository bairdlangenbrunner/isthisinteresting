import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
            this site is deeply under construction, but you can see my inaugural
            post <Link href="/first-post">here</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
