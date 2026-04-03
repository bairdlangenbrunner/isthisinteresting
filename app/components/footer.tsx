import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto w-full">
      <div className="text-right text-xs py-[15px] px-[15px]">
        this site is maintained on github{" "}
        <Link
          href="https://github.com/bairdlangenbrunner/isthisinteresting"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
