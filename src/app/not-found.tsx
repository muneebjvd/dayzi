import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="text-8xl mb-6">🌸</div>
      <h1 className="text-3xl font-bold text-neutral-800 mb-2">
        Oops! Page not found
      </h1>
      <p className="text-neutral-500 mb-8 max-w-sm">
        Looks like this beauty product wandered off. Let&apos;s get you back to
        the good stuff!
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all btn-tap"
        >
          🏠 Go Home
        </Link>
        <Link
          href="/body-care"
          className="px-6 py-3 rounded-2xl bg-pink-50 text-pink-600 font-semibold text-sm border border-pink-200 hover:bg-pink-100 transition-all btn-tap"
        >
          🛁 Body Care
        </Link>
        <Link
          href="/skincare"
          className="px-6 py-3 rounded-2xl bg-violet-50 text-violet-600 font-semibold text-sm border border-violet-200 hover:bg-violet-100 transition-all btn-tap"
        >
          ✨ Skincare
        </Link>
      </div>
    </div>
  );
}
