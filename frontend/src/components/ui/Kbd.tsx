import React from 'react';

export interface KbdProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Kbd: React.FC<KbdProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="kbd-component" className={'ui-kbd variant-' + variant + ' ' + className}>
      {children ? children : <span>Kbd Component</span>}
    </div>
  );
};

export default Kbd;
