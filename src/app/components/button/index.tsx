import React from 'react';
import button1_styles from './button1.module.css';
import button2_styles from './button2.module.css';
import button3_styles from "./button3.module.css";

const Button1 = ({
    children,
    style,
    animate=false,
    disabled,
    className,
    handleClick,
}: {
    children: React.ReactNode
    style?: React.CSSProperties;
    animate?: boolean;
    disabled?: boolean;
    className?: string;
    handleClick?: () => void;
}) => {
  return (
    <button
      disabled={disabled}
      className={`${className} ${button1_styles.button} ${
        button1_styles.secondary
      } ${animate && button1_styles.animate} `}
      aria-label="Bouton Secondaire"
      role="button"
      style={style}
      onClick={handleClick}
    >
      <i className="fas fa-share" aria-hidden="true"></i>
      {children}
    </button>
  );
};

const Button2 = ({ name, style, handleClick }: {
    name: string,
    style?: React.CSSProperties,
    handleClick?: () => void
}) => {
    return (
        <button
            className={`${button2_styles.button} ${button2_styles.default}`}
            style={{fontWeight: 'bold', fontSize: '1.3rem', width: '200px', marginTop: 'auto', ...style }}
            onClick={handleClick}
        >
            {name}
        </button>
    )
}

const Button3 = ({ children, style, handleClick }: {
    children: React.ReactNode
    style?: React.CSSProperties,
    handleClick?: () => void
}) => {
    return (
        <button
            className={button3_styles.button}
            style={{
                fontWeight: "bold",
                fontSize: "1.3rem",
                width: "200px",
                ...style,
            }}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}

export { Button1, Button2, Button3 };