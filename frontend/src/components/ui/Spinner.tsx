import React from 'react';

export interface SpinnerProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Spinner: React.FC<SpinnerProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="spinner-component" className={'ui-spinner variant-' + variant + ' ' + className}>
      {children ? children : <span>Spinner Component</span>}
    </div>
  );
};

export default Spinner;
