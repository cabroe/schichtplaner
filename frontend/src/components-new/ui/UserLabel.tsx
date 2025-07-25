import React from 'react';
import Label from './Label';

export interface User {
  id: string | number;
  displayName: string;
  color?: string;
  enabled?: boolean;
  avatar?: string;
  initials?: string;
}

export interface UserLabelProps {
  user: User;
  showAvatar?: boolean;
  showStatus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  tooltip?: string;
  onClick?: () => void;
  asButton?: boolean;
}

const UserLabel: React.FC<UserLabelProps> = React.memo(({
  user,
  showAvatar = false,
  showStatus = true,
  size = 'md',
  className = '',
  style,
  tooltip,
  onClick,
  asButton = false
}) => {
  const getVariant = () => {
    if (!user.enabled) {
      return 'danger';
    }
    return 'primary';
  };

  const getColor = () => {
    if (user.color) {
      return user.color;
    }
    // Fallback: Generate color from display name
    const hash = user.displayName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const renderAvatar = () => {
    if (!showAvatar) return null;

    const avatarStyle = {
      backgroundColor: getColor(),
      color: '#fff',
      width: size === 'sm' ? '16px' : size === 'lg' ? '24px' : '20px',
      height: size === 'sm' ? '16px' : size === 'lg' ? '24px' : '20px',
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size === 'sm' ? '10px' : size === 'lg' ? '14px' : '12px',
      marginRight: '8px'
    };

    if (user.avatar) {
      return (
        <span
          className="rounded-circle d-inline-flex align-items-center justify-content-center"
          style={{
            ...avatarStyle,
            backgroundImage: `url(${user.avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      );
    }

    return (
      <span className="rounded-circle d-inline-flex align-items-center justify-content-center" style={avatarStyle}>
        {user.initials || user.displayName.substring(0, 2).toUpperCase()}
      </span>
    );
  };

  const renderStatus = () => {
    if (!showStatus || user.enabled === undefined) return null;

    return (
      <span
        className={`rounded-circle d-inline-block ${user.enabled ? 'bg-success' : 'bg-danger'}`}
        style={{ 
          width: '8px', 
          height: '8px', 
          marginLeft: '4px' 
        }}
      />
    );
  };

  return (
    <Label
      variant={getVariant()}
      size={size}
      className={className}
      style={style}
      tooltip={tooltip || user.displayName}
      onClick={onClick}
      asButton={asButton}
    >
      {renderAvatar()}
      {user.displayName}
      {renderStatus()}
    </Label>
  );
});

UserLabel.displayName = 'UserLabel';

export default UserLabel; 