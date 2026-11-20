import React from 'react';

export interface CheckboxProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="checkbox-component" className={'ui-checkbox variant-' + variant + ' ' + className}>
      {children ? children : <span>Checkbox Component</span>}
    </div>
  );
};

export default Checkbox;
