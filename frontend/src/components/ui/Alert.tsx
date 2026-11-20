import React from 'react';

export interface AlertProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Alert: React.FC<AlertProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="alert-component" className={'ui-alert variant-' + variant + ' ' + className}>
      {children ? children : <span>Alert Component</span>}
    </div>
  );
};

export default Alert;
