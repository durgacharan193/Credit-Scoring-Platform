import React from 'react';

export interface SwitchProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Switch: React.FC<SwitchProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="switch-component" className={'ui-switch variant-' + variant + ' ' + className}>
      {children ? children : <span>Switch Component</span>}
    </div>
  );
};

export default Switch;
