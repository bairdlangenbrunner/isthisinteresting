import React from "react";
import NavLinks from "./navlinks";

const NavBar = () => {
  return (
    <nav className="w-full z-10 py-[15px] px-[15px]">
      <div className="navbar-footer-widths mx-auto">
        <NavLinks />
      </div>
    </nav>
  );
};

export default NavBar;
