import React from 'react';

export interface ToastProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const Toast: React.FC<ToastProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="toast-component" className={'ui-toast variant-' + variant + ' ' + className}>
      {children ? children : <span>Toast Component</span>}
    </div>
  );
};

export default Toast;
