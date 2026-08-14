import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <span className="font-script text-4xl text-pink-500 block mb-2">
              Dayzi
            </span>
            <p className="text-sm text-neutral-500">
              Your little corner for beauty finds ✨
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3">
            {[
              { href: "/", label: "Home" },
              { href: "/body-care", label: "Body Care" },
              { href: "/skincare", label: "Skincare" },
              { href: "/hair-care", label: "Hair Care" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-neutral-500 hover:text-pink-500 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Affiliate disclosure */}
        <div className="mt-8 pt-6 border-t border-pink-50 text-center">
          <p className="text-xs text-neutral-400 leading-relaxed">
            As an Amazon Associate, I earn from qualifying purchases. Product
            prices and availability are accurate as of the date/time indicated
            and are subject to change.
          </p>
          <p className="text-xs text-neutral-300 mt-2">
            © {new Date().getFullYear()} Dayzi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
