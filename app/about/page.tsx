import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Baird Langenbrunner",
};

export default function About() {
  return (
    <>
      <div className="div-title">
        <h1 className="title-away">about</h1>
      </div>

      <section>
        <p>Hi, I&apos;m Baird.</p>
        <p>
          I&apos;m a climate scientist working in energy transition research at{" "}
          <a href="https://globalenergymonitor.org/" target="_blank" rel="noopener noreferrer">
            Global Energy Monitor
            <span className="sr-only">(opens in new tab)</span>
          </a>
          , where I&apos;ve managed{" "}
          <a
            href="https://globalenergymonitor.org/projects/global-oil-infrastructure-tracker/"
            target="_blank"
            rel="noopener noreferrer"
          >
            oil
            <span className="sr-only">(opens in new tab)</span>
          </a>{" "}
          and{" "}
          <a
            href="https://globalenergymonitor.org/projects/global-gas-infrastructure-tracker/"
            target="_blank"
            rel="noopener noreferrer"
          >
            gas
            <span className="sr-only">(opens in new tab)</span>
          </a>{" "}
          infrastructure databases since I joined in 2021.
        </p>
        <p>
          I believe very strongly in open-source data and software, especially
          when they&apos;re leveraged to do cool climate work. I&apos;m interested in maps
          and design, data visualization, making stuff with my hands and
          computer, and science communication.
        </p>
        <p>I&apos;m based in NYC.</p>
      </section>
    </>
  );
}
