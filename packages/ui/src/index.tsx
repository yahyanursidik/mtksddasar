import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

/**
 * Design Tokens — Focused, intentional tokens for Math SD.
 * No generic AI gradients, no multi-color rainbows.
 */
export const tokens = {
  colors: {
    surface: {
      background: "#fafaf9", // Warm stone 50
      card: "#ffffff",
      muted: "#f5f5f4", // Stone 100
      accentMuted: "#fef3c7", // Amber 100
    },
    text: {
      primary: "#1c1917", // Stone 900
      secondary: "#57534e", // Stone 600
      muted: "#57534e", // Stone 600 (High contrast WCAG AA >= 4.5:1)
      accent: "#b45309", // Amber 700
      success: "#047857", // Emerald 700
    },
    border: {
      default: "#e7e5e4", // Stone 200
      accent: "#fcd34d", // Amber 300
      focus: "#f59e0b", // Amber 500
    },
  },
  radii: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  },
} as const;

export interface ButtonStyleOptions {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className = "",
}: ButtonStyleOptions = {}): string {
  const baseStyle =
    "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none active:translate-y-1 active:border-b-0 motion-reduce:transform-none motion-reduce:transition-none";

  const sizeStyles = {
    sm: "h-11 px-4 text-sm min-h-[44px] min-w-[44px]",
    md: "h-13 px-6 text-base min-h-[50px]",
    lg: "h-15 px-8 text-lg min-h-[58px] font-extrabold tracking-wide",
  };

  const variantStyles = {
    primary:
      "bg-amber-600 text-white hover:bg-amber-500 border-2 border-amber-700 border-b-4 border-b-amber-800 shadow-sm",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-500 border-2 border-emerald-700 border-b-4 border-b-emerald-800 shadow-sm",
    secondary:
      "bg-stone-100 text-stone-900 hover:bg-stone-200 border-2 border-stone-200 border-b-4 border-b-stone-300 shadow-xs",
    outline:
      "border-2 border-stone-300 bg-white text-stone-800 hover:bg-stone-50 border-b-4 border-b-stone-400 active:border-b-2 shadow-xs",
    ghost:
      "text-stone-700 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200",
  };

  return `${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim();
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonStyles({ variant, size, className })}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
}

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center text-sm font-medium text-amber-700 hover:text-amber-800 hover:underline min-h-[44px] px-2 py-1 transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TextButton.displayName = "TextButton";

export interface PageContainerProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg";
  className?: string;
}

export function PageContainer({
  children,
  maxWidth = "md",
  className = "",
}: PageContainerProps) {
  const maxWStyles = {
    sm: "max-w-xl", // ~576px (practice)
    md: "max-w-3xl", // ~768px (learning)
    lg: "max-w-5xl", // ~1024px (catalogs & overview)
  };

  return (
    <main className={`mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 ${maxWStyles[maxWidth]} ${className}`}>
      {children}
    </main>
  );
}

export interface LearningCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function LearningCard({
  children,
  className = "",
  title,
}: LearningCardProps) {
  return (
    <section className={`rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs ${className}`}>
      {title && (
        <h3 className="text-base font-semibold text-stone-900 mb-3 tracking-tight">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

export interface MathExpressionProps {
  expression: string;
  result?: number | string;
  size?: "md" | "lg" | "xl";
  className?: string;
}

export function MathExpression({
  expression,
  result,
  size = "lg",
  className = "",
}: MathExpressionProps) {
  const sizeStyles = {
    md: "text-xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-4xl sm:text-5xl",
  };

  return (
    <div
      className={`font-semibold tracking-tight text-stone-900 select-none inline-flex items-center gap-2 ${sizeStyles[size]} ${className}`}
    >
      <span>{expression}</span>
      {result !== undefined && (
        <>
          <span className="text-stone-400 font-normal">=</span>
          <span className="text-emerald-700">{result}</span>
        </>
      )}
    </div>
  );
}

export interface InlineNoticeProps {
  children: ReactNode;
  variant?: "info" | "tip" | "gentle";
  className?: string;
}

export function InlineNotice({
  children,
  variant = "info",
  className = "",
}: InlineNoticeProps) {
  const variantStyles = {
    info: "bg-stone-100 text-stone-800 border-stone-200",
    tip: "bg-amber-50 text-amber-950 border-amber-200",
    gentle: "bg-emerald-50 text-emerald-950 border-emerald-200",
  };

  return (
    <div
      role="note"
      className={`rounded-xl border p-3.5 text-sm leading-relaxed ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
