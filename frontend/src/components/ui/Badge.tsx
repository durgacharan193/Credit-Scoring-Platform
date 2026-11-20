import React from 'react';

export interface BadgeProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Badge: React.FC<BadgeProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="badge-component" className={'ui-badge variant-' + variant + ' ' + className}>
      {children ? children : <span>Badge Component</span>}
    </div>
  );
};

export default Badge;
