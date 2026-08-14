// Kawaii decorative SVG elements for background ambiance
// These are original kawaii-inspired designs (not official Sanrio/Hello Kitty artwork)

import React, { CSSProperties } from "react";

interface SvgProps {
  className?: string;
  style?: CSSProperties;
  color?: string;
}

export function KawaiiCatFace({ className = "", style }: SvgProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Ears */}
      <polygon points="8,20 15,5 22,20" fill="#f9a8d4" opacity="0.8" />
      <polygon points="38,20 45,5 52,20" fill="#f9a8d4" opacity="0.8" />
      <polygon points="11,18 15,8 19,18" fill="#fce7f3" opacity="0.9" />
      <polygon points="41,18 45,8 49,18" fill="#fce7f3" opacity="0.9" />
      {/* Head */}
      <ellipse cx="30" cy="35" rx="22" ry="20" fill="white" opacity="0.9" />
      <ellipse cx="30" cy="35" rx="22" ry="20" fill="none" stroke="#f9a8d4" strokeWidth="1.5" />
      {/* Eyes */}
      <ellipse cx="22" cy="32" rx="3" ry="3.5" fill="#3d1a4f" opacity="0.8" />
      <ellipse cx="38" cy="32" rx="3" ry="3.5" fill="#3d1a4f" opacity="0.8" />
      <circle cx="23.2" cy="31" r="1" fill="white" />
      <circle cx="39.2" cy="31" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="30" cy="37" rx="2" ry="1.2" fill="#f9a8d4" />
      {/* Whiskers */}
      <line x1="8" y1="36" x2="22" y2="38" stroke="#d1d5db" strokeWidth="0.8" />
      <line x1="8" y1="39" x2="22" y2="39" stroke="#d1d5db" strokeWidth="0.8" />
      <line x1="38" y1="38" x2="52" y2="36" stroke="#d1d5db" strokeWidth="0.8" />
      <line x1="38" y1="39" x2="52" y2="39" stroke="#d1d5db" strokeWidth="0.8" />
      {/* Blush */}
      <ellipse cx="18" cy="40" rx="5" ry="3" fill="#fca5a5" opacity="0.4" />
      <ellipse cx="42" cy="40" rx="5" ry="3" fill="#fca5a5" opacity="0.4" />
    </svg>
  );
}

export function KawaiiCatFaceBow({ className = "", style }: SvgProps) {
  return (
    <svg
      viewBox="0 0 70 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Bow */}
      <ellipse cx="22" cy="10" rx="10" ry="6" fill="#f9a8d4" opacity="0.9" transform="rotate(-15 22 10)" />
      <ellipse cx="38" cy="8" rx="10" ry="6" fill="#f9a8d4" opacity="0.9" transform="rotate(15 38 8)" />
      <circle cx="30" cy="10" r="4" fill="#ec4899" opacity="0.9" />
      {/* Ears */}
      <polygon points="10,28 17,13 24,28" fill="#f9a8d4" opacity="0.8" />
      <polygon points="46,28 53,13 60,28" fill="#f9a8d4" opacity="0.8" />
      <polygon points="13,26 17,16 21,26" fill="#fce7f3" opacity="0.9" />
      <polygon points="49,26 53,16 57,26" fill="#fce7f3" opacity="0.9" />
      {/* Head */}
      <ellipse cx="35" cy="45" rx="24" ry="20" fill="white" opacity="0.9" />
      <ellipse cx="35" cy="45" rx="24" ry="20" fill="none" stroke="#f9a8d4" strokeWidth="1.5" />
      {/* Eyes */}
      <ellipse cx="27" cy="42" rx="3" ry="3.5" fill="#3d1a4f" opacity="0.8" />
      <ellipse cx="43" cy="42" rx="3" ry="3.5" fill="#3d1a4f" opacity="0.8" />
      <circle cx="28.2" cy="41" r="1" fill="white" />
      <circle cx="44.2" cy="41" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="35" cy="47" rx="2" ry="1.2" fill="#f9a8d4" />
      {/* Blush */}
      <ellipse cx="22" cy="50" rx="5" ry="3" fill="#fca5a5" opacity="0.4" />
      <ellipse cx="48" cy="50" rx="5" ry="3" fill="#fca5a5" opacity="0.4" />
      {/* Whiskers */}
      <line x1="10" y1="46" x2="26" y2="48" stroke="#d1d5db" strokeWidth="0.8" />
      <line x1="10" y1="49" x2="26" y2="49" stroke="#d1d5db" strokeWidth="0.8" />
      <line x1="44" y1="48" x2="60" y2="46" stroke="#d1d5db" strokeWidth="0.8" />
      <line x1="44" y1="49" x2="60" y2="49" stroke="#d1d5db" strokeWidth="0.8" />
    </svg>
  );
}

