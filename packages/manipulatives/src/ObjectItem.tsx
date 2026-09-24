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

export interface MarblePalette {
  id: string;
  light: string;
  mid: string;
  dark: string;
  specular: string;
}

export function getMarblePalette(color?: string): MarblePalette {
  if (!color) {
    return {
      id: "blue",
      light: "#bfdbfe",
      mid: "#2563eb",
      dark: "#1e3a8a",
      specular: "#ffffff",
    };
  }

  const c = color.toLowerCase().trim();

  // Red palette
  if (
    c.includes("red") ||
    c.includes("merah") ||
    c === "#dc2626" ||
    c === "#ef4444" ||
    c === "#b91c1c" ||
    c === "#991b1b"
  ) {
    return {
      id: "red",
      light: "#fecaca",
      mid: "#dc2626",
      dark: "#991b1b",
      specular: "#ffffff",
    };
  }

  // Green palette
  if (
    c.includes("green") ||
    c.includes("hijau") ||
    c === "#16a34a" ||
    c === "#059669" ||
    c === "#10b981" ||
    c === "#15803d" ||
    c === "#047857"
  ) {
    return {
      id: "green",
      light: "#bbf7d0",
      mid: "#16a34a",
      dark: "#14532d",
      specular: "#ffffff",
    };
  }

  // Amber / Yellow palette
  if (
    c.includes("amber") ||
    c.includes("kuning") ||
    c.includes("yellow") ||
    c === "#d97706" ||
    c === "#f59e0b" ||
    c === "#eab308" ||
    c === "#b45309"
  ) {
    return {
      id: "amber",
      light: "#fef08a",
      mid: "#d97706",
      dark: "#78350f",
      specular: "#ffffff",
    };
  }

  // Purple palette
  if (
    c.includes("purple") ||
    c.includes("ungu") ||
    c === "#9333ea" ||
    c === "#a855f7" ||
    c === "#7e22ce" ||
    c === "#581c87"
  ) {
    return {
      id: "purple",
      light: "#e9d5ff",
      mid: "#9333ea",
      dark: "#581c87",
      specular: "#ffffff",
    };
  }

  // Orange palette
  if (
    c.includes("orange") ||
    c.includes("oranye") ||
    c.includes("jingga") ||
    c === "#ea580c" ||
    c === "#f97316" ||
    c === "#c2410c"
  ) {
    return {
      id: "orange",
      light: "#fed7aa",
      mid: "#ea580c",
      dark: "#7c2d12",
      specular: "#ffffff",
    };
  }

  // Blue palette
  if (
    c.includes("blue") ||
    c.includes("biru") ||
    c === "#2563eb" ||
    c === "#3b82f6" ||
    c === "#1d4ed8" ||
    c === "#1e3a8a" ||
    c === "#0284c7"
  ) {
    return {
      id: "blue",
      light: "#bfdbfe",
      mid: "#2563eb",
      dark: "#1e3a8a",
      specular: "#ffffff",
    };
  }

  const safeId = c.replace(/[^a-z0-9]/g, "");
  return {
    id: safeId || "custom",
    light: "#ffffff",
    mid: color,
    dark: "#1e293b",
    specular: "#ffffff",
  };
}

export function detectStoryColors(text?: string): {
  firstColor?: string;
  secondColor?: string;
  firstColorName?: string;
  secondColorName?: string;
} {
  if (!text) return {};
  const lower = text.toLowerCase();

  const colorMap: Record<string, { hex: string; name: string }> = {
    biru: { hex: "#2563eb", name: "biru" },
    merah: { hex: "#dc2626", name: "merah" },
    hijau: { hex: "#16a34a", name: "hijau" },
    kuning: { hex: "#eab308", name: "kuning" },
    oranye: { hex: "#ea580c", name: "oranye" },
    jingga: { hex: "#ea580c", name: "jingga" },
    ungu: { hex: "#9333ea", name: "ungu" },
    cokelat: { hex: "#78350f", name: "cokelat" },
    coklat: { hex: "#78350f", name: "cokelat" },
    putih: { hex: "#f8fafc", name: "putih" },
    hitam: { hex: "#1e293b", name: "hitam" },
  };

  const splitWords = [" dan ", " lalu ", " kemudian "];
  for (const splitter of splitWords) {
    if (lower.includes(splitter)) {
      const parts = lower.split(splitter);
      const part1 = parts[0] ?? "";
      const part2 = parts.slice(1).join(" ");

      let firstColor: string | undefined;
      let firstColorName: string | undefined;
      let secondColor: string | undefined;
      let secondColorName: string | undefined;

      for (const [name, val] of Object.entries(colorMap)) {
        if (part1.includes(name) && !firstColor) {
          firstColor = val.hex;
          firstColorName = val.name;
        }
        if (part2.includes(name) && !secondColor) {
          secondColor = val.hex;
          secondColorName = val.name;
        }
      }

      if (firstColor || secondColor) {
        return { firstColor, secondColor, firstColorName, secondColorName };
      }
    }
  }

  for (const [name, val] of Object.entries(colorMap)) {
    if (lower.includes(name)) {
      return { firstColor: val.hex, firstColorName: val.name };
    }
  }

  return {};
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
    case "apple": {
      const isGreen = color && (color.toLowerCase().includes("green") || color.toLowerCase().includes("hijau") || color === "#22c55e" || color === "#16a34a");
      const appleFill = isGreen ? "#22c55e" : "#ef4444";
      const appleShine = isGreen ? "#bbf7d0" : "#fecaca";
      return (
        <svg {...commonProps} aria-label={label || (isGreen ? "apel hijau" : "apel merah")}>
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
            fill="#15803d"
          />
          {/* Apple Body */}
          <path
            d="M16 9 C12 6, 6 9, 6 16 C6 24, 12 28, 16 27 C20 28, 26 24, 26 16 C26 9, 20 6, 16 9 Z"
            fill={appleFill}
          />
          {/* Subtle Shine */}
          <ellipse
            cx="11"
            cy="14"
            rx="2"
            ry="4"
            transform="rotate(-20 11 14)"
            fill={appleShine}
            opacity="0.6"
          />
        </svg>
      );
    }

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

    case "marble": {
      const palette = getMarblePalette(color);
      const gradId = `marble-grad-${palette.id}`;
      return (
        <svg {...commonProps} aria-label={label || `kelereng ${palette.id}`}>
          <defs>
            <radialGradient id={gradId} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor={palette.light} />
              <stop offset="45%" stopColor={palette.mid} />
              <stop offset="100%" stopColor={palette.dark} />
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="11" fill={`url(#${gradId})`} />
          {/* Swirl */}
          <path
            d="M12 9 Q17 13 14 21"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />
          {/* Shine */}
          <ellipse
            cx="12"
            cy="11"
            rx="2.4"
            ry="1.4"
            transform="rotate(-30 12 11)"
            fill={palette.specular}
            opacity="0.9"
          />
          <circle cx="20" cy="20" r="1" fill="#ffffff" opacity="0.4" />
        </svg>
      );
    }

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
