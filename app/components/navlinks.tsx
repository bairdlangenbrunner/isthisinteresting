import Link from "next/link";
import React from "react";

const links = [
  { name: "about", hidden: false, href: "/about" },
  { name: "archive", hidden: true, href: "/archive" },
];

const NavLinks = () => {
  return (
    <div className="flex justify-between text-lg sm:text-xl">
      {/* is this interesting div */}
      <div>
        <Link key="is this interesting" href="/" className="">
          <span className="text-white hover:text-[magenta]">is this interesting</span>
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
              <span className="text-white hover:text-[magenta]">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavLinks;
