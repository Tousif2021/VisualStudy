import React, { useRef } from "react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "glass" | "danger" | "text";
type ButtonSize = "xs" | "sm" | "md";

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

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white
    border border-blue-500
    shadow-[0_2px_12px_0_rgba(0,35,150,0.09)]
    hover:from-blue-700 hover:to-blue-600 hover:border-blue-600
    focus-visible:ring-2 focus-visible:ring-blue-200
  `,
  secondary: `
    bg-white/90 text-gray-900 border border-blue-300
    shadow-sm
    hover:bg-blue-50 hover:border-blue-400
    focus-visible:ring-2 focus-visible:ring-blue-100
  `,
  glass: `
    bg-white/30 backdrop-blur-lg text-gray-900 border border-blue-300
    hover:bg-white/50 hover:border-blue-500
    focus-visible:ring-2 focus-visible:ring-blue-100
  `,
  danger: `
    bg-gradient-to-br from-red-600 via-red-500 to-red-400 text-white
    border border-red-500
    shadow-[0_2px_12px_0_rgba(160,0,0,0.07)]
    hover:from-red-700 hover:to-red-600 hover:border-red-600
    focus-visible:ring-2 focus-visible:ring-red-200
  `,
  text: `
    bg-white/70 text-blue-700 border border-blue-200
    hover:bg-blue-50 hover:border-blue-400
    focus-visible:ring-1 focus-visible:ring-blue-100
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "text-xs px-2.5 py-1 rounded-full h-6 min-h-[24px] leading-none",
  sm: "text-sm px-3.5 py-1.5 rounded-full h-7 min-h-[28px] leading-none",
  md: "text-base px-5 py-2 rounded-full h-9 min-h-[36px] leading-tight",
};

function useRipple(disabled: boolean) {
  const btnRef = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!document.getElementById("ultra-premium-ripple-style")) {
      const style = document.createElement("style");
      style.id = "ultra-premium-ripple-style";
      style.innerHTML = `
      .ultra-premium-ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ultra-premium-ripple 430ms cubic-bezier(0.3, 0.8, 0.1, 1);
        background: rgba(33, 111, 255, 0.11);
        pointer-events: none;
        z-index: 2;
      }
      @keyframes ultra-premium-ripple {
        to { transform: scale(2.2); opacity: 0; }
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
    circle.className = "ultra-premium-ripple";
    const oldRipple = button.getElementsByClassName("ultra-premium-ripple")[0];
    if (oldRipple) oldRipple.remove();
    button.appendChild(circle);
  }
  return { btnRef, createRipple };
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "glass",
  size = "sm",
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
      whileTap={{ scale: 0.98 }}
      type={props.type || "button"}
      className={`
        relative overflow-hidden select-none
        font-semibold focus:outline-none
        inline-flex items-center justify-center gap-2
        transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
        shadow-sm
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || isLoading ? "opacity-55 cursor-not-allowed" : "cursor-pointer"}
        ${className}
        ${uppercase ? "uppercase tracking-wide" : ""}
        backdrop-blur-md
      `}
      style={{ WebkitBackdropFilter: "blur(10px)" }}
      disabled={disabled || isLoading}
      tabIndex={0}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      onClick={e => {
        if (ripple && !isLoading && !disabled) createRipple(e);
        props.onClick?.(e);
      }}
      {...props}
    >
      {isLoading ? (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="animate-spin w-4 h-4 text-inherit" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-70"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </span>
      ) : (
        <>
          {leftIcon && <span className="flex items-center">{leftIcon}</span>}
          {children && <span className="font-medium">{children}</span>}
          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};
