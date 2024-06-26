"use client";
import Link from "next/link";
import React from "react";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";

const links = [
  { name: "about", hidden: true, href: "/about" },
  { name: "archive", hidden: false, href: "/archive" },
];

const NavLinks = () => {
  const pathname = usePathname();
  return (
    <div className="flex justify-between text-sm sm:text-lg">
      {/* is this interesting div */}
      <div>
        <Link key="is this interesting" href="/" className="">
          <span className="text-white hover:text-[magenta]">
            is this interesting
          </span>
        </Link>
      </div>
      {/* about, archive div */}
      <div className="space-x-3">
        {links.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={link.hidden ? "hidden" : ""}
            >
              <span
                className={clsx("text-white hover:text-[magenta]", {
                  "text-[magenta]": pathname == link.href,
                })}
              >
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavLinks;
