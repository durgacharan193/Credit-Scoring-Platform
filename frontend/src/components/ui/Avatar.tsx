import React from 'react';

export interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Avatar: React.FC<AvatarProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="avatar-component" className={'ui-avatar variant-' + variant + ' ' + className}>
      {children ? children : <span>Avatar Component</span>}
    </div>
  );
};

export default Avatar;
