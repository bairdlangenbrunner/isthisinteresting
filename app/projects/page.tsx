import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects — Baird Langenbrunner",
};

export default function Projects() {
  return (
    <>
      <div className="div-title">
        <h1 className="title-away">projects</h1>
      </div>
      <section>
        <ul>
          <li>
            You can find work-related stuff, and some personal projects, on my{" "}
            <a href="https://github.com/bairdlangenbrunner" target="_blank" rel="noopener noreferrer">
              GitHub
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </li>
          <li>
            My academic work is on my{" "}
            <a
              href="https://scholar.google.com/citations?user=QWDQ5fIAAAAJ"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Scholar
              <span className="sr-only">(opens in new tab)</span>
            </a>{" "}
            page
          </li>

          <li>
            I&apos;m also tinkering with an inconsistently updated{" "}
            <Link href="/notes">
              notes
            </Link>{" "}
            section lately
          </li>
        </ul>

        <br />
        <span style={{ fontWeight: 700 }}>Other things:</span>
        <ul>
          <li>
            <a href="https://tictacbutthole.bairdlangenbrunner.com" target="_blank" rel="noopener noreferrer">
              ttb
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </li>
          <li>
            <a href="https://word.bairdlangenbrunner.com" target="_blank" rel="noopener noreferrer">
              word
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </li>
          <li>
            <a href="https://scroll-up.bairdlangenbrunner.com" target="_blank" rel="noopener noreferrer">
              scroll up
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </li>
          <li>
            <a href="https://projection-explorer.bairdlangenbrunner.com/" target="_blank" rel="noopener noreferrer">
              projection explorer
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}
