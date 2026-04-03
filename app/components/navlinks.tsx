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
    <div className="flex justify-between text-sm md:text-lg">
      {/* is this interesting div */}
      <div>
        <Link key="is this interesting" href="/" className="no-underline">
          <span className="text-[var(--warm-gray-950)] hover:text-lime-600">
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
              className={clsx("no-underline", { hidden: link.hidden })}
            >
              <span
                className={clsx("text-[var(--warm-gray-950)] hover:text-lime-600", {
                  "!text-lime-700": pathname == link.href,
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
