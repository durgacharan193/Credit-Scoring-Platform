import React from 'react';

export interface ProgressBarProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
}

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const { className = '', children, variant = 'default' } = props;
  return (
    <div data-testid="progressbar-component" className={'ui-progressbar variant-' + variant + ' ' + className}>
      {children ? children : <span>ProgressBar Component</span>}
    </div>
  );
};

export default ProgressBar;
