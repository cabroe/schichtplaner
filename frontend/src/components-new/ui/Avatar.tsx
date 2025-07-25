import React from 'react';

export interface AvatarProps {
  /** Avatar-Bild URL */
  src?: string;
  /** Fallback-Text (Initialen) */
  fallback?: string;
  /** Avatar-Größe */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** Avatar-Form */
  shape?: 'circle' | 'rounded' | 'square';
  /** Benutzer-Name für Alt-Text */
  alt?: string;
  /** Zusätzliche CSS-Klassen */
  className?: string;
  /** Zusätzliche Styles */
  style?: React.CSSProperties;
  /** Click-Handler */
  onClick?: () => void;
  /** Avatar als Button behandeln */
  asButton?: boolean;
  /** Benutzerdefinierte Hintergrundfarbe */
  backgroundColor?: string;
  /** Benutzerdefinierte Textfarbe */
  textColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  fallback,
  size = 'md',
  shape = 'circle',
  alt = '',
  className = '',
  style,
  onClick,
  asButton = false,
  backgroundColor,
  textColor
}) => {
  const baseClasses = 'avatar';
  const sizeClasses = size !== 'md' ? `avatar-${size}` : '';
  const shapeClasses = shape !== 'circle' ? `avatar-${shape}` : '';
  const buttonClasses = asButton || onClick ? 'avatar-button' : '';
  
  const combinedClasses = [
    baseClasses,
    sizeClasses,
    shapeClasses,
    buttonClasses,
    className
  ].filter(Boolean).join(' ');

  const Component = asButton || onClick ? 'button' : 'span';
  const buttonProps = asButton || onClick ? {
    type: 'button' as const,
    onClick,
    role: 'button',
    tabIndex: 0
  } : {};

  const avatarStyle: React.CSSProperties = {
    ...style,
    ...(backgroundColor && { backgroundColor }),
    ...(textColor && { color: textColor })
  };

  if (src) {
    return (
      <Component
        className={combinedClasses}
        style={{
          ...avatarStyle,
          backgroundImage: `url(${src})`
        }}
        title={alt}
        {...buttonProps}
      >
        {!src && fallback && <span>{fallback}</span>}
      </Component>
    );
  }

  return (
    <Component
      className={combinedClasses}
      style={avatarStyle}
      title={alt}
      {...buttonProps}
    >
      {fallback && <span>{fallback}</span>}
    </Component>
  );
};

export default React.memo(Avatar); 