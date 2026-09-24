export type ObjectItemType =
  | "apple"
  | "orange"
  | "motorcycle"
  | "pencil"
  | "egg"
  | "cookie"
  | "book"
  | "marble"
  | "car"
  | "dot";

export interface ObjectItemProps {
  type?: ObjectItemType;
  color?: string;
  size?: number; // size in px, defaults to 32
  className?: string;
  label?: string;
}

export function detectObjectItem(text?: string): ObjectItemType {
  if (!text) return "dot";
  const lower = text.toLowerCase();
  if (lower.includes("apel")) return "apple";
  if (lower.includes("jeruk")) return "orange";
  if (lower.includes("motor")) return "motorcycle";
  if (lower.includes("mobil")) return "car";
  if (lower.includes("kue") || lower.includes("roti") || lower.includes("biskuit") || lower.includes("donat")) {
    return "cookie";
  }
  if (lower.includes("telur")) return "egg";
  if (lower.includes("pensil") || lower.includes("krayon")) return "pencil";
  if (lower.includes("buku")) return "book";
  if (lower.includes("kelereng") || lower.includes("bola")) return "marble";
  return "dot";
}

export function ObjectItem({
  type = "dot",
  color = "#d97706",
  size = 32,
  className = "",
  label,
}: ObjectItemProps) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    className: `inline-block shrink-0 select-none ${className}`,
    role: "img" as const,
    "aria-label": label || type,
  };

  switch (type) {
    case "apple":
      return (
        <svg {...commonProps} aria-label={label || "apel"}>
          {/* Stem */}
          <path
            d="M16 8 C16 4, 18 3, 20 2"
            stroke="#78350f"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Leaf */}
          <path
            d="M17 5 C21 4, 23 7, 21 9 C18 9, 17 6, 17 5 Z"
            fill="#22c55e"
          />
          {/* Apple Body */}
          <path
            d="M16 9 C12 6, 6 9, 6 16 C6 24, 12 28, 16 27 C20 28, 26 24, 26 16 C26 9, 20 6, 16 9 Z"
            fill="#ef4444"
          />
          {/* Subtle Shine */}
          <ellipse
            cx="11"
            cy="14"
            rx="2"
            ry="4"
            transform="rotate(-20 11 14)"
            fill="#fecaca"
            opacity="0.6"
          />
        </svg>
      );

    case "orange":
      return (
        <svg {...commonProps} aria-label={label || "jeruk"}>
          {/* Stem & Leaf */}
          <path
            d="M16 6 L16 3"
            stroke="#78350f"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16 4 C20 3, 22 5, 20 7 C18 7, 16 5, 16 4 Z"
            fill="#22c55e"
          />
          {/* Orange Body */}
          <circle cx="16" cy="17" r="11" fill="#f97316" />
          {/* Pores */}
          <circle cx="12" cy="14" r="0.8" fill="#c2410c" opacity="0.6" />
          <circle cx="18" cy="15" r="0.8" fill="#c2410c" opacity="0.6" />
          <circle cx="15" cy="20" r="0.8" fill="#c2410c" opacity="0.6" />
          {/* Shine */}
          <ellipse
            cx="12"
            cy="13"
            rx="2"
            ry="3.5"
            transform="rotate(-30 12 13)"
            fill="#ffedd5"
            opacity="0.7"
          />
        </svg>
      );

    case "motorcycle":
      return (
        <svg
          {...commonProps}
          viewBox="0 0 40 32"
          width={Math.round(size * 1.25)}
          aria-label={label || "motor"}
        >
          {/* Wheels */}
          <circle cx="8" cy="22" r="6" fill="#1e293b" />
          <circle cx="8" cy="22" r="3" fill="#cbd5e1" />
          <circle cx="32" cy="22" r="6" fill="#1e293b" />
          <circle cx="32" cy="22" r="3" fill="#cbd5e1" />
          {/* Frame & Engine */}
          <path
            d="M8 22 L17 19 L25 19 L32 22"
            stroke="#0284c7"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Body Cover */}
          <path d="M16 19 L21 12 L28 12 L31 20" fill="#0284c7" />
          {/* Seat */}
          <path
            d="M15 13 Q19 12 23 13"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Handlebar & Headlight */}
          <path
            d="M27 12 L29 7 L25 7"
            stroke="#475569"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="31" cy="10" r="2" fill="#facc15" />
        </svg>
      );

    case "car":
      return (
        <svg
          {...commonProps}
          viewBox="0 0 36 32"
          width={Math.round(size * 1.15)}
          aria-label={label || "mobil"}
        >
          {/* Car Body */}
          <path
            d="M4 21 L6 15 C7 12, 10 11, 12 11 L22 11 C24 11, 27 12, 28 15 L32 17 C34 18, 34 20, 34 22 L34 24 L2 24 L2 22 C2 21, 3 21, 4 21 Z"
            fill="#dc2626"
          />
          {/* Windows */}
          <path
            d="M12 13 L17 13 L17 18 L8 18 C9 15, 11 13, 12 13 Z"
            fill="#e0f2fe"
          />
          <path
            d="M19 13 L24 13 C25 13, 27 15, 27 18 L19 18 Z"
            fill="#e0f2fe"
          />
          {/* Wheels */}
          <circle cx="10" cy="24" r="4.5" fill="#1e293b" />
          <circle cx="10" cy="24" r="2" fill="#cbd5e1" />
          <circle cx="26" cy="24" r="4.5" fill="#1e293b" />
          <circle cx="26" cy="24" r="2" fill="#cbd5e1" />
        </svg>
      );

    case "cookie":
      return (
        <svg {...commonProps} aria-label={label || "kue"}>
          {/* Cookie Base */}
          <circle cx="16" cy="16" r="12" fill="#d97706" />
          <circle cx="16" cy="16" r="11" fill="#f59e0b" />
          {/* Choc Chips */}
          <circle cx="11" cy="12" r="1.8" fill="#451a03" />
          <circle cx="18" cy="10" r="1.5" fill="#451a03" />
          <circle cx="15" cy="16" r="2" fill="#451a03" />
          <circle cx="11" cy="20" r="1.6" fill="#451a03" />
          <circle cx="19" cy="19" r="1.7" fill="#451a03" />
          <circle cx="21" cy="14" r="1.4" fill="#451a03" />
        </svg>
      );

    case "egg":
      return (
        <svg {...commonProps} aria-label={label || "telur"}>
          <path
            d="M16 4 C10 11, 7 17, 7 21 C7 26, 11 29, 16 29 C21 29, 25 26, 25 21 C25 17, 22 11, 16 4 Z"
            fill="#fed7aa"
            stroke="#ea580c"
            strokeWidth="1"
          />
          {/* Egg highlight */}
          <ellipse
            cx="13"
            cy="17"
            rx="2"
            ry="4.5"
            transform="rotate(-15 13 17)"
            fill="#fff7ed"
            opacity="0.8"
          />
        </svg>
      );

    case "pencil":
      return (
        <svg {...commonProps} aria-label={label || "pensil"}>
          <g transform="rotate(45 16 16)">
            {/* Eraser */}
            <rect x="13" y="1" width="6" height="3" fill="#f43f5e" rx="1" />
            <rect x="13" y="4" width="6" height="2" fill="#cbd5e1" />
            {/* Pencil Shaft */}
            <rect x="13" y="6" width="6" height="17" fill="#eab308" />
            <line x1="15" y1="6" x2="15" y2="23" stroke="#ca8a04" strokeWidth="1" />
            {/* Sharpened Wood & Graphite */}
            <polygon points="13,23 19,23 16,29" fill="#fde047" />
            <polygon points="15,27 17,27 16,29" fill="#1e293b" />
          </g>
        </svg>
      );

    case "book":
      return (
        <svg {...commonProps} aria-label={label || "buku"}>
          {/* Pages block */}
          <rect
            x="9"
            y="7"
            width="16"
            height="18"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="1"
            rx="1.5"
          />
          {/* Cover */}
          <rect x="7" y="6" width="16" height="19" fill="#2563eb" rx="1.5" />
          {/* Spine */}
          <rect x="7" y="6" width="4" height="19" fill="#1d4ed8" rx="1" />
          {/* Title label badge */}
          <rect x="13" y="9" width="7" height="3" fill="#93c5fd" rx="0.5" />
        </svg>
      );

    case "marble":
      return (
        <svg {...commonProps} aria-label={label || "kelereng"}>
          <defs>
            <radialGradient id="marbleGradient" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="45%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="11" fill="url(#marbleGradient)" />
          {/* Swirl */}
          <path
            d="M12 9 Q17 13 14 21"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          {/* Shine */}
          <ellipse
            cx="12"
            cy="11"
            rx="2"
            ry="1.2"
            transform="rotate(-30 12 11)"
            fill="#ffffff"
            opacity="0.9"
          />
        </svg>
      );

    case "dot":
    default:
      return (
        <div
          className={`rounded-full border border-stone-300 shadow-xs flex items-center justify-center ${className}`}
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
          role="img"
          aria-label={label || "butir penghitung"}
        >
          <div
            className="rounded-full border border-white/40"
            style={{ width: Math.round(size * 0.5), height: Math.round(size * 0.5) }}
          />
        </div>
      );
  }
}
