import React, { useRef, forwardRef } from "react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "text";
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationCancel' | 'onAnimationIteration'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  ripple?: boolean;
  uppercase?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white border border-blue-500 shadow-[0_2px_12px_0_rgba(59,130,246,0.15)] hover:from-blue-700 hover:to-blue-600 hover:border-blue-600 hover:shadow-[0_4px_16px_0_rgba(59,130,246,0.25)] focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 active:scale-[0.98]",
  secondary: "bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-offset-2 active:scale-[0.98]",
  outline: "bg-white text-blue-600 border border-blue-300 shadow-sm hover:bg-blue-50 hover:border-blue-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 active:scale-[0.98]",
  ghost: "bg-transparent text-gray-600 border border-transparent hover:bg-gray-100 hover:border-gray-200 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-offset-2 active:scale-[0.98]",
  danger: "bg-gradient-to-br from-red-600 via-red-500 to-red-400 text-white border border-red-500 shadow-[0_2px_12px_0_rgba(239,68,68,0.15)] hover:from-red-700 hover:to-red-600 hover:border-red-600 hover:shadow-[0_4px_16px_0_rgba(239,68,68,0.25)] focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:ring-offset-2 active:scale-[0.98]",
  text: "bg-transparent text-blue-600 border border-transparent hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "text-xs px-2 py-1 rounded-full h-6 min-h-[24px] gap-1",
  sm: "text-sm px-3 py-1.5 rounded-full h-8 min-h-[32px] gap-1.5",
  md: "text-base px-4 py-2 rounded-full h-10 min-h-[44px] gap-2",
  lg: "text-lg px-6 py-3 rounded-full h-12 min-h-[48px] gap-2.5",
  xl: "text-xl px-6 py-3 rounded-xl min-h-[56px] gap-3",
  icon: "w-10 h-10 p-0 flex items-center justify-center min-h-[44px] min-w-[44px]",
};

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
          animation: button-ripple-animation 500ms cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(59, 130, 246, 0.2);
          pointer-events: none;
          z-index: 1;
        }
        @keyframes button-ripple-animation {
          to { 
            transform: scale(2.5); 
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

// PRO: ForwardRef and manual prop passing
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    variant = "secondary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = "",
    disabled,
    ripple = true,
    uppercase = false,
    ...rest
  } = props;

  const { btnRef, createRipple } = useRipple(Boolean(disabled || isLoading || !ripple));

  // Only pass allowed props to <motion.button>
  return (
    <motion.button
      ref={(node) => {
        // Assign both forwardRef and local ripple ref
        btnRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }}
      whileTap={{ scale: 0.96 }}
      type={rest.type || "button"}
      className={`
        relative overflow-hidden select-none
        font-medium focus:outline-none
        inline-flex items-center justify-center
        transition-all duration-200 ease-out
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || isLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
        ${className}
        ${uppercase ? "uppercase tracking-wide" : ""}
      `}
      disabled={disabled || isLoading}
      tabIndex={disabled || isLoading ? -1 : 0}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      onClick={e => {
        if (ripple && !isLoading && !disabled) createRipple(e);
        rest.onClick?.(e);
      }}
      // Don't spread ...rest! Only pass those that are OK for both React and Motion.
      form={rest.form}
      formAction={rest.formAction}
      formEncType={rest.formEncType}
      formMethod={rest.formMethod}
      formNoValidate={rest.formNoValidate}
      formTarget={rest.formTarget}
      name={rest.name}
      value={rest.value}
      autoFocus={rest.autoFocus}
      id={rest.id}
      style={{
        ...rest.style,
        minHeight: size === 'xs' ? '32px' : size === 'sm' ? '40px' : '44px'
      }}
      // Add any other safe button props here!
    >
      {isLoading ? (
        <>
          <span className="opacity-0 flex items-center gap-2">
            {leftIcon && <span>{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span>{rightIcon}</span>}
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin w-4 h-4 text-current" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex items-center justify-center">{leftIcon}</span>}
          {children && <span className="font-medium">{children}</span>}
          {rightIcon && <span className="flex items-center justify-center">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = "Button";