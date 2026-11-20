import React from 'react';

export interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="button-component" className={'ui-button variant-' + variant + ' ' + className}>
      {children ? children : <span>Button Component</span>}
    </div>
  );
};

export default Button;
