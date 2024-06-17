import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="navbar-footer-widths mx-auto flex flex-col bg-pink-200">
        <div className="mt-[100px] h-full">
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
        <div className="w-[300px] mt-[100px]">
          <div className="m-auto text-lg text-left leading-[1.25rem] font-monospace">
            this site is deeply under construction, but you can see my inaugural
            post <Link href="/first-post">here</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
