import React from "react";
import NavLinks from "./navlinks";

const NavBar = () => {
  return (
    <nav className="w-screen bg-stone-700 text-stone-50 z-10 py-1 fixed">
      <div className="navbar-footer-widths mx-auto">
        <NavLinks />
      </div>
    </nav>
  );
};

export default NavBar;
