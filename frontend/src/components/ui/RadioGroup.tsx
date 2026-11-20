import React from 'react';

export interface RadioGroupProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const RadioGroup: React.FC<RadioGroupProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="radiogroup-component" className={'ui-radiogroup variant-' + variant + ' ' + className}>
      {children ? children : <span>RadioGroup Component</span>}
    </div>
  );
};

export default RadioGroup;