export function KawaiiHeart({ className = "", color = "#f9a8d4", style }: SvgProps) {
  return (
    <svg viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <path
        d="M12 20.5C12 20.5 2 13.5 2 7.5C2 4.46 4.46 2 7.5 2C9.24 2 10.91 2.81 12 4.08C13.09 2.81 14.76 2 16.5 2C19.54 2 22 4.46 22 7.5C22 13.5 12 20.5 12 20.5Z"
        fill={color}
        opacity="0.85"
      />
      <circle cx="8" cy="8" r="1.5" fill="white" opacity="0.5" />
    </svg>
  );
}

export function KawaiiStar({ className = "", color = "#f9a8d4", style }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <path
        d="M12 2L14.4 9.2H22L16 13.6L18.4 20.8L12 16.4L5.6 20.8L8 13.6L2 9.2H9.6L12 2Z"
        fill={color}
        opacity="0.85"
      />
    </svg>
  );
}

export function KawaiiSparkle({ className = "", style }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.636 5.636l2.829 2.829M15.536 15.536l2.828 2.828M5.636 18.364l2.829-2.828M15.536 8.464l2.828-2.828" stroke="#f9a8d4" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <circle cx="12" cy="12" r="3" fill="#f9a8d4" opacity="0.5" />
    </svg>
  );
}

export function KawaiiFlower({ className = "", color = "#f9a8d4", style }: SvgProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <ellipse
          key={i}
          cx={20 + 9 * Math.cos((deg * Math.PI) / 180)}
          cy={20 + 9 * Math.sin((deg * Math.PI) / 180)}
          rx="5"
          ry="7"
          fill={color}
          opacity="0.7"
          transform={`rotate(${deg}, ${20 + 9 * Math.cos((deg * Math.PI) / 180)}, ${20 + 9 * Math.sin((deg * Math.PI) / 180)})`}
        />
      ))}
      <circle cx="20" cy="20" r="6" fill="#fde68a" opacity="0.9" />
      <circle cx="18" cy="18" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );
}

export function KawaiiPawPrint({ className = "", style }: SvgProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <ellipse cx="20" cy="26" rx="9" ry="8" fill="#f9a8d4" opacity="0.7" />
      <ellipse cx="10" cy="16" rx="4" ry="5" fill="#f9a8d4" opacity="0.7" />
      <ellipse cx="18" cy="12" rx="3.5" ry="4.5" fill="#f9a8d4" opacity="0.7" />
      <ellipse cx="26" cy="12" rx="3.5" ry="4.5" fill="#f9a8d4" opacity="0.7" />
      <ellipse cx="30" cy="16" rx="4" ry="5" fill="#f9a8d4" opacity="0.7" />
    </svg>
  );
}

export function KawaiiCrown({ className = "", color = "#fde68a", style }: SvgProps) {
  return (
    <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <path d="M4 26L8 8L16 18L20 4L24 18L32 8L36 26H4Z" fill={color} opacity="0.8" />
      <path d="M4 26L8 8L16 18L20 4L24 18L32 8L36 26H4Z" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
      <circle cx="20" cy="4" r="2.5" fill="#ec4899" opacity="0.9" />
      <circle cx="8" cy="8" r="2" fill="#ec4899" opacity="0.9" />
      <circle cx="32" cy="8" r="2" fill="#ec4899" opacity="0.9" />
    </svg>
  );
}

