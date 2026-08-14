"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SearchModal from "@/components/SearchModal";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/body-care", label: "🛁 Body Care" },
    { href: "/skincare", label: "✨ Skincare" },
    { href: "/hair-care", label: "💇 Hair Care" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-script text-3xl text-pink-500 leading-none hover:text-pink-600 transition-colors"
            aria-label="Dayzi Home"
          >
            Dayzi
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-pink-500 ${
                  pathname === l.href ? "text-pink-500" : "text-neutral-600"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              id="navbar-search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="p-2 rounded-full text-pink-500 hover:bg-pink-50 transition-colors btn-tap"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Mobile menu toggle */}
            <button
              id="navbar-menu-btn"
              className="md:hidden p-2 rounded-full text-pink-500 hover:bg-pink-50 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-pink-100 px-4 py-3 flex flex-col gap-1 animate-fadeInUp">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? "bg-pink-50 text-pink-600"
                    : "text-neutral-700 hover:bg-pink-50 hover:text-pink-500"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
