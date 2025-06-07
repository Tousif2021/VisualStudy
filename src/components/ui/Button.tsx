import React, { useRef } from "react";
import { motion } from "framer-motion";

// Types
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

// Designer border gradients, glass, etc.
const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white
    shadow-[0_2px_12px_0_rgba(0,35,150,0.09)] 
    border border-transparent
    hover:shadow-[0_4px_16px_0_rgba(0,80,255,0.16)]
    focus-visible:ring-2 focus-visible:ring-blue-200
  `,
  secondary: `
    bg-white/90 text-gray-900 shadow-sm hover:bg-white
    border border-gray-200
    focus-visible:ring-2 focus-visible:ring-gray-200
  `,
  glass: `
    bg-white/20 backdrop-blur-xl text-gray-800
    border border-[rgba(180,200,255,0.35)]
    shadow-[inset_0_0_4px_1px_rgba(255,255,255,0.25),0_2px_12px_0_rgba(85,90,120,0.06)]
    hover:bg-white/40
    focus-visible:ring-2 focus-visible:ring-blue-100
  `,
  danger: `
    bg-gradient-to-br from-red-600 via-red-500 to-red-400 text-white
    border border-transparent
    shadow-[0_2px_12px_0_rgba(160,0,0,0.07)]
    hover:shadow-[0_4px_16px_0_rgba(200,0,0,0.17)]
    focus-visible:ring-2 focus-visible:ring-red-200
  `,
  text: `
    bg-transparent text-blue-600 hover:bg-blue-50
    border border-transparent
    focus-visible:ring-1 focus-visible:ring-blue-100
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "text-xs px-2.5 py-1 rounded-full h-6 min-h-[24px] leading-none",
  sm: "text-sm px-3.5 py-1.5 rounded-full h-7 min-h-[28px] leading-none",
  md: "text-base px-5 py-2 rounded-full h-9 min-h-[36px] leading-tight",
};

// Ripple (lux, thin effect)
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
  variant = "glass", // glass by default (super-premium)
  size = "sm", // small by default
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
        backdrop-blur-lg
      `}
      style={{ WebkitBackdropFilter: "blur(12px)" }}
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
