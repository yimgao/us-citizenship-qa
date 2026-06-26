'use client';

import { type ReactNode, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  ariaLabel?: string;
  /** Scale factor on tap/press (default: 0.95) */
  tapScale?: number;
  /** Scale factor on hover (default: 1.05) */
  hoverScale?: number;
  /** Whether to apply hover animation (default: true) */
  enableHover?: boolean;
  /** Whether to apply tap animation (default: true) */
  enableTap?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  ariaLabel,
  tapScale = 0.95,
  hoverScale = 1.05,
  enableHover = true,
  enableTap = true,
}: AnimatedButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  if (!shouldAnimate) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }

  const spring = { type: 'spring' as const, stiffness: 400, damping: 25 };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      whileTap={enableTap ? { scale: tapScale } : undefined}
      whileHover={enableHover ? { scale: hoverScale } : undefined}
      transition={spring}
    >
      {children}
    </motion.button>
  );
}
