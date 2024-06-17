import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-screen bg-stone-100 py-[15px]">
      <div className="navbar-footer-widths mx-auto text-right text-xs sm:text-sm navbar-footer-links">
        this site is maintained on github{" "}
        <Link
          href="https://github.com/bairdlangenbrunner/isthisinteresting"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </Link>
      </div>
    </div>
  );
};

export default Footer;
