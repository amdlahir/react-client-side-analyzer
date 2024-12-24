import clsx from 'clsx';
import React, { useState } from 'react';
import styles from './styles/button.module.css';

type BtnState = 'default' | 'hover' | 'pressed';
type BtnSize = 'sm' | 'md' | 'lg' | 'xs';

enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  LINK = 'link',
  TEXT = 'text',
}

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  variant: ButtonVariant;
  text: string;
  size: BtnSize;
  color?: string;
  hoverColor?: string;
  pressedColor?: string;
  textColor?: string;
  width?: React.CSSProperties['width'];
  pill?: boolean;
  bezel?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

function Button(props: ButtonProps) {
  const {
    type = 'button',
    variant = ButtonVariant.PRIMARY,
    pill,
    size = 'md',
    color,
    hoverColor,
    pressedColor,
    textColor,
    text,
    disabled = false,
    width,
    bezel = false,
    onClick,
    className,
    style,
  } = props;
  const [btnState, setBtnState] = useState<BtnState>('default');
  const cssClass = clsx(
    styles.btn,
    styles[`btn_${variant}`],
    styles[`btn_${size}`],
    pill && styles.pill,
    bezel && variant !== ButtonVariant.OUTLINE ? styles.bezel : styles.flat,
    className
  );
  const bgColor =
    btnState === 'hover'
      ? hoverColor
      : btnState === 'pressed'
        ? pressedColor
        : color;


  return (
    <button
      type={type}
      disabled={disabled}
      className={cssClass}
      style={{
        background: bgColor,
        color: textColor,
        width,
        ...style,
      }}
      onMouseEnter={() => setBtnState('hover')}
      onMouseLeave={() => setBtnState('default')}
      onMouseDown={() => setBtnState('pressed')}
      onMouseUp={() => setBtnState('hover')}
      onClick={onClick}>
      {text}
    </button>
  );
}

export { Button, ButtonVariant };