export function KawaiiRibbon({ className = "", style }: SvgProps) {
  return (
    <svg viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <ellipse cx="15" cy="15" rx="13" ry="10" fill="#f9a8d4" opacity="0.85" transform="rotate(-10 15 15)" />
      <ellipse cx="35" cy="15" rx="13" ry="10" fill="#f9a8d4" opacity="0.85" transform="rotate(10 35 15)" />
      <circle cx="25" cy="15" r="6" fill="#ec4899" opacity="0.9" />
      <circle cx="22" cy="12" r="2" fill="white" opacity="0.4" />
    </svg>
  );
}

export function KawaiiBubble({ className = "", color = "#e9d5ff", style }: SvgProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill={color} opacity="0.4" />
      <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx="13" cy="13" r="4" fill="white" opacity="0.5" />
      <circle cx="24" cy="11" r="2" fill="white" opacity="0.4" />
    </svg>
  );
}

// Scattered background decoration layout component
export function BackgroundDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      {/* Top left area */}
      <KawaiiCatFace className="absolute top-20 left-4 w-12 h-12 opacity-10 animate-float" />
      <KawaiiFlower className="absolute top-36 left-16 w-8 h-8 opacity-15 animate-float-reverse" style={{ animationDelay: "0.5s" }} />
      <KawaiiStar className="absolute top-10 left-32 w-6 h-6 opacity-15 animate-sparkle" style={{ animationDelay: "0.3s" }} />

      {/* Top right area */}
      <KawaiiCatFaceBow className="absolute top-16 right-8 w-14 h-14 opacity-10 animate-float" style={{ animationDelay: "1s" }} />
      <KawaiiRibbon className="absolute top-40 right-24 w-12 h-8 opacity-[0.12] animate-float-reverse" style={{ animationDelay: "0.8s" }} />
      <KawaiiHeart className="absolute top-8 right-48 w-7 h-7 opacity-15 animate-sparkle" style={{ animationDelay: "1.2s" }} />

      {/* Middle left */}
      <KawaiiPawPrint className="absolute top-1/3 left-6 w-10 h-10 opacity-10 animate-float" style={{ animationDelay: "2s" }} />
      <KawaiiSparkle className="absolute top-1/3 left-24 w-8 h-8 opacity-[0.12] animate-sparkle" style={{ animationDelay: "0.7s" }} />
      <KawaiiBubble className="absolute top-2/5 left-2 w-16 h-16 opacity-[0.08]" style={{ animationDelay: "1.5s" }} />

      {/* Middle right */}
      <KawaiiCatFace className="absolute top-1/2 right-4 w-10 h-10 opacity-10 animate-float-reverse" style={{ animationDelay: "0.4s" }} />
      <KawaiiFlower className="absolute top-2/5 right-20 w-10 h-10 opacity-[0.12] animate-float" style={{ animationDelay: "1.8s" }} color="#e9d5ff" />
      <KawaiiHeart className="absolute top-1/2 right-36 w-6 h-6 opacity-[0.12] animate-sparkle" style={{ animationDelay: "0.9s" }} color="#dbeafe" />

      {/* Bottom area */}
      <KawaiiCrown className="absolute bottom-32 left-10 w-10 h-8 opacity-10 animate-float" style={{ animationDelay: "1.3s" }} />
      <KawaiiRibbon className="absolute bottom-48 right-10 w-12 h-8 opacity-10 animate-float-reverse" style={{ animationDelay: "0.6s" }} />
      <KawaiiStar className="absolute bottom-24 left-1/3 w-8 h-8 opacity-10 animate-sparkle" style={{ animationDelay: "2.1s" }} color="#fde68a" />
      <KawaiiPawPrint className="absolute bottom-36 right-1/3 w-8 h-8 opacity-10 animate-float" style={{ animationDelay: "1.1s" }} />

      {/* Subtle large bubbles */}
      <KawaiiBubble className="absolute top-1/4 left-1/2 w-24 h-24 opacity-[0.05] -translate-x-1/2" color="#fce7f3" />
      <KawaiiBubble className="absolute top-3/4 right-1/4 w-20 h-20 opacity-[0.05]" color="#e9d5ff" />
    </div>
  );
}
