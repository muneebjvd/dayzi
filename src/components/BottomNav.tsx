"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/body-care",
    label: "Body",
    icon: <span className="text-lg leading-none">🛁</span>,
  },
  {
    href: "/skincare",
    label: "Skin",
    icon: <span className="text-lg leading-none">✨</span>,
  },
  {
    href: "/hair-care",
    label: "Hair",
    icon: <span className="text-lg leading-none">💇</span>,
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Bottom navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-[0_-4px_20px_rgba(236,72,153,0.1)] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-stretch h-16">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                active ? "text-pink-500" : "text-neutral-400 hover:text-pink-400"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-2xl transition-all ${
                  active ? "bg-pink-100 scale-110" : ""
                }`}
              >
                {item.icon}
              </span>
              <span className={active ? "text-pink-500 font-semibold" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area */}
      <div className="h-safe-area-inset-bottom bg-white/95" />
    </nav>
  );
}
