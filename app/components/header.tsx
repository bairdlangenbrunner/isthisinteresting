"use client";

import {
  HomeIcon,
  UserCircleIcon,
  FolderIcon,
  PencilSquareIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "home", href: "/", icon: HomeIcon, exact: true },
  { name: "about", href: "/about", icon: UserCircleIcon },
  { name: "projects", href: "/projects", icon: FolderIcon },
  { name: "notes", href: "/notes", icon: PencilSquareIcon },
];

export default function Header({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        hamburgerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const firstLink = menuPanelRef.current?.querySelector("a");
    firstLink?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <>
      <nav className="header-div" aria-label="Main navigation">
        {/* Desktop icons */}
        <ul className="header-content header-desktop">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={isActive(item.href, item.exact) ? "active-link" : ""}
                data-tooltip={item.name}
                aria-label={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              >
                <item.icon className="header-icons" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger button */}
        <button
          ref={hamburgerRef}
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <XMarkIcon className="header-icons" aria-hidden="true" />
          ) : (
            <Bars3Icon className="header-icons" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="menu-panel" ref={menuPanelRef} role="menu">
          <ul className="menu-links">
            {navItems.map((item) => (
              <li key={item.name} role="none">
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  role="menuitem"
                  className={isActive(item.href, item.exact) ? "active" : ""}
                >
                  <item.icon className="header-icons" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
