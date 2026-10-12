// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  /** Optional CSS class name (unused in the dummy version) */
  className?: string;
  /** Click handler – kept for API compatibility */
  onClick?: () => void;
}

/**
 * Dummy button component.
 *
 * This placeholder renders nothing (`null`) so it has **no visual effect** on the UI.
 * Keeping the component (instead of deleting the file) avoids import errors
 * if anything still references `Button`.
 */
export const Button: React.FC<ButtonProps> = ({ className, onClick }) => {
  // No UI – just a stub
  return null;
};

export default Button;
