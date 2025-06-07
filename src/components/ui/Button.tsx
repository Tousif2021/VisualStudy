import React, { useRef } from "react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "outline" | "text" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

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
    bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow
    hover:from-blue-700 hover:to-blue-600
    focus-visible:ring-2 focus-visible:ring-blue-200
    border border-blue-500/80
  `,
  secondary: `
    bg-white text-gray-900 shadow-sm hover:bg-gray-50
    border border-gray-300/80
    focus-visible:ring-2 focus-visible:ring-gray-200
  `,
  outline: `
    bg-white border border-blue-400 text-blue-600 hover:bg-blue-50
    focus-visible:ring-2 focus-visible:ring-blue-100
  `,
  text: `
    bg-transparent text-blue-700 hover:bg-blue-50
    focus-visible:ring-2 focus-visible:ring-blue-100
    border border-transparent
  `,
  danger: `
    bg-gradient-to-br from-red-600 to-red-500 text-white shadow
    hover:from-red-700 hover:to-red-600
    border border-red-500/80
    focus-visible:ring-2 focus-visible:ring-red-200
  `,
  ghost: `
    bg-transparent text-gray-600 hover:bg-gray-100
    border border-transparent
    focus-visible:ring-2 focus-visible:ring-gray-200
  `,
};

// Smaller, pill shaped, soft text!
const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5 rounded-full min-h-[28px] h-7", // small pill
  md: "text-base px-4 py-2 rounded-full min-h-[36px] h-9", // default pill
};

function useRipple(disabled: boolean) {
  const btnRef = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!document.getElementById("premium-ripple-style")) {
      const style = document.createElement("style");
      style.id = "premium-ripple-style";
      style.innerHTML = `
      .premium-ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: premium-ripple 550ms cubic-bezier(0.4, 0, 0.2, 1);
        background: rgba(45, 121, 255, 0.14);
        pointer-events: none;
        z-index: 2;
      }
      @keyframes premium-ripple {
        to {
          transform: scale(2.4);
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
    circle.className = "premium-ripple";
    const oldRipple = button.getElementsByClassName("premium-ripple")[0];
    if (oldRipple) oldRipple.remove();
    button.appendChild(circle);
  }
  return { btnRef, createRipple };
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "sm", // SMALL by default now
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
      whileTap={{ scale: 0.97 }}
      type={props.type || "button"}
      className={`
        relative overflow-hidden select-none
        font-normal focus:outline-none
        inline-flex items-center justify-center gap-2
        transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        ${className}
        ${uppercase ? "uppercase tracking-wider" : ""}
      `}
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
          {children && <span>{children}</span>}
          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};
