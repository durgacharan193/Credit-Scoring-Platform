import React from 'react';

export interface InputProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Input: React.FC<InputProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="input-component" className={'ui-input variant-' + variant + ' ' + className}>
      {children ? children : <span>Input Component</span>}
    </div>
  );
};

export default Input;
