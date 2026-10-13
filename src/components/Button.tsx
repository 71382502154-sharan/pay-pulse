import React from 'react';

interface ButtonProps {
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ className, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={{
        background: '#166534',
        color: 'white',
        border: 'none',
        borderRadius: '999px',
        padding: '10px 18px',
        fontSize: '14px',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          width: '9px',
          height: '9px',
          background: '#4ADE80',
          borderRadius: '50%',
          display: 'inline-block',
        }}
      />
      Backend Online
    </button>
  );
};

export default Button;
