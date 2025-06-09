import React, { useRef } from "react";
import { motion } from "framer-motion";

// Material 3 variants
type ButtonVariant =
  | "filled"
  | "elevated"
  | "filled-tonal"
  | "outlined"
  | "text"
  | "danger";

type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  ripple?: boolean;
  uppercase?: boolean;
}

// === GENTLE Material 3 style maps ===

const variantStyles: Record<ButtonVariant, string> = {
  filled: `
    bg-blue-200 text-blue-800
    border border-blue-300
    shadow-sm shadow-blue-100
    hover:bg-blue-300 hover:border-blue-400
    focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2
    active:scale-[0.98]
    transform transition-all duration-200
    `,
  elevated: `
    bg-purple-200 text-purple-800
    border border-purple-300
    shadow-sm shadow-purple-100
    hover:bg-purple-300 hover:border-purple-400
    focus-visible:ring-2 focus-visible:ring-purple-200 focus-visible:ring-offset-2
    active:scale-[0.98]
    transform transition-all duration-200
    `,
  "filled-tonal": `
    bg-emerald-200 text-emerald-800
    border border-emerald-300
    shadow-sm shadow-emerald-100
    hover:bg-emerald-300 hover:border-emerald-400
    focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2
    active:scale-[0.98]
    transform transition-all duration-200
    `,
  outlined: `
    bg-white text-gray-700
    border border-gray-300
    shadow-sm shadow-gray-100
    hover:bg-gray-50 hover:border-gray-400
    focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-offset-2
    active:scale-[0.98]
    transform transition-all duration-200
    `,
  text: `
    bg-transparent text-indigo-700
    border border-transparent
    hover:bg-indigo-50
    focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:ring-offset-2
    active:scale-[0.98]
    transform transition-all duration-200
    `,
  danger: `
    bg-red-100 text-red-700
    border border-red-200
    shadow-sm shadow-red-50
    hover:bg-red-200 hover:border-red-300
    focus-visible:ring-2 focus-visible:ring-red-100 focus-visible:ring-offset-2
    active:scale-[0.98]
    transform transition-all duration-200
  `,
};

// Bigger, more prominent Material 3 shapes
const sizeStyles: Record<ButtonSize, string> = {
  xs: "text-sm px-4 py-2 rounded-full h-8 min-h-[32px] gap-2 font-bold",
  sm: "text-base px-6 py-2.5 rounded-full h-10 min-h-[40px] gap-2 font-bold",
  md: "text-lg px-8 py-3 rounded-full h-12 min-h-[48px] gap-3 font-bold",
  lg: "text-xl px-10 py-4 rounded-full h-14 min-h-[56px] gap-3 font-bold",
};

// Enhanced ripple effect
function useRipple(disabled: boolean) {
  const btnRef = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!document.getElementById("button-ripple-styles")) {
      const style = document.createElement("style");
      style.id = "button-ripple-styles";
      style.innerHTML = `
        .button-ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: button-ripple-animation 600ms cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(0, 0, 0, 0.1); /* Softer ripple for gentle buttons */
          pointer-events: none;
          z-index: 1;
        }
        @keyframes button-ripple-animation {
          to {
            transform: scale(3);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  function createRipple(event: React.MouseEvent) {
    if (disabled) return;
    const button = btnRef.current;
    if (!button) return;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.className = "button-ripple";

    const existingRipple = button.querySelector(".button-ripple");
    if (existingRipple) existingRipple.remove();

    button.appendChild(circle);
  }

  return { btnRef, createRipple };
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "filled",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  ripple = true,
  uppercase = false,
  ...props
}) => {
  const { btnRef, createRipple } = useRipple(Boolean(disabled || isLoading || !ripple));

  return (
    <motion.button
      ref={btnRef}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={props.type || "button"}
      className={`
        relative overflow-hidden select-none
        font-bold focus:outline-none
        inline-flex items-center justify-center
        transition-all duration-200 ease-out
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || isLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
        ${className}
        ${uppercase ? "uppercase tracking-wider" : ""}
      `}
      disabled={disabled || isLoading}
      tabIndex={disabled || isLoading ? -1 : 0}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      onClick={e => {
        if (ripple && !isLoading && !disabled) createRipple(e);
        props.onClick?.(e);
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="opacity-0 flex items-center gap-2">
            {leftIcon && <span>{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span>{rightIcon}</span>}
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin w-6 h-6 text-current" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex items-center justify-center">{leftIcon}</span>}
          {children && <span className="font-bold tracking-wide">{children}</span>}
          {rightIcon && <span className="flex items-center justify-center">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};